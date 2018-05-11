var CustomPopup = new Class({
    Extends: hp.AnimatedContainer,
    Implements: Events,

    initialize:function (cnt, options) {
        this.parent(cnt, options);
        this.popup = cnt;
        this.popup.hide();
        this.isOpen = false;
    },

    show:function() {
        this.popup.effectShow();
        this.isOpen = true;
        this.fireEvent("onshow");
    },

    hide:function() {
        this.popup.effectHide();
        this.isOpen = false;
        this.fireEvent("onhide");
    },

    toggle:function() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }

});