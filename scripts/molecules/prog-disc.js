hp.ProgressiveDisclosure = new Class({

    initialize: function(progDisc) {
		var openItemIndex = this.openByUrlParam();
        var items = progDisc.getElements('.prog-disc-item-header');
        this.items = items.map(function(itemElement, index) {
            var item = new hp.ProgressiveDisclosureItem(itemElement, {opened:(openItemIndex!=null && openItemIndex == index)});
            item.addEvent("itemStateChanged", this.buttonState.bind(this));

            return item;
        }.bind(this));

        this.expButon = this.initAllButton(progDisc.getElement('.js_prg_dsc_exp'), "openItem");
        this.clpButon = this.initAllButton(progDisc.getElement('.js_prg_dsc_clp'), "closeItem");

        this.buttonState();
    },

    initAllButton: function (button, itemAction) {
        if (button) {
            button.itemAction = itemAction;

            button.addEvent('click', function() {
                this.toggleAll(button);
            }.bind(this));
        }
        return button;
    },

    toggleAll:function(btn) {
        if (this.isEnableButton(btn)) {
            this.items.each(function(elem) {
                elem[btn.itemAction]();
            });
        }
    },

    //toggle +/- button
    buttonState :function() {
        var allClosed = true;
        var allOpened = true;
        this.items.each(function(elem) {
            var isOpen = elem.isOpen();
            allOpened = allOpened && isOpen;
            allClosed = allClosed && !isOpen;
        });

        this.disable(this.clpButon, allClosed);
        this.disable(this.expButon, allOpened);
    },

    isEnableButton: function(btn) {
        return !btn.hasClass('disabled');
    },

    disable: function (element, isDisabled) {
        if (element) {
            if (isDisabled) {
                element.addClass('disabled');
            } else {
                element.removeClass('disabled');
            }
        }
    },

	openByUrlParam: function () {
        var pdContentMather = /[?#&][\/]?pd=([^=&$]+)/i.exec(window.location.href);
        if (!pdContentMather || isNaN(pdContentMather[1])) {
            return null;
        }

		return parseInt(pdContentMather[1], 10)-1;
    }
});

hp.ProgressiveDisclosureItem = new Class({

    Implements: [Options, Events],

    options: {
        fx: {wait: false, duration: 500, transition: Fx.Transitions.Sine.easeInOut},
        closeStyles: {display:"none", height : 0, 'padding-bottom' : 0, 'padding-top' : 0},
        closeEffect: {height : 0},
		opened:false
    },

    initialized: false,

    initialize: function(item, options) {
        this.setOptions(options);

        this.item = item;
        this.toggler = this.item.getElement('.js_prg_dsc_trg');
        this.content = this.item.getNext('.js_prg_dsc_cnt');
        this.content.setStyles(this.options.closeStyles);
		if (this.options.opened) {
			this.openItem(true);
		}

        this.toggler.addEvent('click', this.toggleItem.bind(this));
    },

    _popupHeight: function () {
        this.fx = new Fx.Morph(this.content, this.options.fx);

        this.fx.addEvent('complete', function() {
            if (!this.isOpen()) {
                this.content.hide();
            }
            this.fireEvent("itemStateChanged");
        }.bind(this));

        this.content.show();

        var res = this.content.getScrollHeight();

        return  res <= 0 ? 0 : res;

    },

    openItem :function(skipFx) {
        if(!this.initialized){
            this.popupHeight = this._popupHeight();
            this.initialized = true;
        }

		if (skipFx) {
			this.content.setStyles({display:"block", height : this.popupHeight});
		} else {
			this.fx.start({display:"block", height : this.popupHeight});
		}
        this.toggler.addClass('opened');
    },

    closeItem :function() {
        this.toggler.removeClass('opened');
        this.fx.start(this.options.closeEffect);
    },

    toggleItem :function() {
        if(this.isOpen()) {
            this.closeItem();
        } else {
            this.openItem();
        }
    },

    isOpen:function() {
        return this.toggler.hasClass('opened');
    }
});

hp.ProgressiveDisclosure.init = function (selector) { 
    return $$(selector || '.js_prog_disc').map(function(progDisc) {
        return new hp.ProgressiveDisclosure(progDisc);
    });
};