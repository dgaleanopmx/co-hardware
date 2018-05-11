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
		closeElsClass : '.js_pop_close'
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
		this.hide();
		this.targetEl.inject($(document.body));
	},

	/**
	 * @method initDarkenLayer
	 * @description initialize darken layer as a static variable, coz no need to
	 *              create the same for each popup
	 */
	initDarkenLayer : function() {
		this.darkenEl = new Element('div', {
			'class' : 'pop_drk',
			'opacity' : ' 0.8'
		});
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
		this.darkenEl.dispose();
        this.syncFlash(false);
	},

	/**
	 * @method onPopupShow
	 * @description popup showing event handler
	 */
	onPopupShow : function() {
		var bodyEl = $(document.body);
		this.targetEl.setStyles({
			top : bodyEl.getScrollTop(),
			marginLeft : -this.targetEl.getWidth() / 2
		});

		this.darkenEl.setStyle('height', bodyEl.getScrollHeight());
		this.darkenEl.inject(bodyEl);
        this.syncFlash(true);
	}

});

function initUnderLayedPopup(triggerClass, targetAttr, options) {
    triggerClass = triggerClass || '.js_vdo_trigger';
    targetAttr = targetAttr || 'rel';
    options = options || {};
    options.syncFlash = true;

    var groupByRel = {};

    $$(triggerClass).each(function(triggerEl) {
        var rel = triggerEl.getProperty(targetAttr);
        var targetEl = $(rel);

        if (!groupByRel[rel]) {
            groupByRel[rel] = new UnderLayedPopup(triggerEl, targetEl,
                    options);
        } else {
            groupByRel[rel].addShowElement(triggerEl);
        }
    });
}

window.addEvent('domready', function() {
	initUnderLayedPopup();
	// Hide all Progressive Disclosure Divs
	$$('.progressive_disclosure_inner').slide('hide');
	
	// Remove the hidden class from the Other Topics Selector
	////$$('.other-topics-select').removeClass('hidden');

	// Progressive Disclosure Functionality
	$$( '.progressive_disclosure' ).each(function(item){
		// Adding progressive disclosure class with javascript so the plus/minus sign doesn't show up when javascript is disabled
		$$('.progressive_disclosure_icon').addClass('pd_plus');
		
		// Make Each Progressive Disclosure Trigger Div a click function
		$$('.progressive_disclosure_trigger').addEvent('click', function(){
			// Toggle Progressive Disclosure open
			this.getParent('.progressive_disclosure').getElement('div.progressive_disclosure_inner').slide('toggle');
			
			// Swap the Plus/Minus icon depending on the state (has class pd_plus or pd
			if (this.getElement('span.progressive_disclosure_icon').hasClass('pd_plus') == true) {
				this.getElement('span.progressive_disclosure_icon').removeClass('pd_plus');
				this.getElement('span.progressive_disclosure_icon').addClass('pd_minus');
				
			} else if (this.getElement('span.progressive_disclosure_icon').hasClass('pd_minus') == true) {
				this.getElement('span.progressive_disclosure_icon').removeClass('pd_minus');
				this.getElement('span.progressive_disclosure_icon').addClass('pd_plus');
			}
		});
	});
	
});
