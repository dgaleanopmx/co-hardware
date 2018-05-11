/**
 * SelectoMoo - form select fields replacement with style
 * @version		1.0.0
 * @MooTools version 1.2
 * @author Constantin Boiangiu <constantin.b [at] gmail.com>
 * @copyright Constantin Boiangiu
 * MIT-style license.
 */
var SelectoMoo = new Class({
	Implements: [Options],
	
	options: {
		element: null,
		css: 'selectoMoo',
		listHeight:120,
		optHeight: 40,
		listWidth: 200,
		maxList: 6,
		widthFudge: 54
	},
	
	initialize: function(options){
		
		this.setOptions(options);	
		this.visible = 0;
		/* the select box */
		this.selBox = $(this.options.element);
		this.selBoxContainer = new Element('div', {
			'styles':{
				'opacity':.00001,
				'position':'absolute',
				'top':-10,
				'z-index':-10,
				'display':'none'
				
			}
		})
		this.opt = this.selBox.getElements('option');
		this.currentOption = 0;
		this.numOptions = 0;
		
		/* selected option container */
		this.selectedOption = new Element('div', {
			'class':this.options.css+'_selectedOption',
			'styles':{
				'overflow':'hidden',
				'width': this.options.listWidth-this.options.widthFudge
			}
		});		
		
		/* create a wrapper around the select */
		this.container = new Element('div',{
			'class':this.options.css+'_container',
			'events':{
				'click': function(event){
					event.stopPropagation();
					this.selBox.focus();
					this.showList();
				}.bind(this)			
			},
			'styles':{
				'overflow':'hidden',
				'width': this.options.listWidth-this.options.widthFudge
			}
		}).injectAfter(this.selBox).adopt( this.selBoxContainer.adopt(this.selBox) , this.selectedOption );
		
		/* options container */
		this.outerOptContainer = new Element('div',{
			'class':this.options.css+'_options',
			'styles':{
				'opacity':0,
				'height':this.options.listHeight,
				'width':this.options.listWidth,
				'top':40,
				'overflow': 'hidden'
			},
			'events':{
				click: function(event){
					event.stopPropagation();					
				}.bind(this),
				'mousewheel': function(event){
					/* event.wheel holds direction. Up returns 1, down returns -1 */
					new Event(event).stop(); 
					var elem = this.currentOption-parseInt(event.wheel); 
					if( event.wheel > 0 && elem < 0 ) elem = 0; 
					if( event.wheel < 0 && elem >= this.totalOptions-1 ) elem = this.totalOptions-1;
					this.scrollFx.toElement(this.fakeOptions[elem]); 
					this.fakeOptions[this.currentOption].removeClass(this.options.css+'_naved'); 
					this.fakeOptions[elem].addClass(this.options.css+'_naved'); 
					this.currentOption = elem; 
				}.bind(this)
			}
		}).injectInside(this.container);
		
		this.optContainer = new Element('div',{
			'class':this.options.css+'_options_inner'								
		}).injectInside(this.outerOptContainer);
		
		this.outerOptContainer.set('morph',{'duration':3, 'transition':'back:out', 'wait':false});
		
		this.scrollFx = new Fx.Scroll(this.outerOptContainer, {
			wait: false,
			duration: 300,
			wheelStops: false,
			transition: Fx.Transitions.Sine.easeOut
		});		
		
		/* IE hack to work for labels */
		$(document).getElement('label[for='+this.options.element+']').addEvent('click', function(event){
			event.stopPropagation();
			new Event(event).stop();
			if( this.visible )
				this.hideList();
			else {
				this.selBox.focus();
				this.showList();
			}
		}.bind(this))
		
		this.addOptions();
		this.totalOptions = this.fakeOptions.length;
		
		/* close list when clicked outside the options list */
		$(document).addEvent('click', function(event){
			if( this.visible )
				this.hideList();
		}.bind(this));
		/* open the list when tab used for navigation */
		this.selBox.addEvents({
			'focus': function(event){
				if( this.visible ) return;
				this.showList();
			}.bind(this),
			'blur': function(event){
				/* delay list hiding in case an option from list was clicked */
				if( !this.visible ) return;
				this.hideList.delay(100, this);
				
			}.bind(this),
			'keydown':function(evt){
				if( evt.key == 'enter' ){
					this.fakeOptions[this.currentOption].fireEvent('click');
					return;
				}
				if( evt.key!=='up' && evt.key!=='down' ) return;
				
				var step = evt.key == 'up' ? -1 : 1;
				var elem = this.currentOption+step;
				if( evt.key == 'up' && elem < 0 ) elem = 0;
				if( evt.key == 'down' && elem >= this.totalOptions-1 ) elem = this.totalOptions-1;
				this.scrollFx.toElement(this.fakeOptions[elem]);
				this.fakeOptions[this.currentOption].removeClass(this.options.css+'_naved');
				this.fakeOptions[elem].addClass(this.options.css+'_naved');
				this.currentOption = elem;
				
			}.bind(this),
			'mousewheel': function(event){
				new Event(event).stop();
				var elem = this.currentOption-event.wheel;
				if( event.wheel > 0 && elem < 0 ) elem = 0;
				if( event.wheel < 0 && elem >= this.totalOptions-1 ) elem = this.totalOptions-1;
				this.scrollFx.toElement(this.fakeOptions[elem]);
				this.fakeOptions[this.currentOption].removeClass(this.options.css+'_naved');
				this.fakeOptions[elem].addClass(this.options.css+'_naved');
				this.currentOption = elem;
				
			}.bind(this)
		});		
	},
	
	addOptions: function(){
		this.fakeOptions = new Array();
		this.opt.each(function(el, i){
			
			/* add selected option text */
			if( el.selected == true ){
				this.selectedOption.set({'text':el.get('text')});
			}
						
			if( el.get('value') !== '' ){
				/* set options in options container */
				this.numOptions++;
				var option = new Element('div', {
					'class':this.options.css+'_option'+( el.selected == true ? ' '+this.options.css+'_selected':'' ),
					'text':el.get('text'),
					'events':{
						'click': function(event){
							if( event )
								event.stopPropagation();
							this.setOption(i, el.get('text'));
						}.bind(this), 
						'mouseenter': function(){
							option.addClass(this.options.css+'_hovered');
						}.bind(this),
						'mouseleave': function(){
							option.removeClass(this.options.css+'_hovered');
						}.bind(this)
					}
				}).injectInside(this.optContainer);
				this.fakeOptions.include(option);
				if( el.selected == true )
					this.currentOption = this.fakeOptions.indexOf(option);
				this.opt[i]['fakeOption'] = option;
			}	
			
		}.bind(this))
	},
	
	showList: function(){
		//$$(this.options.css+'_options').each(function(el) {el.setStyle('z-index','0'); console.log('z');});
		if( !Browser.Engine.trident )
			this.selBox.focus();
		if(this.visible == 1) return;
		this.visible = 1;
		this.container.setStyle('overflow', 'visible');
		this.container.setStyle('z-index', '10001');
		// up or down
		var toUp = this.container.getCoordinates().bottom - window.getScroll().y;
        var toDown = window.getSize().y - toUp;
		var listHeight;
		if (this.numOptions <= this.options.maxList) {
			listHeight = this.numOptions * this.options.optHeight;
		} else {
			listHeight = this.options.maxList * this.options.optHeight;
		}
		
        if (toDown < listHeight && toUp >= listHeight) { // if to down does not fit
                       
            //this.changeDirectionClasses("up");
		  if (this.numOptions <= this.options.maxList) {
			  this.outerOptContainer.morph({'height':[0,this.numOptions * this.options.optHeight], 'opacity':[.5,1], 'top':-(this.numOptions * this.options.optHeight), 'left':-1});
		  } else {
			  this.outerOptContainer.morph({'height':[0,this.options.maxList * this.options.optHeight], 'opacity':[.5,1], 'top':-(this.options.maxList * this.options.optHeight), 'left':-1});
			  this.outerOptContainer.setStyle('overflow-y','scroll');
			 // this.outerOptContainer.setStyle('overflow','scroll');
		  }

           
        } else {
           
            //this.changeDirectionClasses("down");

		  if (this.numOptions <= this.options.maxList) {
			  this.outerOptContainer.morph({'height':[0,this.numOptions * this.options.optHeight], 'opacity':[.5,1], 'top':39, 'left':-1});
		  } else {
			  this.outerOptContainer.morph({'height':[0,this.options.maxList * this.options.optHeight], 'opacity':[.5,1], 'top':39, 'left':-1});
			  this.outerOptContainer.setStyle('overflow-y','scroll');
			 // this.outerOptContainer.setStyle('overflow','scroll');
		  }
        }
		
		
		this.scrollFx.toElement(this.fakeOptions[this.currentOption]);
	},
	
	hideList: function(){
		/* 
			Note: when using back, bounce or elastic as transition and play with height, 
			in IE you can't morph to 0 because size goes out of bounds and errors are issued 
		*/
		if(this.visible == 0) return;
		this.visible = 0;
		this.outerOptContainer.morph({'height':0, 'opacity':0, 'top':0});
		this.container.setStyle('overflow', 'hidden');
		this.container.setStyle('z-index', '0');	
		//if( !Browser.Engine.trident )
			this.selBox.blur();
	},
	
	setOption: function(key, optValue){
		this.opt.each(function(el, i){
			
			if( el.selected == true )
				el.selected = false;
			if( i == key ) {
				el.set({'selected':true});
				this.selBox.fireEvent("change");
			}
		}.bind(this));
		$$('.'+this.options.css+'_selected').removeClass(this.options.css+'_selected');
		this.opt[key]['fakeOption'].addClass(this.options.css+'_selected');	
		this.selectedOption.set({'text':optValue});
		this.hideList();
	}
})