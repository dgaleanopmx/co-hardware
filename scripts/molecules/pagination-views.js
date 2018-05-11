(function(hp) {
    hp.PaginationViews = new Class({
        Implements: [Options],

        options: {
            leftButtonClass: "js_left_button",
            rightButtonClass: "js_right_button",
            leftButtonActiveClass: "icn_left_active",
            rightButtonActiveClass: "icn_right_active",
            leftButtonViewType: "list-view",
            rightButtonViewType: "grid-view"
        },

        element: null,
        leftButton: null,
        rightButton: null,

        initialize: function(element, options) {
            this.setOptions(options);
            this.element = element;

            var self = this;
            this.leftButton = this.element.getElement("." + this.options.leftButtonClass);
            this.leftButton.addEvent("click", function() {
                if (!this.hasClass(self.options.leftButtonActiveClass)) {
                    self._activateLeftButton();
                    self._triggerChangeViewEvent(self.options.leftButtonViewType);
                }
            });
            this.rightButton = this.element.getElement("." + this.options.rightButtonClass);
            this.rightButton.addEvent("click", function() {
                if (!this.hasClass(self.options.rightButtonActiveClass)) {
                    self._activateRightButton();
                    self._triggerChangeViewEvent(self.options.rightButtonViewType);
                }
            });
        },

        _activateLeftButton: function() {
            this.leftButton.addClass(this.options.leftButtonActiveClass);
            this.rightButton.removeClass(this.options.rightButtonActiveClass);
        },

        _activateRightButton: function() {
            this.rightButton.addClass(this.options.rightButtonActiveClass);
            this.leftButton.removeClass(this.options.leftButtonActiveClass);
        },

        _triggerChangeViewEvent: function(viewType) {
            this.element.fireEvent(hp.PaginationViews.EVENT_NAME, { view: viewType });
        }
    });
    hp.PaginationViews.EVENT_NAME = "changeView";
})(window.hp || (window.hp = {}));

hp.PaginationViews.init = function(rootElementSelector, options) {
    $$(rootElementSelector).each(function(element) {
        new hp.PaginationViews(element, options);
    });
};