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

/*
---

script: Fx.Slide.js

name: Fx.Slide

description: Effect to slide an element in and out of view.

license: MIT-style license

authors:
  - Valerio Proietti

requires:
  - Core/Fx
  - Core/Element.Style
  - /MooTools.More

provides: [Fx.Slide]

...
*/

Fx.Slide = new Class({

	Extends: Fx,

	options: {
		mode: 'vertical',
		wrapper: false,
		hideOverflow: true,
		resetHeight: false
	},

	initialize: function(element, options){
		element = this.element = this.subject = document.id(element);
		this.parent(options);
		options = this.options;

		var wrapper = element.retrieve('wrapper'),
			styles = element.getStyles('margin', 'position', 'overflow');

		if (options.hideOverflow) styles = Object.append(styles, {overflow: 'hidden'});
		if (options.wrapper) wrapper = document.id(options.wrapper).setStyles(styles);

		if (!wrapper) wrapper = new Element('div', {
			styles: styles
		}).wraps(element);

		element.store('wrapper', wrapper).setStyle('margin', 0);
		if (element.getStyle('overflow') == 'visible') element.setStyle('overflow', 'hidden');

		this.now = [];
		this.open = true;
		this.wrapper = wrapper;

		this.addEvent('complete', function(){
			this.open = (wrapper['offset' + this.layout.capitalize()] != 0);
			if (this.open && this.options.resetHeight) wrapper.setStyle('height', '');
		}, true);
	},

	vertical: function(){
		this.margin = 'margin-top';
		this.layout = 'height';
		this.offset = this.element.offsetHeight;
	},

	horizontal: function(){
		this.margin = 'margin-left';
		this.layout = 'width';
		this.offset = this.element.offsetWidth;
	},

	set: function(now){
		this.element.setStyle(this.margin, now[0]);
		this.wrapper.setStyle(this.layout, now[1]);
		return this;
	},

	compute: function(from, to, delta){
		return [0, 1].map(function(i){
			return Fx.compute(from[i], to[i], delta);
		});
	},

	start: function(how, mode){
		if (!this.check(how, mode)) return this;
		this[mode || this.options.mode]();

		var margin = this.element.getStyle(this.margin).toInt(),
			layout = this.wrapper.getStyle(this.layout).toInt(),
			caseIn = [[margin, layout], [0, this.offset]],
			caseOut = [[margin, layout], [-this.offset, 0]],
			start;

		switch (how){
			case 'in': start = caseIn; break;
			case 'out': start = caseOut; break;
			case 'toggle': start = (layout == 0) ? caseIn : caseOut;
		}
		return this.parent(start[0], start[1]);
	},

	slideIn: function(mode){
		return this.start('in', mode);
	},

	slideOut: function(mode){
		return this.start('out', mode);
	},

	hide: function(mode){
		this[mode || this.options.mode]();
		this.open = false;
		return this.set([-this.offset, 0]);
	},

	show: function(mode){
		this[mode || this.options.mode]();
		this.open = true;
		return this.set([0, this.offset]);
	},

	toggle: function(mode){
		return this.start('toggle', mode);
	}

});

Element.Properties.slide = {

	set: function(options){
		this.get('slide').cancel().setOptions(options);
		return this;
	},

	get: function(){
		var slide = this.retrieve('slide');
		if (!slide){
			slide = new Fx.Slide(this, {link: 'cancel'});
			this.store('slide', slide);
		}
		return slide;
	}

};

Element.implement({

	slide: function(how, mode){
		how = how || 'toggle';
		var slide = this.get('slide'), toggle;
		switch (how){
			case 'hide': slide.hide(mode); break;
			case 'show': slide.show(mode); break;
			case 'toggle':
				var flag = this.retrieve('slide:flag', slide.open);
				slide[flag ? 'slideOut' : 'slideIn'](mode);
				this.store('slide:flag', !flag);
				toggle = true;
			break;
			default: slide.start(how, mode);
		}
		if (!toggle) this.eliminate('slide:flag');
		return this;
	}

});
