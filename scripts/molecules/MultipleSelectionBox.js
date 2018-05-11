/**
 *  MultipleSelectionItem Class
 */
hp.MultipleSelectionItem = new Class({

    Implements: [Options],

    options: {
        selectionClass: "selected"
    },

    itemEl: null,

    initialize: function(itemEl, options) {
        if (!itemEl) {
            return;
        }

        this.itemEl = itemEl;
        this.setOptions(options);

        var selectionHandler = this.selectionHandler.bind(this);

        itemEl.addEvents({
            "click": selectionHandler,
            "keypress": function (event) {
                if(event.key == "enter") {
                    selectionHandler(event);
                }
            }
        });
    },

    selectionHandler: function (e) {
        e.stopPropagation();
        if (this.isSelected()) {
           this.unselectItem();
        } else {
            if( !this.itemEl.hasClass("disabled") && !this.itemEl.getParent("ul").getParent("div").hasClass("multiselect_disabled") ) {
                this.selectItem();
            }
        }
    },

    selectItem: function(){
        this.itemEl.addClass(this.options.selectionClass);
        this.setValue(this.itemEl.getParent().getParent().getElement(".js_ms_value"), this.itemEl.getElement(".js_multiselect_item"));
    },

    unselectItem: function(){
       this.itemEl.removeClass(this.options.selectionClass);
       this.itemEl.getElement("a").blur();
       this.removeValue(this.itemEl.getParent().getParent().getElement(".js_ms_value"), this.itemEl.getElement(".js_multiselect_item"));
    },


    isSelected: function () {
        return this.itemEl.hasClass(this.options.selectionClass);
    },

    setValue: function(valueEl, selectedEl) {
        var currentValue = valueEl.getProperty("value");
        var selectedValue = selectedEl.getProperty("value");
        if (currentValue == "") {
            currentValue = "'" + selectedValue +"'";
        } else {
            currentValue = currentValue.substr(1,currentValue.length-2);
            currentValue += ",'" + selectedValue +"'";
        }
        valueEl.setProperty("value", "["+currentValue+"]");

    },

    removeValue: function(valueEl, selectedEl){
        var currentValue = valueEl.getProperty("value");
        var selectedValue = selectedEl.getProperty("value");
        if (currentValue == "") {
            return;
        } else {
            currentValue = currentValue.split(";");
            var j;
            currentValue.each(function(value, i){
                if(value == selectedValue){
                    j = i;
                }
            });
            currentValue.splice(j, 1);
            currentValue = currentValue.join(";");
            valueEl.setProperty("value", currentValue);
        }
    }

});

hp.MultipleSelectionBox = new Class({

    boxEl: null,
    enabled: null,
    boxClass: null,

    initialize: function(boxClass, enabled) {

        this.enabled = enabled;
        this.boxClass = boxClass;
        this.boxEl = $(document.body).getElement("." + boxClass);
        this.itemBox = [];
        this.boxEl.getElements("li").each(function(item) {
                var msItem = new hp.MultipleSelectionItem(item);
                this.itemBox.push(msItem);
        }.bind(this));

        hp.addWidgetToFormCollection(this.boxEl, this);
    },

    getSelectedItems: function() {
        // TODO implicit declaration!
        if(this.enabled){
            values = this.boxEl.getParent().getElement(".js_ms_value").getProperty("value");
        } else {
            values = false;
        }

        return values;
    },

    addItem: function(title, value, disabled) {
        var copy = this.boxEl.getElement(".js_ms_template").clone();
        copy.removeClass("hidden");
        copy.removeClass("js_ms_template");
        copy.getElement("a").set('html', title);
        copy.getElement("span").set('html', title);
        if(disabled){
            copy.addClass("disabled");
            copy.getElement("a").addClass("hidden");
            copy.getElement("span").removeClass("hidden");
        }
        new hp.MultipleSelectionItem(copy);
        copy.getElement(".js_multiselect_item").setProperty("value", value);
        copy.inject(this.boxEl, "bottom");
    },

    isBoxEnabled: function(){
        return this.boxEl.getParent().hasClass("multiselect_enabled");
    },

    disableBox: function() {
        var boxParent = this.boxEl.getParent();
        boxParent.getElement(".js_ms_value").setProperty("name", "");
        boxParent.removeClass("multiselect_enabled");
        boxParent.addClass("multiselect_disabled");

        this.boxEl.getElements("a").each(function(link) {
            if (!link.hasClass("hidden")) {
                link.addClass("hidden");
            }
        });
        this.boxEl.getElements("span").each(function(span) {
            if (span.hasClass("hidden")) {
                span.removeClass("hidden");
            }
        });
        this.enabled = false;
    },

    enableBox: function() {
        var boxParent = this.boxEl.getParent();
        boxParent.getElement(".js_ms_value").setProperty("name", this.boxClass);
        boxParent.removeClass("multiselect_disabled");
        boxParent.addClass("multiselect_enabled");

        this.boxEl.getElements("li").each(function(item) {
            if (item.hasClass("disabled")) {
                item.removeClass("disabled");
            }
        });

        this.boxEl.getElements("a").each(function(link) {
            if (link.hasClass("hidden")) {
                link.removeClass("hidden");
            }
        });

        this.boxEl.getElements("span").each(function(span) {
            if (!span.hasClass("hidden")) {
                span.addClass("hidden");
            }
        });
        this.enabled = true;
    },

    reset: function(){
         this.itemBox.each(function(item) {
            item.unselectItem();
        }.bind(this));
    }

});

hp.MultipleSelectionBox.init = function (initData){
    return initData.map(function (data) {
        return new hp.MultipleSelectionBox(data.boxClass, data.enabled);
    });
};