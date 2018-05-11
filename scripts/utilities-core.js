/**IE GLOBAL VARIABLES*/
var isIE6 = navigator.userAgent.toUpperCase().indexOf("MSIE 6.0") != -1;//IE6
var isIE7 = navigator.userAgent.toUpperCase().indexOf("MSIE 7.0") != -1;//IE7
var isIE8 = navigator.userAgent.toUpperCase().indexOf("MSIE 8.0") != -1;//IE8
var isIE9 = navigator.userAgent.toUpperCase().indexOf("MSIE 9.0") != -1;//IE9
var isIE = navigator.userAgent.toUpperCase().indexOf("MSIE") != -1;//All IE
var isFF = navigator.userAgent.toUpperCase().indexOf("GECKO") != -1;//All FF
var gtIE8 = isIE8 || isIE9; //High End IE

/*03-08-2011 21:00 CT */


// *********************************************
// CHKOverrides functionality
//		Allows the ability to include alternate functions in the options
// *********************************************
var CHKOverrides = new Class({
	overrides: null,
	setOverrides: function() {
		if (($defined(this.options)) && ($defined(this.options.overrides)))
		{
			// take the object and turn it into a hash
			this.overrides = $H(this.options.overrides);
			if (($defined(this.overrides)) && (this.overrides.getLength() > 0))
			{
				// cycle through the object and take each of the functions and 
				// replace the existing or add new functions in this instance of the object
				this.overrides.each(function(value, key) {
					if ($type(value) === 'function')
					{
						this[key] = value;
					}
				}.bind(this));
			}
		}
	}
});

// *********************************************
// CHKClassName functionality
//		Adds the function getClassName that returns the 
//		name of the class of the current object.
// *********************************************
var CHKClassName = new Class({
	getClassName: function() { 
        var w = $H(window); 
        return w.keyOf(this.constructor); 
    }
});
// *********************************************
// CHKControl_Base - Base class for controls.  
//		Ensures that the basic object signature exists and implements common code.
//
//		Options: name, showClass, hideClass, useFx, fxOpenStyle, fxCloseStyle, fxWait, fxDuration, fxTransition
//		Properties: uid, isOpen
//		Methods: render, setPosition, show, hide, showDelay, hideDelay 
//		Events: onShow, onHide, onTransitionStart, onTransitionComplete
// *********************************************
var CHKControl_Base = new Class({
	Implements: [Events, Options, CHKOverrides, CHKClassName],
	options: {
		name: null,
		showClass: null,
		hideClass: null,
		selectedClass: null,
		deselectedClass: null,
		enabledClass: null,
		disabledClass: null,
		stopPropagation: true,
		preventDefault: false,
		useFx: false,
		fxOpenStylePre: null,
		fxOpenStyle: null,
		fxOpenStylePost: null,
		fxCloseStylePre: null,
		fxCloseStyle: null,
		fxCloseStylePost: null,
		fxSelectedStylePre: null,
		fxSelectedStyle: null,
		fxSelectedStylePost: null,
		fxDeselectedStylePre: null,
		fxDeselectedStyle: null,
		fxDeselectedStylePost: null,
		fxEnabledStylePre: null,
		fxEnabledStyle: null,
		fxEnabledStylePost: null,
		fxDisabledStylePre: null,
		fxDisabledStyle: null,
		fxDisabledStylePost: null,
		
		fxWait: false,
		fxDuration: 500,
		fxTransition: Fx.Transitions.Sine.easeInOut
	},
	controlEl: null,
	timer: null,
	uid: null,
	isOpen: true,
	isSelected: false,
	isEnabled: true,
	inTransition: false,
	fx: null,
	initialize: function(control, options) {
		this.controlEl = $(control);
		this.setOptions(options);
		this.setOverrides();
		var tempHash, keys, styles, count;

		tempHash = $H({});
		if ($defined(this.controlEl))
		{
			// bubble up the uid from the control element
			this.uid = this.controlEl.uid;
			
			// bubble up the instance name from the element class if it hasn't been assigned already
			if ((!$defined(this.options.name)) && (this.controlEl.className.contains('js_name_')))
			{
				this.controlEl.className.split(' ').each(function(item, index) {
					if (item.contains('js_name_'))
					{
						this.options.name = item.replace('js_name_', '');
					}
				}.bind(this));
			}
			
			// isOpen detection
			if (($defined(this.options.useFx)) && (this.options.useFx))
			{
				if ($defined(this.options.fxOpenStyle))
				{
					if ($type(this.options.fxOpenStyle) === 'object')
					{

						tempHash = $H(this.options.fxOpenStyle);
						keys = tempHash.getKeys();
						styles = $H(this.controlEl.getStyles(keys));
						count = 0;
						
						keys.each(function(item, index) {
							if ((styles.has(item)) && (styles.get(item) === tempHash.get(item)))
							{
								count++;
							}
						}.bind(this));
						
						if (count === keys.length)
						{
							this.isOpen = true;
						}
					}
				}
				
				if ($defined(this.options.fxCloseStyle))
				{
					if ($type(this.options.fxCloseStyle) === 'object')
					{
						tempHash = $H(this.options.fxCloseStyle);
						keys = tempHash.getKeys();
						styles = $H(this.controlEl.getStyles(keys));
						count = 0;
						
						keys.each(function(item, index) {
							if ((styles.has(item)) && (styles.get(item) === tempHash.get(item)))
							{
								count++;
							}
						}.bind(this));
						
						if (count === keys.length)
						{
							this.isOpen = false;
						}
					}
				}
			}
			else
			{
				if ($defined(this.options.showClass))
				{
					switch ($type(this.options.showClass))
					{
						case 'string':
							if ((this.options.showClass !== "") && (this.controlEl.hasClass(this.options.showClass)))
							{
								this.isOpen = true;
							}
							break;
						case 'object':
							tempHash = $H(this.options.showClass);
							keys = tempHash.getKeys();
							styles = $H(this.controlEl.getStyles(keys));
							count = 0;
							
							keys.each(function(item, index) {
								if ((styles.has(item)) && (styles.get(item) === tempHash.get(item)))
								{
									count++;
								}
							}.bind(this));
							
							if (count === keys.length)
							{
								this.isOpen = true;
							}
							break;
					}
				}
				
				if ($defined(this.options.hideClass))
				{
					switch ($type(this.options.hideClass))
					{
						case 'string':
							if ((this.options.hideClass !== "") && (this.controlEl.hasClass(this.options.hideClass)))
							{
								this.isOpen = false;
							}
							break;
						case 'object':
							tempHash = $H(this.options.hideClass);
							keys = tempHash.getKeys();
							styles = $H(this.controlEl.getStyles(keys));
							count = 0;
							
							keys.each(function(item, index) {
								if ((styles.has(item)) && (styles.get(item) === tempHash.get(item)))
								{
									count++;
								}
							}.bind(this));
							
							if (count === keys.length)
							{
								this.isOpen = false;
							}
							break;
					}
				}
			}
			
			// instantiate the fx engine, if fx will be used for opening and closing.
			if (this.options.useFx)
			{
				this.fx = new Fx.Morph(this.controlEl, {wait: this.options.fxWait, duration: this.options.fxDuration, transition: this.options.fxTransition});
				this.fx.addEvent('onComplete', this.transitionCompleteHandler.bind(this));
				this.fx.addEvent('onStart', this.transitionStartHandler.bind(this));
			}
			
		}
	},
	render: function(resize) {
		if (!$defined(resize))
		{
			resize = false;
		}
		
		this.fireEvent('onBeginRender', this);
		
		if ($defined(this.customRender))
		{
			this.customRender(resize);
		}
			
		this.fireEvent('onEndRender', this);
	},
	customRender: $empty,
	toggleShow: function(stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		// process the control
		if ($defined(this.controlEl))
		{
			if (this.isOpen)
			{
				this.hide(stopEventFiring);
			}
			else
			{
				this.show(stopEventFiring);
			}
		}
	
	},
	show: function(stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		// process the control
		if ($defined(this.controlEl))
		{
			// set the is open flag
			this.isOpen = true;
			
			if (this.options.useFx)
			{
				// if a prefx style is available, set it
				if ($defined(this.options.fxOpenStylePre) && (!this.inTransition))
				{
					this.controlEl.setStyles(this.options.fxOpenStylePre);
				}
				
				// Show with transitions effects
				this.inTransition = true;
				this.fx.start(this.options.fxOpenStyle);
			}
			else
			{
				if (!$defined(this.options.showClass))
				{
					// Show using the visibility and display styles
					this.controlEl.setStyles({ visibility: 'visible', display: 'block' });
				}
				else
				{
					if ($type(this.options.showClass) === 'object')
					{
						// Show using styles
						this.controlEl.setStyles(this.options.showClass);
					}
					else
					{
						// Show using class names
						if (this.options.showClass !== "")
						{
							this.controlEl.addClass(this.options.showClass);
						}
							
						if ($defined(this.options.hideClass) && ($type(this.options.hideClass) === 'string') && this.controlEl.hasClass(this.options.hideClass))
						{
							this.controlEl.removeClass(this.options.hideClass);
						}
					}
				}
			}
		}
		
		// fire the onshow event
		if (!stopEventFiring)
		{
			this.fireEvent('onshow', this);
			this.fireEvent('onShowStateChange', this);
		}
	},
	hide: function(stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		// process the control
		if ($defined(this.controlEl))
		{
			// set the is open flag
			this.isOpen = false;
			
			if (this.options.useFx)
			{
				// if a prefx style is available, set it
				if ($defined(this.options.fxCloseStylePre))
				{
					this.controlEl.setStyles(this.options.fxCloseStylePre);
				}
					
				// Hide with transitions effects
				this.fx.start(this.options.fxCloseStyle);
			}
			else
			{
				if (!$defined(this.options.hideClass))
				{
					// Hide using the visibility and display styles
					this.controlEl.setStyles({ visibility: 'hidden', display: 'none' });
				}
				else
				{
					if ($type(this.options.hideClass) === 'object')
					{
						// Hide using styles
						this.controlEl.setStyles(this.options.hideClass);
					}
					else
					{
						// Hide using class names
						if (this.options.hideClass !== "")
						{
							this.controlEl.addClass(this.options.hideClass);
						}
							
						if ($defined(this.options.showClass) && ($type(this.options.showClass) === 'string') && this.controlEl.hasClass(this.options.showClass))
						{
							this.controlEl.removeClass(this.options.showClass);
						}
					}
				}
			}
		}
		
		// fire the onhide event
		if (!stopEventFiring)
		{
			this.fireEvent('onhide', this);
			this.fireEvent('onShowStateChange', this);
		}
	},
	showDelay: function(timeDelay, stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		if ($chk(timeDelay))
		{
//			this.timer = this.show(stopEventFiring).bind(this).delay(timeDelay);
			this.timer = this.show.bind(this).delay(timeDelay);
		}
	},
	hideDelay: function(timeDelay, stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		if ($chk(timeDelay))
		{
//			this.timer = this.hide(stopEventFiring).bind(this).delay(timeDelay);
			this.timer = this.hide.bind(this).delay(timeDelay);
		}
	},
	clearTimer: function() {
		$clear(this.timer);
	},
	toggleSelected: function(stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		// process the control
		if ($defined(this.controlEl))
		{
			if (this.isSelected)
			{
				this.deselect(stopEventFiring);
			}
			else
			{
				this.select(stopEventFiring);
			}
		}
	
	},
	select: function(stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		// process the control
		if ($defined(this.controlEl))
		{
			// set the is open flag
			this.isSelected = true;
			
			if (this.options.useFx)
			{
				// if a prefx style is available, set it
				if ($defined(this.options.fxSelectedStylePre) && (!this.inTransition))
				{
					this.controlEl.setStyles(this.options.fxSelectedStylePre);
				}
				
				// Show with transitions effects
				this.inTransition = true;
				this.fx.start(this.options.fxSelectedStyle);
			}
			else
			{
				if (!$defined(this.options.selectedClass))
				{
					// Show using the visibility and display styles
					this.controlEl.setStyles({ visibility: 'visible', display: 'block' });
				}
				else
				{
					if ($type(this.options.selectedClass) === 'object')
					{
						// Show using styles
						this.controlEl.setStyles(this.options.selectedClass);
					}
					else
					{
						// Show using class names
						if (this.options.selectedClass !== "")
						{
							this.controlEl.addClass(this.options.selectedClass);
						}
							
						if ($defined(this.options.deselectedClass) && ($type(this.options.deselectedClass) === 'string') && this.controlEl.hasClass(this.options.deselectedClass))
						{
							this.controlEl.removeClass(this.options.deselectedClass);
						}
					}
				}
			}
		}
		
		// fire the events
		if (!stopEventFiring)
		{
			this.fireEvent('onSelected', this);
			this.fireEvent('onSelectedStateChange', this);
		}
		
	},
	deselect: function(stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		// process the control
		if ($defined(this.controlEl))
		{
			// set the is open flag
			this.isSelected = false;
			
			if (this.options.useFx)
			{
				// if a prefx style is available, set it
				if ($defined(this.options.fxDeselectedStylePre))
				{
					this.controlEl.setStyles(this.options.fxDeselectedStylePre);
				}
					
				// Hide with transitions effects
				this.fx.start(this.options.fxDeselectedStyle);
			}
			else
			{
				if (!$defined(this.options.deselectedClass))
				{
					// Hide using the visibility and display styles
					this.controlEl.setStyles({ visibility: 'hidden', display: 'none' });
				}
				else
				{
					if ($type(this.options.deselectedClass) === 'object')
					{
						// Hide using styles
						this.controlEl.setStyles(this.options.deselectedClass);
					}
					else
					{
						// Hide using class names
						if (this.options.deselectedClass !== "")
						{
							this.controlEl.addClass(this.options.deselectedClass);
						}
							
						if ($defined(this.options.selectedClass) && ($type(this.options.selectedClass) === 'string') && this.controlEl.hasClass(this.options.selectedClass))
						{
							this.controlEl.removeClass(this.options.selectedClass);
						}
					}
				}
			}
		}
		
		// fire the events
		if (!stopEventFiring)
		{
			this.fireEvent('onDeselected', this);
			this.fireEvent('onSelectedStateChange', this);
		}
	},
	toggleEnabled: function(stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		// process the control
		if ($defined(this.controlEl))
		{
			if (this.isEnabled)
			{
				this.disable(stopEventFiring);
			}
			else
			{
				this.enable(stopEventFiring);
			}
		}
	
	},
	enable: function(stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		// process the control
		if ($defined(this.controlEl))
		{
			// set the is open flag
			this.isEnabled = true;
			
			if (this.options.useFx)
			{
				// if a prefx style is available, set it
				if ($defined(this.options.fxEnabledStylePre) && (!this.inTransition))
				{
					this.controlEl.setStyles(this.options.fxEnabledStylePre);
				}
				
				// Show with transitions effects
				this.inTransition = true;
				this.fx.start(this.options.fxEnabledStyle);
			}
			else
			{
				if (!$defined(this.options.enabledClass))
				{
					// Show using the visibility and display styles
					this.controlEl.setStyles({ visibility: 'visible', display: 'block' });
				}
				else
				{
					if ($type(this.options.enabledClass) === 'object')
					{
						// Show using styles
						this.controlEl.setStyles(this.options.enabledClass);
					}
					else
					{
						// Show using class names
						if (this.options.enabledClass !== "")
						{
							this.controlEl.addClass(this.options.enabledClass);
						}
							
						if ($defined(this.options.disabledClass) && ($type(this.options.disabledClass) === 'string') && this.controlEl.hasClass(this.options.disabledClass))
						{
							this.controlEl.removeClass(this.options.disabledClass);
						}
					}
				}
			}
		}
		
		// fire the events
		if (!stopEventFiring)
		{
			this.fireEvent('onEnabled', this);
			this.fireEvent('onEnabledStateChange', this);
		}
	},
	disable: function(stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		// process the control
		if ($defined(this.controlEl))
		{
			// set the is open flag
			this.isEnabled = false;
			
			if (this.options.useFx)
			{
				// if a prefx style is available, set it
				if ($defined(this.options.fxDisabledStylePre))
				{
					this.controlEl.setStyles(this.options.fxDisabledStylePre);
				}
					
				// Hide with transitions effects
				this.fx.start(this.options.fxDisabledStyle);
			}
			else
			{
				if (!$defined(this.options.disabledClass))
				{
					// Hide using the visibility and display styles
					this.controlEl.setStyles({ visibility: 'hidden', display: 'none' });
				}
				else
				{
					if ($type(this.options.disabledClass) === 'object')
					{
						// Hide using styles
						this.controlEl.setStyles(this.options.disabledClass);
					}
					else
					{
						// Hide using class names
						if (this.options.disabledClass !== "")
						{
							this.controlEl.addClass(this.options.disabledClass);
						}
							
						if ($defined(this.options.enabledClass) && ($type(this.options.enabledClass) === 'string') && this.controlEl.hasClass(this.options.enabledClass))
						{
							this.controlEl.removeClass(this.options.enabledClass);
						}
					}
				}
			}
		}
		
		// fire the onhide event
		if (!stopEventFiring)
		{
			this.fireEvent('onDisabled', this);
			this.fireEvent('onEnabledStateChange', this);
		}
	},
	transitionStartHandler: function() {
		this.fireEvent('onTransitionStart', this);
	},
	transitionCompleteHandler: function() {
		// if a postfx style is available, set it
		if (this.isOpen)
		{
			if ($defined(this.options.fxOpenStylePost))
			{
				this.controlEl.setStyles(this.options.fxOpenStylePost);
			}
		}
		else
		{
			if ($defined(this.options.fxCloseStylePost))
			{
				this.controlEl.setStyles(this.options.fxCloseStylePost);
			}
		}
		
		if (this.isSelected)
		{
			if ($defined(this.options.fxSelectedStylePost))
			{
				this.controlEl.setStyles(this.options.fxSelectedStylePost);
			}
		}
		else
		{
			if ($defined(this.options.fxDeselectedStylePost))
			{
				this.controlEl.setStyles(this.options.fxDeselectedStylePost);
			}
		}
		
		if (this.isEnabled)
		{
			if ($defined(this.options.fxEnabledStylePost))
			{
				this.controlEl.setStyles(this.options.fxEnabledStylePost);
			}
		}
		else
		{
			if ($defined(this.options.fxDisabledStylePost))
			{
				this.controlEl.setStyles(this.options.fxDisabledStylePost);
			}
		}
		
		this.inTransition = false;
		
		this.fireEvent('onTransitionComplete', this);
	},
	getByUid: function(uid) {
		if (($defined(uid)))
		{
			// if I am the requested uid, return myself
			if ($defined(this.uid) && uid === this.uid)
			{
				return this;
			}
		}
		
		// no uid found, return null
		return null;
	},
	getByName: function(name) {
		if (($defined(name)))
		{
			// if I am the requested name, return myself
			if ($defined(this.options.name) && name === this.options.name)
			{
				return this;
			}
		}
		
		// no name found, return null
		return null;
	}

});

// *********************************************
// CHKCustomPopUp - 
// *********************************************
var CHKCustomPopUp = new Class ({
	// Events
	//	onShow
	//	onHide
	//	onTransitionStart
	//	onTransitionComplete
	Implements: [Events, Options, CHKOverrides, CHKClassName],
	options: {
		name: null,
		showEvent: 'mouseenter',
		hideEvent: 'mouseleave',
		enableTriggerToggle: false,
		enableTargetToggle: false,
		showTriggerClass: null,
		hideTriggerClass: null,
		showTargetClass: null,
		hideTargetClass: null,
		showDelay: null,
		hideDelay: null,
		alignment: null, // optional values are horiz_left, horiz_center, horiz_right, vert_top, vert_center, vert_bottom
		stopPropagation: true,
		preventDefault: false,
		enableKeypress: true,
		useFx: false,
		fxOpenStylePre: null,
		fxOpenStyle: null,
		fxOpenStylePost: null,
		fxCloseStylePre: null,
		fxCloseStyle: null,
		fxCloseStylePost: null,
		fxWait: false,
		fxDuration: 500,
		fxTransition: Fx.Transitions.Back.easeOut
	},
	triggerEl: null,
	targetEl: null,
	showEls: [],
	hideEls: [],
	triggerSize: null,
	popupSize: null,
	alignmentSet: false,
	isOpen: false,
	inTransition: false,
	timer: null,
	fx: null,
	uid: null,
	initialize: function(trigger, target, options) {
		var tempHash, keys, styles, count;
		
		this.triggerEl = $(trigger);
		this.targetEl = $(target);
		this.setOptions(options);
		this.setOverrides();
		tempHash = $H({});


		// get the sizes and store them for later.  NOTE: this does not work correctly when the element is hidden, needs work
		if($defined(this.triggerEl))
		{
			// bubble up the uid from the trigger element
			this.uid = this.triggerEl.uid;
			
			// if the name is not set, check for the name in the class
			if ((!$defined(this.options.name)) && (this.triggerEl.className.contains('js_name_')))
			{
				this.triggerEl.className.split(' ').each(function(item, index) {
					if (item.contains('js_name_')){
						this.options.name = item.replace('js_name_', '');
					}
				}.bind(this));
			}
			
			this.triggerSize = this.triggerEl.getSize();
			
			// if the size x and y comes back as 0, try to extract the size from the style
			if (this.triggerSize.x === 0 && this.triggerSize.y === 0)
			{
				this.triggerSize.x = this.triggerEl.getStyle('width').toInt();
				this.triggerSize.y = this.triggerEl.getStyle('height').toInt();
			}
			
			// isOpen detection
			if ($defined(this.options.showTriggerClass))
			{
				switch ($type(this.options.showTriggerClass))
				{
					case 'string':
						if ((this.options.showTriggerClass !== "") && (this.triggerEl.hasClass(this.options.showTriggerClass)))
						{
							this.isOpen = true;
						}
						break;
					case 'object':
						tempHash = $H(this.options.showTriggerClass);
						keys = tempHash.getKeys();
						styles = $H(this.triggerEl.getStyles(keys));
						count = 0;
						
						keys.each(function(item, index) {
							if ((styles.has(item)) && (styles.get(item) === tempHash.get(item)))
							{
								count++;
							}
						}.bind(this));
						
						if (count === keys.length)
						{
							this.isOpen = true;
						}
						break;
				}
			}
			
			if ($defined(this.options.hideTriggerClass))
			{
				switch ($type(this.options.hideTriggerClass))
				{
					case 'string':
						if ((this.options.hideTriggerClass !== "") && (this.triggerEl.hasClass(this.options.hideTriggerClass)))
						{
							this.isOpen = false;
						}
						break;
					case 'object':
						tempHash = $H(this.options.hideTriggerClass);
						keys = tempHash.getKeys();
						styles = $H(this.triggerEl.getStyles(keys));
						count = 0;
						
						keys.each(function(item, index) {
							if ((styles.has(item)) && (styles.get(item) === tempHash.get(item)))
							{
								count++;
							}
						}.bind(this));
						
						if (count === keys.length)
						{
							this.isOpen = false;
						}
						break;
				}
			}
			
		}
		
		// initialize the target element
		if($defined(this.targetEl))
		{
			// if there is no trigger, bubble up the uid from the target
			if (!$defined(this.uid))
			{
				this.uid = this.targetEl.uid;
			}
			
			// if the name is not set, check for the name in the class
			if ((!$defined(this.options.name)) && (this.targetEl.className.contains('js_name_')))
			{
				this.targetEl.className.split(' ').each(function(item, index) {
					if (item.contains('js_name_'))
					{
						this.options.name = item.replace('js_name_', '');
					}
				}.bind(this));
			}
				
			this.popupSize = this.targetEl.getSize();
			
			// if the size x and y comes back as 0, try to extract the size from the style
			if (this.popupSize.x === 0 && this.popupSize.y === 0)
			{
				this.popupSize.x = this.targetEl.getStyle('width').toInt();
				this.popupSize.y = this.targetEl.getStyle('height').toInt();
			}
			
			// isOpen detection
			if (($defined(this.options.useFx)) && (this.options.useFx))
			{
				if ($defined(this.options.fxOpenStyle))
				{
					if($type(this.options.fxOpenStyle) === 'object')
					{
						tempHash = $H(this.options.fxOpenStyle);
						keys = tempHash.getKeys();
						styles = $H(this.targetEl.getStyles(keys));
						count = 0;
						
						keys.each(function(item, index) {
							if ((styles.has(item)) && (styles.get(item) === tempHash.get(item)))
							{
								count++;
							}
						}.bind(this));
						
						if (count === keys.length)
						{
							this.isOpen = true;
						}
					}
				}
				
				if ($defined(this.options.fxCloseStyle))
				{
					if($type(this.options.fxCloseStyle) === 'object')
					{
						tempHash = $H(this.options.fxCloseStyle);
						keys = tempHash.getKeys();
						styles = $H(this.targetEl.getStyles(keys));
						count = 0;
						
						keys.each(function(item, index) {
							if ((styles.has(item)) && (styles.get(item) === tempHash.get(item)))
							{
								count++;
							}
						}.bind(this));
						
						if (count === keys.length)
						{
							this.isOpen = false;
						}
					}
				}
			}
			else
			{
				if ($defined(this.options.showTargetClass))
				{
					switch ($type(this.options.showTargetClass))
					{
						case 'string':
							if ((this.options.showTargetClass !== "") && (this.targetEl.hasClass(this.options.showTargetClass)))
							{
								this.isOpen = true;
							}
							break;
						case 'object':
							tempHash = $H(this.options.showTargetClass);
							keys = tempHash.getKeys();
							styles = $H(this.targetEl.getStyles(keys));
							count = 0;
							
							keys.each(function(item, index) {
								if ((styles.has(item)) && (styles.get(item) === tempHash.get(item)))
								{
									count++;
								}
							}.bind(this));
							
							if (count === keys.length)
							{
								this.isOpen = true;
							}
							break;
					}
				}
				
				if ($defined(this.options.hideTargetClass))
				{
					switch ($type(this.options.hideTargetClass))
					{
						case 'string':
							if ((this.options.hideTargetClass !== "") && (this.targetEl.hasClass(this.options.hideTargetClass)))
							{
								this.isOpen = false;
							}
							break;
						case 'object':
							tempHash = $H(this.options.hideTargetClass);
							keys = tempHash.getKeys();
							styles = $H(this.targetEl.getStyles(keys));
							count = 0;
							
							keys.each(function(item, index) {
								if ((styles.has(item)) && (styles.get(item) === tempHash.get(item)))
								{
									count++;
								}
							}.bind(this));
							
							if (count === keys.length)
							{
								this.isOpen = false;
							}
							break;
					}
				}
			}
						
		}
		
		this.fx = new Fx.Morph(this.targetEl, {wait: this.options.fxWait, duration: this.options.fxDuration, transition: this.options.fxTransition});
		this.fx.addEvent('onComplete', this.transitionCompleteHandler.bind(this));
		this.fx.addEvent('onStart', this.transitionStartHandler.bind(this));
		
		
		// If the trigger is defined, wire up the event handlers.
		if ($defined(this.triggerEl))
		{
			// wire up the show events if they are defined
			if($defined(this.options.showEvent))
			{
				$splat(this.options.showEvent).each(function(event) {
					this.triggerEl.addEvent(event, this.showHandlerTrigger.bind(this));
				}.bind(this));
			}
			
			// wire up the hide events if they are defined
			if($defined(this.options.hideEvent))
			{
				$splat(this.options.hideEvent).each(function(event) {
					this.triggerEl.addEvent(event, this.hideHandlerTrigger.bind(this));
				}.bind(this));
			}
			
			if (this.options.enableKeypress)
			{
				this.triggerEl.addEvent('keypress', this.keypressHandlerTrigger.bind(this));
			}
		}
		
		// If the target is defined, wire up the event handlers.
		// do not wire up the events if the target and the trigger are the same, they will fight with each other.
		if ($defined(this.targetEl) && (this.targetEl !== this.triggerEl))
		{
			// wire up the show events if they are defined
			if($defined(this.options.showEvent))
			{
				$splat(this.options.showEvent).each(function(event) {
					this.targetEl.addEvent(event, this.showHandler.bind(this));
				}.bind(this));
			}
			
			// wire up the hide events if they are defined
			if($defined(this.options.hideEvent))
			{
				$splat(this.options.hideEvent).each(function(event) {
					this.targetEl.addEvent(event, this.hideHandler.bind(this));
				}.bind(this));
			}
			
			if (this.options.enableKeypress)
			{
				this.targetEl.addEvent('keypress', this.keypressHandler.bind(this));
			}
		}
	
		this.render(false); 
	},
	render: function(resize) {
		if (!$defined(resize))
		{
			resize = false;
		}
		
		this.fireEvent('onBeginRender', this);
		
		if ($defined(this.customRender))
		{
			this.customRender(resize);
		}
		
		this.fireEvent('onEndRender', this);
	},
	customRender: $empty,
	addShowElement: function(obj, showEvent) {
		if ($defined(obj))
		{
			// if not defined, default to click
			if (!$defined(showEvent))
			{
				showEvent = 'click';
			}
			
			// wire up the show event handlers, there can be multiple show events
			$splat(showEvent).each(function(event) {
				obj.addEvent(event, this.showHandlerTrigger.bind(this));
			}.bind(this));
			
			// add the obj to the showEls array
			this.showEls.push(obj);
		}
	},
	addHideElement: function(obj, hideEvent) {
		if ($defined(obj))
		{
			// if not defined, default to click
			if (!$defined(hideEvent))
			{
				hideEvent = 'click';
			}
			
			// wire up the hide event handlers, there can be multiple hide events
			$splat(hideEvent).each(function(event) {
				obj.addEvent(event, this.hideHandlerTrigger.bind(this));
			}.bind(this));

			// add the obj to the showEls array
			this.hideEls.push(obj);
		}
	},
	clearTimer: function() {
		$clear(this.timer);
	},
	show: function(stopEventFiring) {
		var triggerCoord, targetCoord, alignmentStyle, widthSign, widthSize, heightSign, heightSize;
			
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}


		// process the trigger
		if ($defined(this.triggerEl) && $defined(this.options.showTriggerClass)) 
		{
			if ($type(this.options.showTriggerClass) === 'object')
			{
				// Show using styles
				this.triggerEl.setStyles(this.options.showTriggerClass);
			}
			else
			{
				// Show using class names
				if(this.options.showTriggerClass !== "")
				{
					this.triggerEl.addClass(this.options.showTriggerClass);
				}
					
				if ($defined(this.options.hideTriggerClass) && ($type(this.options.hideTriggerClass) === 'string') && this.triggerEl.hasClass(this.options.hideTriggerClass))
				{
					this.triggerEl.removeClass(this.options.hideTriggerClass);
				}
			}
		}
		
		// set the is open flag
		this.isOpen = true;
		
		// process the target
		if ($defined(this.targetEl))
		{
			if (this.options.useFx)
			{
				// if a prefx style is available, set it
				if ($defined(this.options.fxOpenStylePre) && (!this.inTransition))
				{
					this.targetEl.setStyles(this.options.fxOpenStylePre);
				}
					
				// Show with transitions effects
				this.inTransition = true;
				this.fx.start(this.options.fxOpenStyle);
			}
			else
			{
				if (!$defined(this.options.showTargetClass))
				{
					// Show using the visibility and display styles
					this.targetEl.setStyles({ visibility: 'visible', display: 'block' });
				}
				else
				{
					if ($type(this.options.showTargetClass) === 'object')
					{
						//Show using styles
						this.targetEl.setStyles(this.options.showTargetClass);
					}
					else
					{
						// Show using class names
						if (this.options.showTargetClass !== "")
						{
							this.targetEl.addClass(this.options.showTargetClass);
						}
							
						if ($defined(this.options.hideTargetClass) && ($type(this.options.hideTargetClass) === 'string') && this.targetEl.hasClass(this.options.hideTargetClass))
						{
							this.targetEl.removeClass(this.options.hideTargetClass);
						}
					}
				}
			}
		}
		
		if (($defined(this.options.alignment)) && (this.alignmentSet === false))
		{
			if (($defined(this.triggerEl)) && ($defined(this.targetEl)))
			{
				triggerCoord = this.triggerEl.getCoordinates();
				targetCoord = this.targetEl.getCoordinates();
				widthSign = '';
				heightSign = '';

				
				// calculate the width size and sign
				if (targetCoord.width > triggerCoord.width)
				{
					widthSign = '-';
					widthSize = (targetCoord.width - triggerCoord.width);
				}
				else
				{
					widthSize = (triggerCoord.width - targetCoord.width);
				}
				
				// calculate the height size and sign
				if (targetCoord.height > triggerCoord.height)
				{
					heightSign = '-';
					heightSize = (targetCoord.height - triggerCoord.height);
				}
				else
				{
					heightSize = (triggerCoord.height - targetCoord.height);
				}
				
				 // optional values are horiz_left, horiz_center, horiz_right, vert_top, vert_center, vert_bottom
				switch(this.options.alignment)
				{
					case 'horiz_center':
						alignmentStyle = { left: widthSign + (widthSize/ 2 ) + 'px' };
						break;
					case 'horiz_right':
						alignmentStyle = { left: widthSign + widthSize + 'px' };
						break;
					case 'vert_top':
						alignmentStyle = { top: '0px' };
						break;
					case 'vert_center':
						alignmentStyle = { top: heightSign + (heightSize / 2) + 'px' };
						break;
					case 'vert_bottom':
						alignmentStyle = { top: heightSign + heightSize + 'px' };
						break;
					case 'horiz_left':
						alignmentStyle = { left: '0px' };
						break;
					case 'center_center':
						alignmentStyle = { left: widthSign + (widthSize/ 2 ) + 'px',  top: heightSign + (heightSize / 2) + 'px' };
						break;
					case 'center_left':
						alignmentStyle = { top: heightSign + (heightSize / 2) + 'px', left: '0px' };
						break;
					case 'center_right':
						alignmentStyle = { top: heightSign + (heightSize / 2) + 'px', left: widthSign + widthSize + 'px' };
						break;						
					case 'top_center':
						alignmentStyle = { top: '0px', left: widthSign + (widthSize/ 2 ) + 'px' };
						break;
					case 'top_left':
						alignmentStyle = { top: '0px', left: '0px' };
						break;
					case 'top_right':
						alignmentStyle = { top: '0px', left: widthSign + widthSize + 'px' };
						break;
					case 'bottom_center':
						alignmentStyle = { top: heightSign + heightSize + 'px', left: widthSign + (widthSize/ 2 ) + 'px' };
						break;
					case 'bottom_left':
						alignmentStyle = { top: heightSign + heightSize + 'px', left: '0px' };
						break;
					case 'bottom_right':
						alignmentStyle = { top: heightSign + heightSize + 'px', left: widthSign + widthSize + 'px' };
						break;
					default:
						alignmentStyle = { left: '0px' };
						break;
				}
				
				if ($defined(alignmentStyle))
				{
					this.alignmentSet = true;
					this.targetEl.setStyles(alignmentStyle);
				}
			}
		}
		
		// fire the onshow event
		if (!stopEventFiring)
		{
			this.fireEvent('onshow', this);
			this.fireEvent('onShowStateChange', this);
			this.fireEvent('onSelected', this);
		}
		
	},
	hide: function(stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		// process the trigger
		if ($defined(this.triggerEl) && $defined(this.options.hideTriggerClass)) 
		{
			if ($type(this.options.hideTriggerClass) === 'object')
			{
				// Hide using styles
				this.triggerEl.setStyles(this.options.hideTriggerClass);
			}
			else
			{
				// Hide using class names
				if (this.options.hideTriggerClass !== "")
				{
					this.triggerEl.addClass(this.options.hideTriggerClass);
				}
					
				if ($defined(this.options.showTriggerClass) && ($type(this.options.showTriggerClass) === 'string') && this.triggerEl.hasClass(this.options.showTriggerClass))
				{
					this.triggerEl.removeClass(this.options.showTriggerClass);
				}
			}
		}
		
		// set the is open flag
		this.isOpen = false;
		
		// process the target
		if ($defined(this.targetEl))
		{
			if (this.options.useFx)
			{
				// if a prefx style is available, set it
				if ($defined(this.options.fxCloseStylePre) && (!this.inTransition))
				{
					this.targetEl.setStyles(this.options.fxCloseStylePre);
				}
					
				// Hide with transitions effects
				this.inTransition = true;
				this.fx.start(this.options.fxCloseStyle);
			}
			else
			{
				if (!$defined(this.options.hideTargetClass))
				{
					// Hide using the visibility and display styles
					this.targetEl.setStyles({ visibility: 'hidden', display: 'none' });
				}
				else
				{
					if ($type(this.options.hideTargetClass) === 'object')
					{
						// Hide using styles
						this.targetEl.setStyles(this.options.hideTargetClass);
					}
					else
					{
						// Hide using class names
						if (this.options.hideTargetClass !== "")
						{
							this.targetEl.addClass(this.options.hideTargetClass);
						}
							
						if ($defined(this.options.showTargetClass) && ($type(this.options.showTargetClass) === 'string') && this.targetEl.hasClass(this.options.showTargetClass))
						{
							this.targetEl.removeClass(this.options.showTargetClass);
						}
					}
				}
			}
		}
		
		// fire the onhide event
		if (!stopEventFiring)
		{
			this.fireEvent('onhide', this);
			this.fireEvent('onShowStateChange', this);
		}
	},
	showDelay: function(timeDelay, stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		if ($chk(timeDelay))
		{
//			this.timer = this.show(stopEventFiring).bind(this).delay(timeDelay);
			this.timer = this.show.bind(this).delay(timeDelay);
		}
	},
	hideDelay: function(timeDelay, stopEventFiring) {
		
		// If the parameter is not defined, default it to false
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = false;
		}

		if ($chk(timeDelay))
		{
//			this.timer = this.hide(stopEventFiring).bind(this).delay(timeDelay);
			this.timer = this.hide.bind(this).delay(timeDelay);
		}
	},
	showHandler: function(event) {
		// stop event propagation if the flag is set
		if (this.options.stopPropagation === true && $defined(event))
		{
			event.stopPropagation();
		}
		
		// prevent default behaviour if the flag is set
		if (this.options.preventDefault === true && $defined(event))
		{
			event.preventDefault();
		}
		
		// clear the timer delay to prevent it from firing
		$clear(this.timer);
		
		// only process if the popup is not open
		if (this.isOpen === false)
		{
			if ($defined(this.options.showDelay))
			{
				this.showDelay(this.options.showDelay);
			}
			else
			{
				this.show();
			}
		}
		else if (this.options.enableTargetToggle)
		{
			if ($defined(this.options.hideDelay))
			{
				this.hideDelay(this.options.hideDelay);
			}
			else
			{
				this.hide();
			}
		}
	},
	hideHandler: function(event) {
		// stop event propagation if the flag is set
		if (this.options.stopPropagation === true && $defined(event))
		{
			event.stopPropagation();
		}
		
		// prevent default behaviour if the flag is set
		if (this.options.preventDefault === true && $defined(event))
		{
			event.preventDefault();
		}
		// clear the timer delay to prevent it from firing
		$clear(this.timer);
		
		// only process if the popup is open
		if (this.isOpen === true)
		{
			
			if ($defined(this.options.hideDelay))
			{
				this.hideDelay(this.options.hideDelay);
			}
			else
			{
				this.hide();
			}
		}
	},
	showHandlerTrigger: function(event) {
		// stop event propagation if the flag is set
		if (this.options.stopPropagation === true && $defined(event))
		{
			 event.stopPropagation();
		}
		
		// prevent default behaviour if the flag is set
		if (this.options.preventDefault === true && $defined(event))
		{
			event.preventDefault();
		}
		
		// clear the timer delay to prevent it from firing
		$clear(this.timer);
		
		// only process if the popup is not open
		if (this.isOpen === false)
		{
			// if a delay is defined, use it.
			if ($defined(this.options.showDelay))
			{
				this.showDelay(this.options.showDelay);
			}
			else
			{
				this.show();
			}
		}
		else if (this.options.enableTriggerToggle)
		{
			if ($defined(this.options.hideDelay))
			{
				this.hideDelay(this.options.hideDelay);
			}
			else
			{
				this.hide();
			}
		}
		
	},
	hideHandlerTrigger: function(event) {
		// stop event propagation if the flag is set
		if (this.options.stopPropagation === true && $defined(event))
		{
			event.stopPropagation();
		}
		
		// prevent default behaviour if the flag is set
		if (this.options.preventDefault === true && $defined(event))
		{
			event.preventDefault();
		}
		
		// clear the timer delay to prevent it from firing
		$clear(this.timer);
		
		// only process if the popup is open
		if (this.isOpen === true)
		{
			if ($defined(this.options.hideDelay))
			{
				this.hideDelay(this.options.hideDelay);
			}
			else
			{
				this.hide();
			}
		}
	},
	keypressHandlerTrigger: function(event) {
		this.keypressHandler(event);
		
		// if the enter key is pressed, set the focus to the target element
//		if (($defined(event.key)) && (event.key == 'enter') && ($defined(this.targetEl)))
//		{
//			this.targetEl.focus();
//		}
	},
	keypressHandler: function(event) {
		if ($defined(event) && $defined(event.key))
		{
			// stop event propagation if the flag is set
			if ((this.options.stopPropagation === true) && (event.key === 'enter' || event.key === 'esc'))
			{
				event.stopPropagation();
			}
			
			// prevent default behaviour if the flag is set
			if ((this.options.preventDefault === true) && (event.key === 'enter' || event.key === 'esc'))
			{
				event.preventDefault();
			}
			
			// clear the timer delay to prevent it from firing
			$clear(this.timer);
			
			switch(event.key)
			{
				case 'enter':
					// only process if the popup is not open
					if(this.isOpen === false)
					{
						this.show();
					}
					break;
				case 'esc':
					// only process if the popup is open
					if (this.isOpen === true)
					{
						this.hide();
					}
					break;
			}
		}
		
	},
	transitionStartHandler: function() {
		this.fireEvent('onTransitionStart', this);
	},
	transitionCompleteHandler: function() {
		// if a postfx style is available, set it
		if (this.isOpen)
		{
			if ($defined(this.options.fxOpenStylePost))
			{
				this.targetEl.setStyles(this.options.fxOpenStylePost);
			}
		}
		else
		{
			if ($defined(this.options.fxCloseStylePost))
			{
				this.targetEl.setStyles(this.options.fxCloseStylePost);
			}
		}
		this.inTransition = false;
		
		this.fireEvent('onTransitionComplete', this);
	}
});

// *********************************************
// CHKButton - 
// *********************************************
var CHKButton = new Class({
	Extends: CHKControl_Base,
	options: {
		selectEvent: 'click'
	},
	initialize: function(control, options) {
		this.parent(control, options);
		
		if ($defined(this.controlEl))
		{
			// wire up the selected events if they are defined
			if($defined(this.options.selectEvent))
			{
				$splat(this.options.selectEvent).each(function(event) {
					this.controlEl.addEvent(event, this.selectedHandler.bind(this));
				}.bind(this));
			}

			// wire up the keypress events
			this.controlEl.addEvent('keypress', this.keypressHandler.bind(this));
		}
		
		this.render(false);
	},
	selectFunc: $empty,
	keypressHandler: function(event) {
		// stop event propagation if the flag is set
		if (event.key === 'enter')
		{
			this.selectedHandler(event);
		}
	},
	selectedHandler: function(event) {
		// stop propogation of the event
		if (this.options.stopPropagation === true)
		{
			event.stopPropagation();
		}
		
		// prevent default behaviour if the flag is set
		if (this.options.preventDefault === true)
		{
			event.preventDefault();
		}
		
		// if a function is defined, call it
		if (($defined(this.selectFunc)) && ($type(this.selectFunc) === 'function'))
		{
			this.selectFunc();
		}
		
		// fire off the onSelected Event
		this.fireEvent('onSelected', this);
	}
});

// *********************************************
// CHKTabControl - 
// *********************************************
var CHKTabControl = new Class({
	Extends: CHKControl_Base,
	options: {
		tabClass: null,
		tabTarget: 'rel',
		tabTargetSelector: null,
		display: -1,
		keepHistory: false,
		loop: false,
		rotationDelay: 3000,
		rotationDirection: 'forward', // forward, backward
		tabSettings: {
			showEvent: 'click',
			hideEvent: null,
			showTriggerClass: null,
			hideTriggerClass: null,
			showTargetClass: null,
			hideTargetClass: null,
			showDelay: null,
			hideDelay: null
		}
	},
	tabs: [],
	history: [],
	totalTabs: 0,
	currentTab: null,
	stopHistory: false,
	stopEvent: false,
	rotationTimer: null,
	initialize: function(control, options) {
		var tabindex, target, els, popupOptions, temppopup;
		
		this.parent(control, options);
		
		tabindex = 0;
		
		if ($defined(this.controlEl))
		{
			
			if ($defined(this.options.tabClass))
			{
				this.controlEl.getElements(this.options.tabClass).each(function (item, index){
					// get the target
					target = null;
					switch (this.options.tabTarget)
					{
						case 'sibling':
							// if a Selector has been defined, use it, otherwise just get the next sibling element
							if ($defined(this.options.tabTargetSelector))
							{
								target = item.getNext(this.options.tabTargetSelector);
							}
							else
							{
								target = item.getNext();
							}
							break;
						case 'child':
							els = null;
							// if a Selector has been defined, use it, otherwise get the first child element
							if ($defined(this.options.tabTargetSelector))
							{
								els = item.getChildren(this.options.tabTargetSelector);
								if (els.length < 1)
								{
									els = item.getElements(this.options.tabTargetSelector);
								}
							}
							else
							{
								els = item.getChildren();
							}
							if (($defined(els)) && (els.length > 0))
							{
								target = els[0];
							}
							break;
						case 'rel':
							target = $(item.get('rel'));
							break;
						default:
							// get the target based on the value of the rel attribute
							target = $(item.get('rel'));
							break;
					}
					
					// added a name to the popup based on the tab index
					popupOptions = this.options.tabSettings;
					popupOptions.name = 'tab' + tabindex;
					
					// Create the popup
					temppopup = new CHKCustomPopUp(item, target, popupOptions);
					
					if (temppopup.isOpen === true)
					{
						this.currentTab = index;
					}
					
					// add it to the tab control and wire up the event handlers
					this.addTab(temppopup);
				}.bind(this));
			}
		}
		
		if (this.options.display >= 0)
		{
			this.showTab(this.options.display);
		}
			
		this.render(false);
	},
	isTabOpen: function() {
		var output = false;
		if ($defined(this.tabs) && this.tabs.length > 0)
		{
			this.tabs.each(function(item, index) { 
				if ($defined(item.isOpen) && item.isOpen)
				{
					output = true;
				}
			}.bind(this));
		}
		return output;
	},
	addTab: function(tab) {
		if ($defined(tab))
		{
			// wire up the event handlers
			tab.addEvent('onshow', this.tabShowHandler.bind(this));
			tab.addEvent('onhide', this.tabHideHandler.bind(this));
			tab.addEvent('onSelected', this.selectedHandler.bind(this));
			
			// add it to the collection
			this.tabs.push(tab);
			
			// increment the total variable
			this.totalTabs++;
		}
	},
	back: function() {
		if (($defined(this.history)) && (this.history.length > 0))
		{
			var lastIndex = this.history.getLast();
			this.history.splice((this.history.length -1), 1);
			
			this.stopHistory = true;
			this.showTab(lastIndex);
			this.stopHistory = false;
			
			return lastIndex;
		}
		return null;
	},
	next: function() {
		var showFlag, nextTab;

		showFlag = true;
		// get the next position
		if ($defined(this.currentTab))
		{
			nextTab = this.currentTab + 1;
		}
		else
		{
			nextTab = 0;
		}
		
		// check to see if you have reached the end.
		if (nextTab >= this.totalTabs)
		{
			if (this.options.loop)
			{
				nextTab = 0;
			}
			else
			{
				showFlag = false;
			}
		}
		
		if (showFlag)
		{
			this.showTab(nextTab, false);
			// return the tab number that was shown
			return nextTab;
		}
		
		// no tab was shown, so return null
		return null;
	},
	previous: function() {
		var showFlag, nextTab;

		showFlag = true;
		// get the next position
		if ($defined(this.currentTab))
		{
			nextTab = this.currentTab - 1;
		}
		else
		{
			nextTab = 0;
		}
		// check to see if you have reached the end.
		if (nextTab < 0)
		{
			if (this.options.loop)
			{
				nextTab = this.totalTabs - 1;
			}
			else
			{
				showFlag = false;
			}
		}
		
		if (showFlag)
		{
			this.showTab(nextTab, false);
			// return the tab number that was shown
			return nextTab;
		}
		
		// no tab was shown, so return null
		return null;
	},
	rotate: function() {
		var tabIndex;
		
		$clear(this.rotationTimer);
		
		switch(this.options.rotationDirection)
		{
			case 'backward':
				tabIndex = this.previous();
				break;
			case 'forward':
				tabIndex = this.next();
				break;
			default:
				tabIndex = this.next();
				break;
		}
		
		if ($defined(tabIndex))
		{
			if (($chk(this.options.rotationDelay)) && (this.options.rotationDelay > 0))
			{
				this.rotationTimer = this.rotate.bind(this).delay(this.options.rotationDelay);
			}
		}
	},
	rotateStart: function() {
		if (($chk(this.options.rotationDelay)) && (this.options.rotationDelay > 0))
		{
			this.rotationTimer = this.rotate.bind(this).delay(this.options.rotationDelay);
		}
	},
	rotateStop: function() {
		$clear(this.rotationTimer);
	},
	showTab: function(tabNumber, stopEventFiring) {
		// If the parameter is not defined, default it to true
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = true;
		}
		
		if (($chk(tabNumber)) && (tabNumber < this.tabs.length))
		{
			if (stopEventFiring)
			{
				this.stopEvent = true;
			}
			
			// Show the tab
			this.tabs[tabNumber].show();
			
			if (stopEventFiring)
			{
				this.stopEvent = false;
			}
		}
	},
	hideTab: function(tabNumber, stopEventFiring) {
		// If the parameter is not defined, default it to true
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = true;
		}
		
		if (tabNumber < this.tabs.length)
		{
			if (stopEventFiring)
			{
				this.stopEvent = true;
			}
			
			// Hide the tab
			this.tabs[tabNumber].hide();
			
			if (stopEventFiring)
			{
				this.stopEvent = false;
			}
		}
	},
	hideAllTabs: function(stopEventFiring) {
		// If the parameter is not defined, default it to true
		if (!$defined(stopEventFiring))
		{
			stopEventFiring = true;
		}
		
		if (($defined(this.tabs)) && (this.tabs.length > 0))
		{
			if (stopEventFiring)
			{
				this.stopEvent = true;
			}
			
			// Hide all tabs
			this.tabs.each(function(item, index) {
				item.hide();
			}.bind(this));
			
			if (stopEventFiring)
			{
				this.stopEvent = false;
			}
		}
	},
	tabShowHandler: function(popup) {
		var temppopup = popup;
		
		// cycle through the tabs and close any that are open, other then the one being opened.
		this.tabs.each(function(item, index) {
			if (item.uid !== temppopup.uid)
			{
				item.hide();
			}
			else
			{
				// check to see if we are keeping a history
				if ((this.options.keepHistory) && (!this.stopHistory) && ($chk(this.currentTab)))
				{
					this.history.push(this.currentTab);
				}
				
				// set the index to the currently open tab
				this.currentTab = index;
				
				// fire the show tab event
				if (!this.stopEvent)
				{
					this.fireEvent('onShowTab', index);
				}
			}
		}.bind(this));
		
	},
	tabHideHandler: function(popup) {
		var numOpen = 0;
		// cycle through the tabs and if all of the popups are closed, fire off the event
		this.tabs.each(function(item, index) {
			if (item.isOpen)
			{
				numOpen++;
			}
			if ((item.uid === popup.uid) && (!this.stopEvent))
			{
				this.fireEvent('onHideTab', index);
			}
		}.bind(this));
		
		// the onHideAllTab event only get fired if all tabs are closed.
		if ((!this.stopEvent) && (numOpen === 0))
		{
			this.fireEvent('onHideAllTab', this);
		}
	},
	selectedHandler: function(obj) {
		if (($defined(obj)) && (!this.stopEvent))
		{
			this.fireEvent('onSelected', obj);
		}
	}

});


// *********************************************
// CHKQueue - Queue
// *********************************************
var CHKQueue = new Class({
	Implements: [Events, Options, CHKOverrides],
	options: {
		enforceUnique: false
	},
	queue: [],
	initialize: function(options) {
		this.setOptions(options);
		this.setOverrides();
	},
	enqueue: function(item) {
		var enqueueFlag = false;
		
		// check to make sure the item is defined
		if ($defined(item))
		{
			// check to see if the enforceUnique option is on. if so only add the item if it doesn't already exist in the que
			if (this.options.enforceUnique)
			{
				if (!this.queue.contains(item))
				{
					this.queue.push(item);
					enqueueFlag = true;
				}
			}
			else
			{
				this.queue.push(item);
				enqueueFlag = true;
			}
		}
		
		// fire off the enqueue event
		this.fireEvent('enqueue', { item: item, success: enqueueFlag, obj: this});
	},
	dequeue: function() {
		var output = null,
		dequeueFlag = false;
		
		// check to make sure that the queue is properly defined and that it has values.
		if ($defined(this.queue) && this.queue.length > 0)
		{
			// shift the first item off of the array and return it in the output variable.
			output = this.queue.shift();
			dequeueFlag = true;
		}
		
		// fire off the dequeue event
		this.fireEvent('dequeue', { item: output, success: dequeueFlag, obj: this});
		
		return output;
	},
	clearQueue: function() {
		if ($defined(this.queue) && this.queue.length > 0)
		{
			this.queue = this.queue.empty();
			
			// fire off the clearqueue event
			this.fireEvent('clearQueue', this);
		}
	},
	getSize: function() {
		// check to make sure that the queue is properly defined and that it has values
		if ($defined(this.queue) && this.queue.length > 0)
		{
			// return the length of the queue
			return this.queue.length;
		}
		
		// the queue was not defined or it had nothing in it.  return 0
		return 0;
	},
	hasItems: function() {
		// if the size is greater than 0, we have items.  return true
		if (this.getSize() > 0)
		{
			return true;
		}
		
		// there are no items, return false
		return false;
	},
	hasItem: function(obj) {
		var output = false;
		
		// check to make sure that the obj and the queue are properly defined.
		if ($defined(obj) && $defined(this.queue) && this.queue.length > 0 && this.queue.contains(obj))
		{
			// a match was found. set the flag
			output = true;
		}
		
		// return the flag
		return output;
	},
	removeItem: function(obj) {
		var output = false;
		
		// only remove the item if it exists in the queue
		if ($defined(obj) && $defined(this.queue) && this.queue.length > 0 && this.queue.contains(obj))
		{
			this.queue = this.queue.erase(obj);
			output = true;
		}
		
		// fire off the removeItem event
		this.fireEvent('removeItem', { item: obj, success: output, obj: this});
		
		return output;
	}
});

// *********************************************
// CHKRequestMulti - Multiple Request object.
// *********************************************
var CHKRequestMulti = new Class({
	Implements: [Events, Options, CHKOverrides, CHKClassName],
	options: {
		poolSize: 1
	},
	requestObjs: null,
	initialize: function(options) {
		this.setOptions(options);
		this.requestObjs = $H({});
		
		if ($defined(this.options.poolSize) && this.options.poolSize > 0)
		{
			// loop through the pool size and set up the event handlers
			for(i=0; i<this.options.poolSize; i++)
			{
				// get a reference to myself for use in the delegate functions below.
				var reqMultiObj = this;
				
				// use the current iteration as a unique id for the request object by passing it in as an option.
				// the parseInt as well as the options breaks the reference binding to the value.
				this.options.uid = parseInt(i,10);
				
				// instantiate a new request object
				var req = new Request(this.options);
				
				// wire up the delegate event handlers using the loop number as an id.
				// binding was not implemented on the delegate so that I could gain access to the current request object
				// and access the unique id (uid).
				req.addEvent('onComplete', function() {
					reqMultiObj.onCompleteHandler(this.options.uid);
				});
				
				req.addEvent('onCancel', function() {
					reqMultiObj.onCancelHandler(this.options.uid);
				});
				
				req.addEvent('onSuccess', function(responseText, responseXML) {
					reqMultiObj.onSuccessHandler(responseText, responseXML, this.options.uid);
				});
				
				req.addEvent('onFailure', function(xhr) {
					reqMultiObj.onFailureHandler(xhr, this.options.uid);
				});
				
				req.addEvent('onException', function(headerName, value) {
					reqMultiObj.onExceptionHandler(headerName, value, this.options.uid);
				});
				
				req.addEvent('onTimeout', function() {
					reqMultiObj.onTimeoutHandler(this.options.uid);
				});
				
				// add the request object to the internal collection.
				this.requestObjs.set(i, { isOpen: true, obj: req });
			}
		}
	},
	send: function(options) {

		if ($defined(this.requestObjs) && this.requestObjs.getLength() > 0)
		{
			var req = null;
			
			// Loop through the requestObjs collection and see if any of them are available to handle a request.
			this.requestObjs.each(function(value, key){
				if (!$defined(req) && $defined(value) && $defined(value.isOpen) && value.isOpen === true && $defined(value.obj))
				{
					// set the isOpen flag on this request to false.
					value.isOpen = false;

					// make the request.
					req = value.obj;
				}
			}.bind(this));
			
			if ($defined(req))
			{
				return req.send(options);
			}
		}
		
		// none of the request objects were available
		return null;
	},
	isOpen: function() {
		var isOpen = false;
		
		if ($defined(this.requestObjs) && this.requestObjs.getLength() > 0)
		{
			// Loop through the requestObjs collection and see if any of them are available to handle a request.
			this.requestObjs.each(function(value, key){
				if ($defined(value) && $defined(value.isOpen) && value.isOpen === true)
				{
					isOpen = true;
				}
			}.bind(this));
		}
		
		// none of the request objects were available
		return isOpen;
	},
	onCompleteHandler: function(id) {
		// set the isOpen flag on the request object to true;
		if ($defined(this.requestObjs) && this.requestObjs.has(id) && $defined(this.requestObjs.get(id)))
		{
			var requestObj = this.requestObjs.get(id);
			if ($defined(requestObj.isOpen))
			{
				requestObj.isOpen = true;
			}
		}
		
		// fire the event
		this.fireEvent('onComplete', [id]);
	},
	onCancelHandler: function(id) {
		// set the isOpen flag on the request object to true;
		if ($defined(this.requestObjs) && this.requestObjs.has(id) && $defined(this.requestObjs.get(id)))
		{
			var requestObj = this.requestObjs.get(id);
			if ($defined(requestObj.isOpen))
			{
				requestObj.isOpen = true;
			}
		}
		
		// fire the event
		this.fireEvent('onCancel', [id]);
	},
	onSuccessHandler: function(responseText, responseXML, id) {
		// set the isOpen flag on the request object to true;
		if ($defined(this.requestObjs) && this.requestObjs.has(id) && $defined(this.requestObjs.get(id)))
		{
			var requestObj = this.requestObjs.get(id);
			if ($defined(requestObj.isOpen))
			{
				requestObj.isOpen = true;
			}
		}
		
		// fire the event
		this.fireEvent('onSuccess', [responseText, responseXML, id]);
	},
	onFailureHandler: function(xhr, id) {
		// set the isOpen flag on the request object to true;
		if ($defined(this.requestObjs) && this.requestObjs.has(id) && $defined(this.requestObjs.get(id)))
		{
			var requestObj = this.requestObjs.get(id);
			if ($defined(requestObj.isOpen))
			{
				requestObj.isOpen = true;
			}
		}
		
		// fire the event
		this.fireEvent('onFailure', [xhr, id]);
	},
	onExceptionHandler: function(headerName, value, id) {
		// set the isOpen flag on the request object to true;
		if ($defined(this.requestObjs) && this.requestObjs.has(id) && $defined(this.requestObjs.get(id)))
		{
			var requestObj = this.requestObjs.get(id);
			if ($defined(requestObj.isOpen))
			{
				requestObj.isOpen = true;
			}
		}
		
		// fire the event
		this.fireEvent('onException', [headerName, value, id]);
	},
	onTimeoutHandler: function(id) {
		// set the isOpen flag on the request object to true;
		if ($defined(this.requestObjs) && this.requestObjs.has(id) && $defined(this.requestObjs.get(id)))
		{
			var requestObj = this.requestObjs.get(id);
			if ($defined(requestObj.isOpen))
			{
				requestObj.isOpen = true;
			}
		}
		
		// fire the event
		this.fireEvent('onTimeout', [id]);
	}
});

// *********************************************
// CHKCoreEngine_Base - 
// *********************************************
var CHKCoreEngine_Base = new Class({
	Implements: [Events, Options, CHKOverrides, CHKClassName],
	results: null, 
	resizeControl: null,
	toolbar: null, 
	pagemenus: [], 
	headerPopups: [], 
	headerTabControls: [],
	pagePopups: [], 
	pageTabControls: [],
	pageAccordions: [],
	footerPopups: [], 
	footerTabControls: [],
	pageScrollBoxes: [],
	buttons: [],
	sliders: [],
	view: [],
	sorter: null,
	services: [], 
	options: {
	},
	initialize: function(options) {
		this.setOptions(options);
		this.setOverrides();
		
		this.render(false);
	},
	render: function(resize) {
		if (!$defined(resize))
		{
			resize = false;
		}
		
		this.fireEvent('onBeginRender', this);
		
		if ($defined(this.customRender))
		{
			this.customRender(resize);
		}
		
		this.fireEvent('onEndRender', this);
	},
	customRender: $empty,
	setResults: function(obj) {
		if ($defined(obj)) 
		{
			// Save the results object
			obj.addEvent('onPositionChange', this.onPositionChangeReultsHandler.bind(this));
			this.results = obj;
		}
	},
	setResize: function(obj) {
		if ($defined(obj))
		{
			obj.addEvent('onResize', this.resizeHandler.bind(this));
			obj.addEvent('onResizeThreshold', this.resizeHandlerThreshold.bind(this));
			this.resizeControl = obj;
		}
	},
	setToolbar: function(obj) {
		// Save the toolbar object
		if ($defined(obj))
		{
			this.toolbar = obj;
		}
	},
	addSlider: function(obj) {
		if ($defined(obj))
		{
			obj.addEvent('onChange', this.onChangeSliderHandler.bind(this));
			this.sliders.push(obj);
		}
	},
	addView: function(obj) {
		if ($defined(obj)) 
		{
			// Wire up the event handlers
			obj.addEvent('onSelected', this.viewSelectedHandler.bind(this));
			this.view.push(obj);
		}
	},
	addServices: function(obj) {
		if ($defined(obj)) 
		{
			// Wire up the event handlers
			obj.addEvent('getDataSuccess', this.getDataSuccessHandler.bind(this));
			obj.addEvent('getDataFail', this.getDataFailHandler.bind(this));
			this.services.push(obj);
		}
	},
	addMenu: function(obj) {
		if ($defined(obj)) 
		{
			this.pagemenus.push(obj);
		}
	},
	addHeaderPopup: function(obj) {
		if ($defined(obj)) 
		{
			this.headerPopups.push(obj);
		}
	},
	addHeaderTabControls: function(obj) {
		if ($defined(obj)) 
		{
			this.headerTabControls.push(obj);
		}
	},
	addPagePopup: function(obj) {
		if ($defined(obj)) 
		{
			this.pagePopups.push(obj);
		}
	},
	addPageTabControls: function(obj) {
		if ($defined(obj)) 
		{
			this.pageTabControls.push(obj);
		}
	},
	addPageScrollBox: function(obj) {
		if ($defined(obj))
		{
			this.pageScrollBoxes.push(obj);
		}
	},
	addPageAccordions: function(obj) {
		if ($defined(obj)) 
		{
			this.pageAccordions.push(obj);
		}
	},
	addFooterPopup: function(obj) {
		if ($defined(obj)) 
		{
			this.footerPopups.push(obj);
		}
	},
	addFooterTabControls: function(obj) {
		if ($defined(obj)) 
		{
			this.footerTabControls.push(obj);
		}
	},
	addButton: function(obj) {
		if ($defined(obj)) 
		{
			this.buttons.push(obj);
		}
	},
	getBroswerSize: function() {
		if ($defined(this.resizeControl))
		{
			return this.resizeControl.getSize();
		}
		return null;
	},
	viewSelectedHandler: function(obj){
		// If a results obj has been set, set the view
		if (($defined(this.results)) && ($defined(obj)) && ($defined(obj.options)) && ($defined(obj.options.name)))
		{
			this.results.setView(obj.options.name);
			
			if (($defined(this.pageScrollBoxes)) && (this.pageScrollBoxes.length > 0))
			{
				this.pageScrollBoxes.each(function(item, index) { item.render(false); }.bind(this));
			}
		}
	},
	onChangeSliderHandler: function(data) {
		// Update the other sliders
		if (($defined(this.sliders)) && (this.sliders.length > 0))
		{
			this.sliders.each(function(slider, i) {
				if(slider.uid !== data.obj.uid)
				{
					slider.setPositionByPercentage(data.percentage);
				}
			}.bind(this));
		}
		
		// update the results panel
		if ($defined(this.results))
		{
			this.results.setPosition(data.percentage);
		}
	},
	onPositionChangeReultsHandler: function(data) {
		// update the sliders
		if (($defined(this.sliders)) && (this.sliders.length > 0))
		{
			this.sliders.each(function(slider, i) {
				if(slider.uid !== data.obj.uid)
				{
					slider.setPositionByPercentage(data.percentage, true);
				}
			}.bind(this));
		}
	},
	onChangeTabbedHandler: function(data) {
		// If a results obj has been set, adjust the position
		if ($defined(this.results))
		{
			this.results.setPosition(data.position);
		}
	},
	getDataSuccessHandler: function(data) {
		if ($defined(this.results))
		{
			this.results.loadData(data);
		}
	},
	getDataFailHandler: function(data) {
		alert('Get Data Failure - ' + JSON.encode(data));
	},
	resizeHandler: function(size) {
	},
	resizeHandlerThreshold: function(size) {
	}
});

var PopupManager = new Class({
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
        }.bind(this))
    }

});

/**
 * this class should be mixed to popup in order to add accessibility functionality
 * */
var PopupAccessibility = new Class({

    addSimpleAccessibility : function () {
        var links = this.targetEl.getElements("a");
        if (links && links.length > 0) {
            this.addAccessibility(links[0], links[links.length - 1]);
        }
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
            }

            return true;
        }.bind(this));
    },

    _addFirstLinkEvents : function (firstLink) {
        this.addEvent('onshow', function() {
            firstLink.focus();
        });

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
                this._triggerLink().focus();
            }
        }.bind(this));
    },

    _triggerLink: function () {
        return this.triggerEl.nodeName == "A" ? this.triggerEl : this.triggerEl.getElement("a");
    }
});

