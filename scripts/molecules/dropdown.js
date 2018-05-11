hp.BasicDropdown = new Class({

    Extends: CHKCustomPopUp,

    Implements: [hp.PopupAccessibility],

    options: {
        isSortType: false
    },


    initialize: function (dd) {

        var trigger = dd.getElement('.js_dd_trigger');
        var target = dd.getElement('.js_dd_target');

        //need to prevent default keypress
        this.parent(trigger, target, {showEvent: null, hideEvent: null, enableTargetToggle: true, enableKeypress: false});

        if(dd.hasClass("js_disabled")){
            return;
        }

        trigger.addEvent('click',this.showHandler.bind(this));

        this.addHideElement(target.getElement('.js_dd_header'), 'click');

        this.addEvents({
            onshow: function() {
                dd.removeClass("dd_close");
                dd.addClass("dd_open");
                dd.setStyle('z-index', 3);

                this.checkDirection();
            },

            onhide: function() {
                dd.removeClass("dd_open");
                dd.addClass("dd_close");
                dd.setStyle('z-index', 2);

                this.removeDirectionClasses();
            }
        });

        this.targetEl.addEvent('click', function () {
            this.hide();
            this.triggerEl.getElement("a").focus();
        }.bind(this));

        this.addSimpleAccessibility();
        this.addAutoCompleteAccessibility();
    },

    checkDirection: function () {
        var itemsList = this.targetEl.getElements(".dd_list_items");
        var listHeight = 0;
        if (itemsList[0]) {
            listHeight = itemsList[0].getCoordinates().height;
        } else {
            itemsList = this.targetEl.getElements(".dd_item");
            for (var i = 0, len = itemsList.length; i < len; i++) {
                listHeight += itemsList[i].offsetHeight;
            }
        }

        var label = this.triggerEl.getElement(".dd_label");
        var toUp = label.getCoordinates().top - window.getScroll().y;
        var toDown = window.getSize().y - toUp;

        if (toDown < listHeight && toUp >= listHeight) { // if to down does not fit
            var labelHeight = label.offsetHeight;

            var marginTop = -listHeight - labelHeight;
            itemsList[0].setStyle('margin-top', marginTop + 'px');
            this.changeDirectionClasses("up");

            var labelTri = this.triggerEl.getElement(".dd_label");
            var gap = labelTri.offsetHeight - labelHeight;
            label.setStyle('margin-top', gap + 'px');
        } else {
            itemsList[0].setStyle('margin-top', 0);
            this.changeDirectionClasses("down");

            label.setStyle('margin-top', 0);
        }
    },

    changeDirectionClasses: function(direction){
        if(direction == "up"){
            this.targetEl.addClass('dd_upside');
            this.triggerEl.addClass('dd_trigger_upside');
            this.targetEl.removeClass('dd_downside');
            this.triggerEl.removeClass('dd_trigger_downside');
        }else{
            this.targetEl.addClass('dd_downside');
            this.triggerEl.addClass('dd_trigger_downside');
            this.targetEl.removeClass('dd_upside');
            this.triggerEl.removeClass('dd_trigger_upside');
        }
    },

    removeDirectionClasses: function(){
        this.targetEl.removeClass('dd_downside');
        this.triggerEl.removeClass('dd_trigger_downside');
        this.targetEl.removeClass('dd_upside');
        this.triggerEl.removeClass('dd_trigger_upside');
    }

});

hp.SortDropdown = new Class({

    Extends: hp.BasicDropdown,

    options: {
        selected: null,
        onChange: null
    },

    initialize: function(dd,options) {
        this.parent(dd);
        this.dd = dd;

        this.isSortType = true;
        this.setOptions(options || {});

        // NOTE: set first value from input value
        this.input = dd.getElement('.js_dd_input');
        this.reset();

        this.isError = false;
        this.preLabel = dd.getElement(".js_prelabel") || false;
        if(dd.hasClass("js_error")){
            this.isError = true;
            if(this.preLabel){
                this.preLabel.setStyle("display","none");
            }
        }

        var self = this;
        this.items = this.targetEl.getElements('.dd_item a');

        this.findSelectedItem();


        this.items.addEvent("click", function () {
            self.selectItem(this.get('text'), this.get('data-value'));
            self.addSelectedClass(this.getParent()); // select current item

            if(self.isError === true){
                var el = self.dd.getElement(".dd_error");
                if(el && el.removeClass("dd_error")){}
                if(self.preLabel){
                    self.preLabel.setStyle("display","inline");
                }
            }
            self.fireEvent("onChange");
        });


        if(this.options.onChange){
            this.addEvent("onChange", this.options.onChange);
        }

        hp.addWidgetToFormCollection(this.dd, this);

        this.addExtraAccessibility();
    },

    findSelectedItem: function(){
            if(this.options.selected){ //select item from options
                this.items.each(function(item){
                   var dd_item = item.getParent();
                   if(item.get('text') == this.options.selected){
                       this.selectItem(item.get('text'), item.get('data-value'));
                       this.addSelectedClass(dd_item);
                   }else{
                       this.removeSelectedClass("selected");
                   }
                }.bind(this));
            }else{ //select item with class "selected"
                this.items.each(function(item){
                   if(item.getParent().hasClass("selected")){
                       this.selectItem(item.get('text'), item.get('data-value'));
                       this.addSelectedClass();
                   }
                }.bind(this));
            }
    },

    selectItem: function(text,value){
        this.input.value = value;
        this.reset(text);
    },

    addSelectedClass: function(dd_item){
        this.items.getParent().removeClass("selected"); //unselect all items
        if(dd_item){
            dd_item.addClass("selected");  // select current item
        }
        this.targetEl.addClass('selected');
        this.triggerEl.addClass('selected');
    },

    removeSelectedClass: function(dd_item){
        if(dd_item){
            dd_item.removeClass("selected");
        }
        this.targetEl.removeClass('selected');
        this.triggerEl.removeClass('selected');
    },

    reset: function (text) {
        this.dd.getElements(".js_dd_input_value").each(function (e) {
            var height = e.getHeight();
            this.cropTextByHeight(text || this.input.value,e,e,height+Math.floor(height/2));
            //e.set("text", text || this.input.value);
            if(!text && this.items){
                this.items.getParent().removeClass("selected"); //unselect all items
                this.removeSelectedClass();
            }
        }.bind(this));
    },

    cropTextByHeight:function (text, targetEl, heightEl, maxHeight) {
        if (!targetEl) {
            return;
        }
        targetEl.set('text', text);
        if (heightEl.offsetHeight > maxHeight && text.length > 0) {
            var newText = '';
            targetEl.innerHTML = '';
            var i = 0;
            while (heightEl.offsetHeight <= maxHeight && i < text.length) {
                i += 1;
                newText = targetEl.innerHTML;
                targetEl.innerHTML = text.substr(0, i) + '...';
            }
            targetEl.innerHTML = newText;
        }
    },

    addExtraAccessibility: function(){
        this.triggerEl.addEvent('keydown', function(event){
            if (event.key  == 'up' || event.key  == 'left'){
                this._setNextTargetLink(-1);
                return false;
            }
            if (event.key  == 'down' || event.key  == 'right'){
                this._setNextTargetLink(1);
                return false;
            }
        }.bind(this));
    },

    _setNextTargetLink: function(dir){
        var curLink = this._nextTargetLink(dir);
        var item =  this.items[curLink];
        this.selectItem(item.get('text'), item.get('data-value'));
        this.addSelectedClass(item.getParent());
    }
});

function initDropDownsSelects(dropdownSelector,options) {
    var manager = new hp.PopupManager();

    options = options || {};

    var dropDownClass = this;
    $$(dropdownSelector || '.js_dd').each(function (dd) {
        manager.add(new dropDownClass(dd,options));
    });

    $$(document.body).addEvent('click', function() {
        manager.hide();
    });
}

hp.BasicDropdown.init = initDropDownsSelects;
hp.SortDropdown.init = initDropDownsSelects;