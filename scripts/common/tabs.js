/**
 * @class Tabs
 */
hp.Tabs = new Class({

    Implements: [Options, CHKOverrides],

    options: {
        itemConstructor: hp.SelectableItemWithSubMenu,
        isSelectTabFromUrl: true,
        isFocusFirstLink: false
    },

    /**
     * @param {Element} tabsEl
     * @param {Hash} options
     */
    initialize: function (tabsEl, options) {
        this.setOptions(options);
        this.setOverrides();


        this.setSelectedTabFromUrlParam();
        tabsEl.getNext(".tabs_content").getElements(".js_tab_content").hide();

        var menu = new hp.Selectable(tabsEl, this.options || {});
        menu.addEvent('selectItem', function (event) {
            if (event.previousItem) {
                updateScreenReading(event.previousItem.itemEl, '.js_unselectedTab');
            }

            if (event.currentItem) {
                updateScreenReading(event.currentItem.itemEl, '.js_selectedTab');
            }
        });

        if (menu.selectedItem) {
            var cnt = menu.selectedItem.getSubMenuContainerId();
            var cntWrapper = $(cnt);
            if (cntWrapper) {
                cntWrapper.show();
            }
        } else {
            var items = menu.menuItems;
            if (items && items.length > 0) {
                items[0].select();
            }
        }

        return menu;
    },

    setSelectedTabFromUrlParam: function () {
        var tabContentMather = /#tab=([^=&$]+)/i.exec(window.location.href);
        if (!tabContentMather) {
            return;
        }

        //var rel =  "tab" + tabContentMather[1];
        var link = $$(".tabs .js_tab_trigger a[rel=tab" + tabContentMather[1] + "]");
        if (!link) {
            return;
        }

        link.getParent("div").addClass("current");
    }

});

/**
 *
 * @param {String} tabsSelector
 * @param {Hash} options
 *
 * @return {Tabs[]} - array of created objects
 */
hp.Tabs.init = function(tabsSelector, options) {
    return $$(tabsSelector || ".tabs").map(function (tabs) {
        return new hp.Tabs(tabs, options);
    });
};