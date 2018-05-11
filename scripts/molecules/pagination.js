(function(hp) {
    var integerDivision = function(x, y) {
        return (x - x % y) / y;
    };

    hp.PaginationBase = new Class({
        Implements: [Options],

        options: {
            to: 1,
            from: 1,
            itemsAmount: 1,
            changePageEvent: "changePage"
        },

        rootElement: null,
        currentPage: null,
        lastPage: null,
        step: null,

        initialize: function(options) {
            this.setOptions(options);

            this.step = this.options.to - this.options.from + 1;
            this.currentPage = integerDivision(this.options.to, this.step) - 1;

            var pagesAmount = integerDivision(this.options.itemsAmount, this.step);
            this.lastPage = (this.options.itemsAmount % this.step) ? pagesAmount : pagesAmount - 1;
        },

        changePage: function(page) {
            this.currentPage = page;
            this._triggerChangePageEvent();
        },

        _triggerChangePageEvent: function() {
            var currentStep = this._getCurrentStep(),
                startingItem = this._getStartingItem();

            this.rootElement.fireEvent(this.options.changePageEvent, {
                from: startingItem,
                amount: currentStep
            });
        },

        _getCurrentStep: function() {
            return (this.currentPage == this.lastPage) ? this.options.itemsAmount % this.step || this.step : this.step;
        },

        _getStartingItem: function() {
            return this.currentPage * this.step + 1;
        }
    });

    hp.PaginationWidget = new Class({
        Extends: hp.PaginationBase,

        Implements: [Options],

        options: {
            label: "~~from~~ - ~~to~~ items of ~~countAll~~",
            type: "text_and_arrows",

            rootElementClass: "js_paging",
            labelElementClass: "js_paging_cnt",
            backButtonClass: "js_page_back",
            forwardButtonClass: "js_page_forward",
            backButtonDisabledClass: "disabled_back",
            forwardButtonDisabledClass: "disabled_forward",
            bothButtonsDisabledClass: "disabled_both"
        },

        TEXT_AND_ARROWS_TYPE: "text_and_arrows",
        ARROWS_ONLY_TYPE: "arrows_only",
        TEXT_ONLY_TYPE: "text_only",

        labelElement: null,
        backButtonElement: null,
        forwardButtonElement: null,
        backButtonDisabled: false,
        forwardButtonDisabled: false,

        initialize: function(options) {
            this.parent(options);
            this.setOptions(options);
            this.rootElement = $$("." + this.options.rootElementClass);
            this.changePage(this.currentPage);

            if (this.options.type != this.TEXT_ONLY_TYPE) {
                // Attaching event handlers
                var backButtonElement = this.rootElement.getElement("." + this.options.backButtonClass),
                    forwardButtonElement = this.rootElement.getElement("." + this.options.forwardButtonClass);

                backButtonElement.addEvent("click", function() {
                    if (!this.backButtonDisabled) {
                        this.changePage(this.currentPage - 1);
                    }
                }.bind(this));

                forwardButtonElement.addEvent("click", function() {
                    if (!this.forwardButtonDisabled) {
                        this.changePage(this.currentPage + 1);
                    }
                }.bind(this));
            }
        },

        changePage: function(page) {
            this.parent(page);
            this._changeLabel();
            this._changeButtonsState();
        },

        _changeLabel: function() {
            if (this.options.type == this.TEXT_AND_ARROWS_TYPE
                || this.options.type == this.TEXT_ONLY_TYPE) {
                var currentStep = this._getCurrentStep(),
                    startingItem = this._getStartingItem(),
                    endingItem = startingItem + currentStep - 1;

                this.labelElement = this.labelElement || this.rootElement.getElement("." + this.options.labelElementClass);
                this.labelElement.set("html",
                    this.options.label
                        .replace("~~from~~", startingItem)
                        .replace("~~to~~", endingItem)
                        .replace("~~countAll~~", this.options.itemsAmount)
                );
            }
        },

        _changeButtonsState: function() {
            this.backButtonDisabled = (this.currentPage == 0);
            this.forwardButtonDisabled = (this.currentPage == this.lastPage);

            if (this.backButtonDisabled && this.forwardButtonDisabled) {
                this.rootElement.addClass(this.options.bothButtonsDisabledClass);
                return;
            }

            this.rootElement.removeClass(this.options.bothButtonsDisabledClass);
            this.rootElement.toggleClass(this.options.backButtonDisabledClass, this.backButtonDisabled);
            this.rootElement.toggleClass(this.options.forwardButtonDisabledClass, this.forwardButtonDisabled);
        }
    });

    hp.PaginationDotWidget = new Class({
        Extends: hp.PaginationBase,

        Implements: [Options],

        options: {
            rootElementClass: "js_dot_paging",
            inactiveDotClass: 'icn_pag_dot_inactive',
            activeDotClass: 'icn_pag_dot_active'
        },

        activeDot: null,

        initialize: function(options) {
            this.parent(options);
            this.rootElement = $$("." + this.options.rootElementClass);
            this.activeDot = this.rootElement.getElement("span." + this.options.activeDotClass);
            var currentPage = this.activeDot.getParent("a").getProperty("rel");
            this.changePage(currentPage);

            var self = this;
            this.rootElement.getElements("a").each(function(dot) {
                dot.addEvent("click", function() {
                    var nextPage = this.getProperty("rel");
                    self.changePage(nextPage);
                });
            })
        },

        changePage: function(page) {
            if (page != this.currentPage) {
                this.parent(page);
                this._activateDot(page);
            }
        },

        _activateDot: function(page) {
            var newDotElement = this.rootElement.getElement('a[rel="' + page + '"] > span');
            if (newDotElement != this.activeDot) {
                this.activeDot.addClass(this.options.inactiveDotClass);
                this.activeDot.removeClass(this.options.activeDotClass);

                newDotElement.addClass(this.options.activeDotClass);
                newDotElement.removeClass(this.options.inactiveDotClass);

                this.activeDot = newDotElement;
            }
        }
    });
}(window.hp || (window.hp = {})));

hp.PaginationWidget.init = function(options) {
    new hp.PaginationWidget(options);
};
hp.PaginationDotWidget.init = function(options) {
    new hp.PaginationDotWidget(options);
};