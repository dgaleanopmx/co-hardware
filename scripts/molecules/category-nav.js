var CategoryNavTrigger = new Class({

    initialize:function (trigger) {
        this.element = trigger;

        this.getLink().addEvents({
            click:this.fireSelectEvent.bind(this),

            keypress:function (event) {
                if (event.key == "enter") {
                    event.stop();

                    this.fireSelectEvent();
                }
            }.bind(this)
        });
    },

    fireSelectEvent:function () {
        this.element.fireEvent("cat-nav-select", {initiator:this});
    },

    isSelected:function () {
        return this.getLink().hasClass("selected");
    },

    markSelected:function () {
        this.getLink().addClass("selected");
    },

    clearSelection:function () {
        this.getLink().removeClass("selected");
    },

    getLink:function () {
        return this.element.getFirst("a");
    }
});

var CategoryNav = new Class({

    selected:null,
    accordion:null,

    /**
     * @param {Element} root
     * */
    initialize:function (root, options) {
        this.onSelectHandler = options && options.onSelect;
        this.findChildren(root);
    },

    findChildren:function (root) {
        var triggers = [];
        var targets = [];
        var selectedIndex = -1;

        root.getChildren("li").each(function (li, index) {
            var trigger = this.createTrigger(li.getFirst(".js_cat_nav_trigger"));
            var target = li.getFirst(".js_cat_nav");

            if (selectedIndex == -1 && trigger.isSelected()) {
                selectedIndex = index;
                this.selected = trigger;
            }

            if (target) {
                var lastLi = target.getLast('li');
                if (lastLi) {
                    lastLi.addClass('lst_chld');  //Need for IEs
                }
                triggers.push(trigger.getLink());
                if (target.getFirst('li')) {
                    trigger.element.addClass("close");
                }
                targets.push(target);
                this.findChildren(target);
            }
        }.bind(this));

        if (triggers.length > 0) {
            this.initAccordion(root, triggers, targets, {display:selectedIndex});
        }
    },

    initAccordion:function (root, triggers, targets, options) {
		this.accordion = new Fx.Accordion(root, triggers, targets, $extend({
            opacity:false,
			height:true,
            display:-1,
            duration:500,
            alwaysHide:false,

			onStart:function() {
				if (isIE6) {
					$each(this.from, function(el){
						if (el.height[0].value==0) el.height[0].value=1;
					});
					$each(this.to, function(el){
						if (el.height[0].value==0) el.height[0].value=1;
					});
				}
			},

            onActive:function (link) {
                var parent = link.getParent();
                if (parent.getNext().getFirst('li')) {
                    parent.removeClass("close");
                    parent.addClass("open");
                    var ulEl = parent.getNext();
                    ulEl.setStyle('display','list-item');
                }
            }.bind(this),

            onBackground:function (link) {
                var parent = link.getParent();
                if (parent.getNext().getFirst('li')) {
                    parent.removeClass("open");
                    parent.addClass("close");
                }
            }.bind(this)
        }, options));
    },

    createTrigger:function (trigger) {
        trigger.addEvent("cat-nav-select", function (event) {
            if (!event || !event.initiator || event.initiator == this.selected) {
                return;
            }

            if (this.selected) {
                this.selected.clearSelection();
            }

            this.selected = event.initiator;
            this.selected.markSelected(true);
            if (this.onSelectHandler) {
                this.onSelectHandler(trigger.get('rel'));
            }
        }.bind(this));

        return new CategoryNavTrigger(trigger);
    }

});

var initCatNavWidget = function (catNavWidgetClass) {
    $$(catNavWidgetClass || '.js_cat_nav').each(function (el) {
        new CategoryNav(el);
    });
};

var CategoryNavRenderer = new Class({

    initialize:function () {

        this.containerTemplate = Handlebars.compile($('category-nav-container').innerHTML);
        var categoryNodeTemplate = Handlebars.compile($('category-item').innerHTML);

        Handlebars.registerHelper('categoryItem', function (context) {
            return categoryNodeTemplate(this);
        });
    },

    render:function (data) {
        return this.containerTemplate(data);
    }

});

var CategoryNavDefaultDataAdapter = function (data) {
    if (!data) return {items:[]};
    var result = [];
    var items = {};

    var addNodes = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            if (items[nodes[i].id]) {
                nodes[i].items = items[nodes[i].id];
                addNodes(nodes[i].items);
            }
        }
    };

    var item, newItem, pid;
    for (var i = 0; i < data.length; i++) {
        //[id,pid,name,count,isSelected]
        //[0, 1,  2,   3,   ,4]
        item = data[i];

        data[i][4] ? data[i][4] = "selected" : data[i][4] = "";

        newItem = {id:data[i][0], label:data[i][2], count:data[i][3], selected:data[i][4]};

        pid = data[i][1];
        if (pid == null) {
            result.push(newItem);
        } else {
            if (!items[pid]) {
                items[pid] = [];
            }
            items[pid].push(newItem);
        }
    }

    addNodes(result);

    return {items:result};
};

var DynamicCategoryNav = new Class({
    initialize:function (targetClass, catNavWidgetClass) {
        this.targetClass = targetClass;
        this.catNavWidgetClass = catNavWidgetClass || '.js_cat_nav';
        this.renderer = new CategoryNavRenderer();
        this.dataAdapter = CategoryNavDefaultDataAdapter; // default data adapter
    },
    create:function (data, options) {
        var dataObject = this.dataAdapter(data);
        dataObject.title = options.title || "";
        var renderer = this.renderer;
        $$(this.targetClass).each(function (el) {
            var html = renderer.render(dataObject);
            el.set('html', html);
        });
        $$('.js_category_navigation').getFirst(this.catNavWidgetClass).each(function (el) {
            new CategoryNav(el, options);
        });
    },
    dispose:function () {
        $$(this.targetClass).each(function (el) {
            el.set('html', '');
        });
    }
});

function initCategoryNav(data) {

            /*var data = [
                ['All results', null, 'All results', 421, true],
                ['Product and Servises', null, 'Product and Servises', 121, false],
                ['Product and Servises|Laptops and Notebooks', 'Product and Servises', 'Laptops and Notebooks', 68, false],
                ['Product and Servises|Desktops and All in Ones', 'Product and Servises', 'Laptops and Notebooks', 22, false],
				['Product and Servises 2', null, 'Product and Servises 2', 121, false],
				['Product and Servises|Laptops and Notebooks', 'Product and Servises 2', 'Laptops and Notebooks', 68, false],
				['Product and Servises|Desktops and All in Ones', 'Product and Servises 2', 'Laptops and Notebooks', 22, false],
				['Product and Servises 3', null, 'Product and Servises 3', 121, false],
				['Product and Servises|Laptops and Notebooks', 'Product and Servises 3', 'Laptops and Notebooks', 68, false],
				['Product and Servises|Desktops and All in Ones', 'Product and Servises 3', 'Laptops and Notebooks', 22, false]
            ];*/

            var catNav = new DynamicCategoryNav('.js_cn_container');
            catNav.create(data, {
                title:"Narrow by",
                onSelect: function (id) {
//                alert(id);
                }
            });
        }