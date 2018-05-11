hp.PopupManager = new Class({
    popups: [],

    add: function (popup) {
        this.popups.push(popup);
        popup.addEvent("onshow", function () {
            for (var i = 0; i < this.popups.length; i++) {
                var p = this.popups[i];
                if (p != popup && p.isOpen) {
                    p.hide();
                }
            }
        }.bind(this));

        return popup;
    },

    addAll: function(popups) {
        popups.each(function(popup) {
            this.add(popup);
        }.bind(this));
    },

    hide: function () {
        for (var i = 0; i < this.popups.length; i++) {
            var popup = this.popups[i];
            if (popup.isOpen) {
                popup.hide();
            }
        }
    }
});

/**
 * this class should be mixed to popup in order to add accessibility functionality
 * */
hp.PopupAccessibility = new Class({

    addSimpleAccessibility : function (selector) {

        this._initLinks(selector);

        if (this.links && this.links.length > 0) {
            this.addAccessibility(this.links[0], this.links[this.activeLinksNum]);
            this.addKeyPressHandler();
        }

        this.links.each(function(el){
           el.addEvent("keydown", function(event){
               if (event.key  == 'esc'){
                    if (this.isOpen) {
                        this.hide();
                        this._triggerLink().focus();
               }}
               if (event.key  == 'up' || event.key  == 'left' || event.key  == 'tab' && event.shift){this._nextTargetLink(-1); return false;}
               if (event.key  == 'down' || event.key  == 'right' || event.key  == 'tab'){this._nextTargetLink(+1); return false;}
               if (event.key  == 'home'){this._nextTargetLink(0); return false;}
               if (event.key  == 'end'){this._nextTargetLink('last'); return false;}

           }.bind(this));
        }.bind(this));

    },

    addAutoCompleteAccessibility: function(){
        this.triggerEl.addEvent("keydown", function(event){
            if (this._isCharKey(event.key)){
                if (!this.isOpen) {
                    this._getLinksByFirstChar(event.key.toLowerCase());
                    this.show();
                    this.links[this.activeLink].focus();
                }
            }
        }.bind(this));

        this.addEvent("onhide", function() {
                this._removeDisabledState();
        });
    },

    /**
     *
     * @param firstLink
     * @param lastLink
     * */
    addAccessibility : function (firstLink, lastLink) {
        if (firstLink) {
            this._addFirstLinkEvents(firstLink);
        }

        if (lastLink) {
            this._addLastLinkEvents(lastLink);
        }
    },

    addKeyPressHandler :function () {
        this._triggerLink().addEvent("keypress", function (event) {
            if (event.key != 'enter' || this.inTransition) {
                return true;
            }

            if (this.isOpen) {
                this.hide();
            } else {
                this.show();
                this.links[this.activeLink].focus();

            }

            return false;
        }.bind(this));
    },

    _addFirstLinkEvents : function (firstLink) {
        firstLink.addEvent('keypress', function(event) {
            if (event.key == 'tab' && event.shift) {
                this.hide();
                this._triggerLink().focus();
            }
        }.bind(this));
    },

    _addLastLinkEvents: function (lastLink) {
        lastLink.addEvent('keypress', function(event) {
            if (event.key == 'tab' && !event.shift) {
                this.hide();
                this.activeLink = 0;
            }
        }.bind(this));
    },

    _triggerLink: function () {
        return this.triggerEl.nodeName.toLowerCase() == "a" ? this.triggerEl : this.triggerEl.getElement("a");
    },

    _nextTargetLink: function (dir) {
        if(dir != 'last' && dir !== 0){
            this.activeLink += dir;
            this._checkActiveLink();
        }
        else if(dir === 0){
            this.activeLink = 0;
        }
        else if(dir == 'last'){
            this.activeLink = this.activeLinksNum;
        }

        if (this.isOpen){
            this.links[this.activeLink].focus();
        }
        else{ /* if popup not opened just UP DOWN event on trigger*/
          return  this.activeLink;
        }

    },

    _checkActiveLink:function(){
        if(this.activeLink < 0){
            this.activeLink = this.activeLinksNum;
        }
        else if(this.activeLink > this.activeLinksNum){
            this.activeLink = 0;
        }
    },

    _initLinks: function(selector){
        this.links = this.targetEl.getElements(selector || "a:not(.disable):not(.js_disable):not(.hidden)");
        this.activeLinksNum = this.links.length - 1;

        var selectedEl = this.targetEl.getElement(".selected");

        if(selectedEl && selectedEl.getElement("a:not(.disable):not(.js_disable)")){
            this.activeLink = selectedEl.getAllPrevious().length;
        }
        else{
            this.activeLink = 0;
        }

    },

    /* addAutoCompleteAccessibility functions */

    _isCharKey: function(key){
        if(key == 'enter' ||
            key == 'up' ||
            key == 'down' ||
            key == 'left' ||
            key == 'right' ||
            key == 'space' ||
            key == 'backspace' ||
            key == 'tab' ||
            key == 'delete' ||
            key == 'shift' ||
            key == 'control' ||
            key == 'alt' ||
            key == 'capslock' ||
            key == 'pageup' ||
            key == 'pagedown' ||
            key == 'end' ||
            key == 'home' ||
            key == 'numlock' ||
            key == 'scrolllock' ||
            key == ';' ||
            key == '=' ||
            key == ',' ||
            key == '-' ||
            key == '.' ||
            key == '/' ||
            key == '`' ||
            key == '[' ||
            key == '\\' ||
            key == ']' ||
            key == '\'' ||
            key == '+'){
            return false;
        }
        return true;
    },

    _getLinksByFirstChar: function(char){

        var linksFound = false;

        this.links.map(function(link){
            var linkTrim = link.getProperty("text").trim().toLocaleLowerCase();

            if(linkTrim.charAt(0)!= char){
                link.addClass('js_disable');
            }
            else{
                linksFound = true;
            }
        });

        if(linksFound){
            this._initLinks();
        }
        else {
            this._removeDisabledState();
        }
    },

    _removeDisabledState: function(){
        this._initLinks("a:not(.disable)");
        this.links.each(function(link){
            if(link.hasClass('js_disable')){
                link.removeClass('js_disable');
            }
        });
        this._initLinks();   // to properly set of  activeLink

    }
});

hp.HeaderFooterPopup = new Class({
    preventFastClosing: function () {
        this.targetEl.addEvents({
            mouseleave: this.hideWithDelay.bind(this),
            mouseenter: this.openIfClosed.bind(this)
        });
    },

    openIfClosed: function () {
        if (!this.isOpen) {
            this.show();
        }
    },

    hideWithDelay: function () {
        if (this.isOpen) {
            this.hideDelay(this.options.hideDelay);
        }
    }
});