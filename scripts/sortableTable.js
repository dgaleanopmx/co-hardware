hp.SortableTable = new Class({

    getOptions: function() {
        return {
            overCls: false,
            onClick: false,
            sortOn: 0,
            sortOrder: 'ASC',
            filterHide: true,
            filterHideCls: 'hide',
            filterSelectedCls: 'selected'
        };
    },

    /**
     * @param {HTMLElement} table
     * @param {Hash} options
     * */
    initialize: function(table, options) {
        this.setOptions(this.getOptions(), options);
        this.table = table;
        this.tHead = this.table.getElement('thead');
        this.tBody = this.table.getElement('tbody');
        this.tFoot = this.table.getElement('tfoot');
        this.elements = this.tBody.getElements('tr');
        this.filtered = false;

        this.elements.each(function(el) {
            if (this.options.overCls) {
                el.addEvent('mouseover', function() {
                    el.addClass(options.overCls);
                }, this);
                el.addEvent('mouseout', function() {
                    el.removeClass(options.overCls);
                });
            }
            if (this.options.onClick) {
                el.addEvent('click', options.onClick);
            }
        }, this);

        //setup header
        this.tHead.getElements('th').each(function(el, i) {
            if (!el.hasClass('js_sort_col')) {
                return;
            }

            el.addEvent('click', this.sort.bind(this, i));
            el.addEvent('mouseover', function() {
                el.addClass('tableHeaderOver');
            });
            el.addEvent('mouseout', function() {
                el.removeClass('tableHeaderOver');
            });

            var axis = el["data-axis"];
            if (!axis || !SortableTable.DATA_COMPARATORS[axis]) {
                axis = "string"
            }

            el.compare = function(row1, row2) {
                function findData(elem) {
                    var child = elem.getFirst();
                    if (child) {
                        return findData(child);
                    } else {
                        return elem.innerHTML.trim();
                    }
                }

                var var1 = findData(row1.getChildren()[i]);
                var var2 = findData(row2.getChildren()[i]);

                return hp.SortableTable.DATA_COMPARATORS[axis](el.sortOrder, var1, var2);
            };

            if (i == this.options.sortOn) {
                el.fireEvent('click');
            }
        }, this);
    },

    sort: function(index) {
        if (this.options.onStart) {
            this.fireEvent('onStart');
        }

        //
        this.options.sortOn = index;
        var header = this.tHead.getElements('th');
        var el = header[index];

        header.each(function(e, i) {
            if (i != index) {
                e.removeClass('sortedASC');
                e.removeClass('sortedDESC');
            }
        });

        if (el.hasClass('sortedASC')) {
            el.removeClass('sortedASC');
            el.addClass('sortedDESC');
            el.sortOrder = 'DESC';
        } else if (el.hasClass('sortedDESC')) {
            el.removeClass('sortedDESC');
            el.addClass('sortedASC');
            el.sortOrder = 'ASC';
        } else {
            if (this.options.sortOrder == 'ASC') {
                el.addClass('sortedASC');
                el.sortOrder = 'ASC';
            } else if (this.options.sortOrder == 'DESC') {
                el.addClass('sortedDESC');
                el.sortOrder = 'DESC';
            }
        }

        //
        this.elements.sort(el.compare);
        this.elements.injectInside(this.tBody);

        //

        if (this.filtered) {
            this.filteredAltRow();
        } else {
            this.altRow();
        }

        this.elements.getElements('.sorted').each(function(e) {
            e.removeClass('sorted');
        });

        for(var i=0,num=this.elements.length; i<num; i++){
            this.elements[i].getChildren()[index].addClass('sorted')
        }

        //
        if (this.options.onComplete) {
            this.fireEvent('onComplete');
        }
    },

    altRow: function() {
        altRow(this.elements);
    },

    filteredAltRow: function() {
        altRow(this.table.getElements('.' + this.options.filterSelectedCls));
    },

    filter: function(form) {
        var form = $(form);
        var col = 0;
        var key = '';

        form.getChildren().each(function(el) {
            if (el.id == 'column') {
                col = Number(el.value);
            }
            if (el.id == 'keyword') {
                key = el.value.toLowerCase();
            }
            if (el.type == 'reset') {
                el.addEvent('click', this.clearFilter.bind(this));
            }
        }, this);

        if (key) {
            this.elements.each(function(el) {
                if (this.options.filterHide) {
                    el.removeClass('altRow');
                }
                if (el.getChildren()[col].firstChild.data.toLowerCase().indexOf(key) > -1) {
                    el.addClass(this.options.filterSelectedCls);
                    if (this.options.filterHide) {
                        el.removeClass(this.options.filterHideCls);
                    }
                } else {
                    el.removeClass(this.options.filterSelectedCls);
                    if (this.options.filterHide) {
                        el.addClass(this.options.filterHideCls);
                    }
                }
            }, this);
            if (this.options.filterHide) {
                this.filteredAltRow();
                this.filtered = true;
            }
        }
    },

    clearFilter: function() {
        this.elements.each(function(el) {
            el.removeClass(this.options.filterSelectedCls);
            if (this.options.filterHide) {
                el.removeClass(this.options.filterHideCls);
            }
        }, this);
        if (this.options.filterHide) {
            this.altRow();
            this.filtered = false;
        }
    }

});

hp.SortableTable.implement(new Events);
hp.SortableTable.implement(new Options);

hp.SortableTable.DATA_COMPARATORS = {
    number: function (sortOrder, var1, var2) {
        var1 = parseFloat(var1);
        var2 = parseFloat(var2);

        if (sortOrder == 'ASC') {
            return var1 - var2;
        } else {
            return var2 - var1;
        }
    },

    string: function (sortOrder, var1, var2) {
        var1 = var1.toUpperCase();
        var2 = var2.toUpperCase();

        if (var1 == var2) {
            return 0
        }

        if (sortOrder == 'ASC') {
            if (var1 < var2) {
                return -1
            }

        } else {
            if (var1 > var2) {
                return -1
            }

        }
        return 1;
    },

    data: function (sortOrder, var1, var2) {
        function getDate(str) {
            // inner util function to convert 2-digit years to 4
            function fixYear(yr) {
                yr = +yr;
                if (yr < 50) {
                    yr += 2000;
                }
                else if (yr < 100) {
                    yr += 1900;
                }
                return yr;
            }

            var strTime;
            if (str.length > 12) {
                strTime = str.substring(str.lastIndexOf(' ') + 1);
                strTime = strTime.substring(0, 2) + strTime.substr(-2)
            } else {
                strTime = '0000';
            }

            var ret;
            // YYYY-MM-DD
            if (ret = str.match(/(\d{2,4})-(\d{1,2})-(\d{1,2})/)) {
                return (fixYear(ret[1]) * 10000) + (ret[2] * 100) + (+ret[3]) + strTime;
            }
            // DD/MM/YY[YY] or DD-MM-YY[YY]
            if (ret = str.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/)) {
                return (fixYear(ret[3]) * 10000) + (ret[2] * 100) + (+ret[1]) + strTime;
            }
            return 999999990000; // So non-parsed dates will be last, not first
        }

        var1 = parseFloat(getDate(var1));
        var2 = parseFloat(getDate(var2));

        if (sortOrder == 'ASC') {
            return var1 - var2;
        } else {
            return var2 - var1;
        }
    },

    currency: function (sortOrder, var1, var2) {
        var1 = parseFloat(var1.substr(1).replace(',', ''));
        var2 = parseFloat(var2.substr(1).replace(',', ''));

        if (sortOrder == 'ASC') {
            return var1 - var2;
        } else {
            return var2 - var1;
        }
    }
};

function initSortableTables() {
    $$('.js_sortable_table').each(function (el) {
        new hp.SortableTable(el);
    });
}