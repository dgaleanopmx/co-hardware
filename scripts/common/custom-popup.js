// *********************************************
// CHKCustomPopUp -
// *********************************************
window.CHKCustomPopUp = new Class ({
	// Events
	//	onShow
	//	onHide
	//	onTransitionStart
	//	onTransitionComplete
	Implements: [Events, Options, CHKOverrides],
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

			// add the obj to the hideEls array
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