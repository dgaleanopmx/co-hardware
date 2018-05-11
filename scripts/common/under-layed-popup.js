var UnderLayedPopup = new Class({

    Extends : CHKCustomPopUp,

    options : {
        syncFlash: false,
        popupOptions : {
            tabIndex : 10,
            showEvent : 'click',
            hideEvent : null,
            useFx : true,
            fxOpenStyle : {
                opacity : 1
            },
            fxOpenStylePre : {
                opacity : 0,
                display : 'block',
                visibility : 'visible'
            },
            fxCloseStyle : {
                opacity : 0
            },
            fxCloseStylePost : {
                opacity : 0,
                display : 'none',
                visibility : 'hidden'
            },
            fxDuration : 100,
            fxTransition : Fx.Transitions.Sine.easeInOut,
            enableKeypress : false
        },
        closeElsClass : '.js_pop_close',
        closeIfClickOnDarkenLayer : false
    },

    initialize : function(triggerEl, targetEl, options) {
        triggerEl = $(triggerEl);
        targetEl = $(targetEl);

        if (!triggerEl || !targetEl) {
            return;
        }

        this.setOptions(options || {});
        this.parent(triggerEl, targetEl, this.options.popupOptions);

        this.initDarkenLayer();
        this.initCloseButtons();

        this.bindEvents();
        this.checkFlash();
        this.hide(true);
        this.targetEl.inject($(document.body));
    },

    initDarkenLayer : function() {
        UnderLayedPopup.DARKEN_LAYER.init();
        if (this.options.closeIfClickOnDarkenLayer) {
            this.addHideElement(UnderLayedPopup.DARKEN_LAYER.darkenEl);
        }
    },

    /**
     * @method initCloseButtons
     * @description initialize close button(s) with events
     */
    initCloseButtons : function() {
        var closeEls = this.targetEl.getElements(this.options.closeElsClass);
        closeEls.setProperty('tabindex', this.options.tabIndex + 1);
        closeEls.addEvent('click', function(event) {
            event.stop();
            this.hide();
        }.bind(this));
    },

    /**
     * @method bindEvents
     * @description setup show/hide events to control darken layer, its height
     *              and also opens proper accordion element
     */
    bindEvents : function() {
        this.addEvent('onshow', this.onPopupShow.bind(this));
        this.addEvent('onhide', this.onPopupHide.bind(this));
    },

    /**
     * @method checkFlash
     * @description if flash sync fix needed (flash keeps playing in ie when element is hidden)
     * it stores flash object as a string that will be used to insert flash object when popup is opened
     */
    checkFlash: function() {
        if (this.options.syncFlash) {
            var flashEl = this.targetEl.getElement('object');
            if (flashEl) {
                this.flashWrapEl = (new Element('div')).addClass('fsh-syn').wraps(flashEl);
                this.flashContentEl = this.flashWrapEl.get('html');
            }
        }
    },

    /**
     * @method syncFlash
     * @param display {Boolean} - if true - will inject flash string, otherwise - remove it from flash wrapper
     * @description if flash sync fix needed (flash keeps playing in ie when element is hidden)
     * it stores flash object as a string that will be used to insert flash object when popup is opened
     */
    syncFlash: function(display) {
        if (this.options.syncFlash && this.flashWrapEl) {
            this.flashWrapEl.set('html', display ? this.flashContentEl : '');
        }
    },

    /**
     * @method onPopupHide
     * @description popup hide event handler
     */
    onPopupHide: function() {
        UnderLayedPopup.DARKEN_LAYER.hide();
        this.syncFlash(false);
    },

    /**
     * @method onPopupShow
     * @description popup showing event handler
     */
    onPopupShow : function() {
        UnderLayedPopup.DARKEN_LAYER.showFor(this.targetEl);
        this.syncFlash(true);
    }

});

UnderLayedPopup.DARKEN_LAYER = {

    layerClass : "pop_drk",

    init : function() {
        if (!this.darkenEl) {
            this.darkenEl = (new Element('div')).set({
                'class' : this.layerClass,
                'opacity' : ' 0.8'
            });
            this.darkenEl.inject($(document.body));
            this.darkenEl.hide();
        }
    },

    /**
     * @method showFor
     * @description initialize darken layer as a static variable, coz no need to
     *              create the same for each popup
     */
    showFor : function(targetEl) {
        var bodyEl = $(document.body);

        if (document.dir == 'rtl' && Browser.Engine.trident && !isIE10) {
            targetEl.setStyles({
                top : bodyEl.getScrollTop(),
                marginRight : -targetEl.getWidth() / 2
            });
        } else {
            targetEl.setStyles({
                top : bodyEl.getScrollTop(),
                marginLeft : -targetEl.getWidth() / 2
            });
        }

        this.darkenEl.setStyle('height', bodyEl.getScrollHeight());
        this.darkenEl.show();
    },

    hide : function() {
        this.darkenEl.hide();
    }
};

function initUnderLayedPopup(triggerClass, targetAttr, options) {
    triggerClass = triggerClass || '.js_overlay_trigger';
    targetAttr = targetAttr || 'rel';
    options = options || {};
    options.syncFlash = true;

    var groupByRel = {};

    $$(triggerClass).each(function(triggerEl) {
        var rel = triggerEl.getProperty(targetAttr);
        var targetEl = $(rel);
		var aElemTabindex, inputElemTabindex = new Array();
		

        if (!groupByRel[rel]) {
            var popup = new UnderLayedPopup(triggerEl, targetEl, options);
            popup.addEvents({
                onTransitionComplete: function (popup) {
                    if (!popup.isOpen) {
                        return;
                    }

                    var link = targetEl.getElement("a");
                    if (link) {
                        link.focus();
                    }
					
					if($$('a').get('tabindex').length > 0 ) {
							aElemTabindex = $$('a').get('tabindex');
							$$('a').setProperty('tabindex','-1');
					}
					
					if($$('input').get('tabindex').length > 0 ) {
						inputElemTabindex = $$('input').get('tabindex');
						$$('input').setProperty('tabindex','-1');
					}
					popup.targetEl.getElements('a').setProperty('tabindex','251');
					
                },

                onhide: function () {
                    triggerEl.focus();
					if(aElemTabindex.length > 0 ) 
						$$('a').each(function(el,i){el.setProperty('tabindex',aElemTabindex[i])});
				    if(inputElemTabindex.length > 0 ) 
						$$('input').each(function(el,i){el.setProperty('tabindex',inputElemTabindex[i])});
						
					$$('.js_overlay_trigger').setProperty('tabindex','250');	
				}
				
				
            });

            groupByRel[rel] = popup;
        } else {
            groupByRel[rel].addShowElement(triggerEl);
        }
    });

    return groupByRel;
}

function initUnderLayedPopupWithBrithcove(triggerClass, targetAttr, options) {
    var groupByRel = initUnderLayedPopup(triggerClass, targetAttr, options);
    if (typeof brightcove == "undefined") {
        return;
    }

    for (var rel in groupByRel) {
        groupByRel[rel].addEvent("onshow", function () {
            if (typeof brightcove != "undefined") {
                brightcove.createExperiences();
            }
        })
    }
}