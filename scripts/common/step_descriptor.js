/**
 * @class Steps
 */
hp.Steps = new Class({

    Implements: [Options, CHKOverrides],

    options: {
        itemConstructor: hp.SelectableItemWithSubMenu,
        isSelectTabFromUrl: true,
        isFocusFirstLink: false,
        item:{
            selectionEvent:"null",
            hasKeyDownEvent:"false"
        }
    },

    /**
     * @param {Element} stepsEl
     * @param {Hash} options
     */
    initialize: function (stepsEl, options) {
        this.setOptions(options);
        this.setOverrides();


        this.setSelectedStepFromUrlParam(stepsEl);

        stepsEl.getElements(".js_step_content").hide();


        this.prevButton = stepsEl.getElement(".js_prev");
        this.nextButton = stepsEl.getElement(".js_next");

        this.prevButton.addEvent("click", function(){
            this.switchStep(-1);
        }.bind(this));
        this.nextButton.addEvent("click", function(){
            this.switchStep(1);
        }.bind(this));

        this.menu = new hp.Selectable(stepsEl, this.options || {});
        this.menu.addEvent('selectItem', function (event) {
            this.nextStepAction();
        }.bind(this));

        if (this.menu.selectedItem) {
            var cnt = this.menu.selectedItem.getSubMenuContainerId();
            var cntWrapper = $(cnt);
            if (cntWrapper) {
                cntWrapper.show();
            }
        } else {
            var items = this.menu.menuItems;
            if (items && items.length > 0) {
                items[0].select()
            }
        }

        this.nextStepAction();

        return this.menu;
    },

    switchStep: function(step) {
        for (var i = 0; i < this.menu.menuItems.length; i++) {
            if(this.menu.menuItems[i] == this.menu.selectedItem) {
                this.menu.menuItems[i+step].select();
                this.nextStepAction();
                this.updateHash(this.menu.menuItems[i+step].itemEl);
                break;
            }
        }
    },

    updateHash: function(selectedMenuItem) {
        var newHash = selectedMenuItem.getElement(".js_step_link").get("href");
        newHash = newHash.substr(1);
        window.location.hash = newHash;
    },

    nextStepAction: function() {
        var currentItem;
        this.menu.menuItems.each(function(menuItem, i) {
            if (menuItem == this.menu.selectedItem) {
                currentItem = menuItem;
                if (i == 0) {
                    this.prevButton.addClass("hidden");
                    this.nextButton.removeClass("hidden");
                } else if (i > 0 && i < this.menu.menuItems.length - 1) {
                    this.prevButton.removeClass("hidden");
                    this.nextButton.removeClass("hidden");
                } else {
                    this.prevButton.removeClass("hidden");
                    this.nextButton.addClass("hidden");
                }
            }else if(currentItem){
                menuItem.itemEl.removeClass("selected");
            }else if(!currentItem && !menuItem.itemEl.hasClass("selected")){
                menuItem.itemEl.addClass("selected");
            }
        }.bind(this));
    },

    setSelectedStepFromUrlParam: function (stepsEl) {
        var stepContentMather = /#step=([^=&$]+)/i.exec(window.location.href);
        if (!stepContentMather) {
            return;
        }

        var link = stepsEl.getElement(".js_step_trigger a[rel=step" + stepContentMather[1] + "]");
        if (!link) {
            return;
        }

        link.getParent("div").addClass("current");
    }
});

/**
 *
 * @param {String} stepsSelector
 * @param {Hash} options
 *
 * @return {Steps[]} - array of created objects
 */
hp.Steps.init = function(stepsSelector, options) {
    return $$(stepsSelector || ".step_descriptor").map(function (steps) {
        return new hp.Steps(steps, options);
    });
};