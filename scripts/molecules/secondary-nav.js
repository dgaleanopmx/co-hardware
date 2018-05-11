hp.SecondaryNavItem = new Class({
    Extends: hp.SelectableItemWithSubMenu,

    initialize: function (item, options) {
        this.parent(item, options);
    },

    select: function () {
        this.itemEl.addClass(this.options.selectionClass);
        this.fireEvent("selectItem", this);
        return true;
    },

    initAnimateContainer: function (cnt) {
        new hp.AnimatedContainer(cnt, this.options.container);

        this.addEvents({
            selectItem: function () {
                var snav = $(cnt).getParent(".secondary_nav");
                if (snav.hasClass("js-opened")) {
                    cnt.show();
                } else {
                    cnt.effectShow();
                }
            },
            unselectItem: function () {
                var snav = $(cnt).getParent(".secondary_nav");
                if (snav.hasClass("js-opened")) {
                    //cnt.hide();
                } else {
                    //cnt.effectHide();
                }
            }
        });

        if (cnt) {
            cnt.addEvent("after-opening", function () {
                this.getElement("a").focus();
            });
        }
    }

});

/**
 * @class SecondaryNav
 */
hp.SecondaryNav = new Class({

    Implements: [Options, CHKOverrides],

    options: {
        dockRoot: null,
        docked: false,
        dockInitOffset: 0,
        level2Selector: ".level2 .js_menu",
        itemConstructor: hp.SecondaryNavItem,
        item: {
            container: {
                opening: {
                    state: "opening",
                    before: {opacity: 0, height: 0, 'padding-top':0, display: 'block'},
                    effect: {opacity: 1, height: null, 'padding-top':18 },
                    beforeAction: function (cnt) {
                        if(!isIE6){
                            cnt.getElement("a").focus();
                        }
                        var parent = $(cnt).getParent(".secondary_nav");
                        parent.addClass("js-opened");
                        parent.removeClass("js-closed");
                    }
                },
                closing: {
                    state: "closing",
                    effect: {opacity : 0,height:0, 'padding-top':0 },
                    after: {opacity: 1, height:null, 'padding-top':null, display:'none'},
                    beforeAction: function (cnt) {
                        var parent = $(cnt).getParent(".secondary_nav");
                        parent.addClass("js-closed");
                        parent.removeClass("js-opened");
                    }
                },
                options: {duration: 500, transition: Fx.Transitions.Sine.easeOut, link: 'cancel'}
            }
        },
        level3: {
            itemsSelector: ".js_menu li",
            itemConstructor: hp.SelectableItemWithSubMenu,
            level4: {}
        }
    },

    /**
     * @param {Element} nav
     * @param {Hash} options
     */
    initialize: function (nav, options) {
        this.nav = nav;
        this.setOptions(options);
        this.setOverrides();

        var menu = new hp.MultiSelectable(nav.getElement(this.options.level2Selector), this.options);

        menu.addEvent("selectItem", function (event) {

            var prevContainer = event.previousItem && event.previousItem.getSubMenuContainerId();
            var currentContainer = event.currentItem.getSubMenuContainerId();

            var currCntWrapper = $(currentContainer);
            var prevCntWrapper = $(prevContainer);
            if (currCntWrapper) {
                if (nav.hasClass("js-opened") && prevContainer && currentContainer) {
                    prevCntWrapper.hide();
                    currCntWrapper.show();
                    return;
                }
            }

//            if (prevCntWrapper) {
//                if (prevCntWrapper.effectHide) {
//                    prevCntWrapper.effectHide();
//                } else {
//                    prevCntWrapper.hide();
//                }
//            }

            if (currCntWrapper) {
                if (currCntWrapper.effectShow) {
                    currCntWrapper.effectShow();
                } else {
                    currCntWrapper.show();
                    var link = currCntWrapper.getElement("a");
                    if (link && link.isVisible()) {
                        link.focus();
                    }
                }
            }
        });

        if (menu.selectedItem) {
            var cnt = menu.selectedItem.getSubMenuContainerId();
            var cntWrapper = $(cnt);
            if (cntWrapper) {
                cntWrapper.show();
                cntWrapper.open = true;
                this.options.item.container.opening.beforeAction(cntWrapper);
                cntWrapper.addClass("js-first-time");

                (function () {
                    if (cntWrapper.open && cntWrapper.hasClass("js-first-time")) {
                        cntWrapper.removeClass("js-first-time");
                        cntWrapper.effectHide()
                    }
                }).delay(2500)
            }
        }

        nav.addEvent("mouseleave", function () {
            if (nav.hasClass("js-opened")) {
                var subMenuEl = $(menu.selectedItem.getSubMenuContainerId());
                if (subMenuEl && !cntWrapper.hasClass("js-first-time")) {
                    subMenuEl.effectHide();
                }
            }
        });

        this.dockRoot = nav.getElement(this.options.level2Selector).getParent(".js_dock");

        if(this.dockRoot != null) {
            this.initDock();
        }

        menu.menuItems.each(this.initLevel1Item.bind(this));
    },

    /**
     * @memberOf SecondaryNav
     *
     * */
    initDock: function() {
        this.dockInitOffset = this.dockRoot.offsetTop;
        window.addEvent("scroll", function(){
            if (!this.docked && (this.dockRoot.getCoordinates().top - $$("body")[0].getScrollTop() < 0)) {
                this.dockRoot.setStyles({top: 0, position: "fixed"});
                this.dockRoot.addClass("docked");
                this.docked = true;
            } else if (this.docked && $$("body")[0].getScrollTop() <= this.dockInitOffset) {
                this.dockRoot.setStyles({top: this.dockInitOffset + 'px', position: "static"});
                this.dockRoot.removeClass("docked");
                this.docked = false;
            }
        }.bind(this));
    },

    /**
     * @memberOf SecondaryNav
     *
     * @param {SelectableItem} item -
     * */
    initLevel1Item: function (item) {
        var container = $(item.getSubMenuContainerId());
        if (!container) {
            return;
        }

        item.itemEl.addEvent("enter", function () {
            if (item.isSelected() && this.nav.hasClass("js-closed")) {
                container.effectShow();
            }
        }.bind(this));

        var menuL2 = new hp.Selectable(container.getElement(".level3"), this.options.level3);
        menuL2.menuItems.each(function (item) {
            var subMenuEl = item.getSubMenuEl();
            if (subMenuEl) {
                new hp.Selectable(subMenuEl);
            }
        });

        container.getElement(".snav_arr").addEvent("click", function () {
            container.effectHide();
        });
    }
});

/**
 * @return {SecondaryNav[]} - array of created objects
 */
hp.SecondaryNav.init = function(secondaryNavSelector, options) {
    return $$(secondaryNavSelector || ".secondary_nav").map(function (secondaryNav) {
        return new hp.SecondaryNav(secondaryNav, options);
    });
};