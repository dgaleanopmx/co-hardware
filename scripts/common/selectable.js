/**
 * @class SelectableItem
 *
 * @events:
 *      selectItem -
 *      unselectItem -
 * */
hp.SelectableItem = new Class({
    Implements: [Options, Events],

    options: {
        selectionClass: "selected",
        selectionEvent: "click",
        hasKeyDownEvent:"true"
    },

    /**
     * @constructor
     *
     * @param {Element} itemEl
     * @param {Hash} options
     * */
    initialize: function (itemEl, options) {
        if (!itemEl) {
            return;
        }
        this.itemEl = itemEl;
        this.setOptions(options);

        var select = this.select.bind(this);

        itemEl.addEvent(this.options.selectionEvent, select);
        if(this.options.hasKeyDownEvent === "true"){
            itemEl.addEvent("keydown",
                function (event) {
                    if(event.key == "enter") {
                        select();
                    }

                    return true;
                }
            );
        }
    },

    select: function () {
        if (this.isSelected()) {
            return false;
        }

        this.itemEl.addClass(this.options.selectionClass);
        this.fireEvent("selectItem", this);
        return true;
    },

    /**
     * @memberOf SelectableItem
     * */
    unselect: function () {
        if (!this.isSelected()) {
            return;
        }

        this.itemEl.removeClass(this.options.selectionClass);
        this.fireEvent("unselectItem", this);
    },

    /**
     * @memberOf SelectableItem
     * */
    isSelected: function () {
        return this.itemEl.hasClass(this.options.selectionClass);
    }
});

/**
 * @class SelectableItemWithSubMenu
 * */
hp.SelectableItemWithSubMenu = new Class({
    Extends: hp.SelectableItem,

    options: {
        isFocusFirstLink: true
    },

    initialize: function (itemEl, options) {
        this.parent(itemEl, options);

        var container =  $(this.getSubMenuContainerId());
        if (!container) {
            return;
        }

        if (this.options.container) {
            this.initAnimateContainer(container);
        } else {
            this.initSimpleContainer(container);
        }
    },

    initSimpleContainer: function (cnt) {
        this.addEvents({
            selectItem: function () {
                cnt.show();

                if (this.options.isFocusFirstLink) {
                    this.focusFirstLink(cnt);
                }
            },

            unselectItem: function () {
                cnt.hide();
            }
        });
    },

    focusFirstLink: function (cnt) {
        var firstLink = cnt.getElement("a");
        if (firstLink) {
            if (isIE6 || isIE7 || isIE8) {
                (function () {
                    if (firstLink.isVisible()) {
                        firstLink.focus();
                    }
                }).delay(100)
            } else {
                firstLink.focus();
            }
        }
    },

    initAnimateContainer: function (cnt) {
        new hp.AnimatedContainer(cnt, this.options.container);

        this.addEvents({
            selectItem: function () {
                cnt.effectShow();
            },
            unselectItem: function () {
                cnt.effectHide();
            }
        });

        if (cnt) {
            cnt.addEvent("after-opening", function () {
                this.getElement("a").focus();
            });
        }
    },

    /**
     * @memberOf SelectableItemWithSubMenu
     * */
    getSubMenuContainerId: function() {
        return this.itemEl.getElement("a").get("rel");
    },

    /**
     * @memberOf SelectableItemWithSubMenu
     * */
    getSubMenuEl: function () {
        var subMenuContainer = $(this.getSubMenuContainerId());
        if (!subMenuContainer) {
            return null;
        }

        if (subMenuContainer.hasClass("js_menu")) {
            return subMenuContainer;
        }

        return subMenuContainer.getElement(".js_menu");
    }
});

/**
 * fire events
 * */
hp.Selectable = new Class({
    Implements: [Options, Events, CHKOverrides],

    selectedItem: null,

    options: {
        itemsSelector: null,
        itemConstructor:hp.SelectableItem
    },

    initialize: function (menu, options) {
        this.setOptions(options);
        this.setOverrides();

        this.menuItems = this.getItemElements(menu).map(function (itemEl) {
            if (!itemEl.hasClass("disabled")) {
                var item = this.createMenuItem(itemEl, this.options.item);
                item.addEvents({
                    selectItem: this.onSelectItem.bind(this),
                    unselectItem: this.onUnSelectItem.bind(this)
                });

                if (item.isSelected()) {
                    this.selectedItem = item;
                }
                return item;
            }
        }.bind(this));

        this.handleTabNavigation();

    },

    /**
     *  TODO should be done as strategy
     *
     **/
    onUnSelectItem: function (item) {
        if (this.selectedItem == item) {
            this.selectedItem = null;
            this.setDividers(item.itemEl, "active");
        }
    },

    onSelectItem: function (item) {
        var event = {
            previousItem: this.selectedItem,
            currentItem : item
        };

        if (this.selectedItem) {
            this.selectedItem.unselect();
        }
        this.selectedItem = item;
        this.setDividers(item.itemEl, "active");
        this.fireEvent("selectItem", event);
    },

    getItemElements: function (menuEl) {
        if (this.options.itemsSelector) {
            return menuEl.getElements(this.options.itemsSelector);
        } else {
            return menuEl.getChildren();
        }
    },

    createMenuItem: function (itemEl, options) {
        return new this.options.itemConstructor(itemEl, options);
    },

    handleTabNavigation : function () {
        this._addFirstItemEvents(this.menuItems[0]);
        this._addLastItemEvents(this.menuItems.getLast());
    },

    _addFirstItemEvents : function (firstItem) {
        if(firstItem){
            firstItem.itemEl.getElement("a").addEvent('keydown', function(event) {
                if (event.key == 'tab' && event.shift) {
                    this.fireEvent("leaveToPrev");
                    this.fireEvent("leave");
                }

                return true;
            }.bind(this));
        }
    },

    _addLastItemEvents: function (lastItem) {
        if(lastItem){
            lastItem.itemEl.getElement("a").addEvent('keydown', function(event) {
                if (event.key == 'tab' && !event.shift) {
                    this.fireEvent("leaveToNext");
                    this.fireEvent("leave");
                }

                return true;
            }.bind(this));
        }
    },

    setDividers: function(itemEl, className){
        if(!itemEl.hasClass("disabled")) {
            var prevDivider = itemEl.getPrevious(".js_tabs_divider");
            this.toggleDivider(prevDivider, className);
            var nextDivider = itemEl.getNext(".js_tabs_divider");
            this.toggleDivider(nextDivider, className);
        }
    },

    toggleDivider: function(dividerEl, className){
        if (dividerEl != null) {
            if(dividerEl.hasClass(className)) {
                dividerEl.removeClass(className);
            } else {
                dividerEl.addClass(className);
            }
        }
    }
});

hp.MultiSelectable = new Class({
    Extends: hp.Selectable,

    initialize: function (item, options) {
        this.parent(item, options);
    },

    onSelectItem: function (item) {
        var event = {
            previousItem: this.selectedItem,
            currentItem : item
        };

        if (this.selectedItem && this.selectedItem !=  item) {
            this.selectedItem.unselect();
        }
        this.selectedItem = item;
        this.setDividers(item.itemEl, "active");
        this.fireEvent("selectItem", event);
    }
});