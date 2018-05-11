var MIMVideos=[];//Array that contains all video objects
var BCL={};
var core;//Core instance
BCL.autoPlay=false;
 
/*BrightCove Template loaded handler*/
BCL.onTemplateLoaded = function (id) {
	 // get a reference to the player
  BCL.player = brightcove.getExperience(id);
  
  // get references to the experience and video player modules
  BCL.experienceModule = BCL.player.getModule(APIModules.EXPERIENCE);
  BCL.videoPlayer = BCL.player.getModule(APIModules.VIDEO_PLAYER);
 


  
 };
 
 BCL.onTemplateReady = function (id) {
  if(BCL.autoPlay==true && BCL.videoPlayer!=null){
  BCL.videoPlayer.play(); 
  }
  BCL.videoStarted = true;
  destroySpoolers();

 
  

};
 


BCL.removePlayer = function () {
  // do this only if we have a player
  if(BCL.videoStarted==true) {   	
    // unload the player
    BCL.experienceModule.unload();
	 BCL.videoStarted = false;
    // remove the player code
  }
};

BCL.stopPlayer= function(){
if(BCL.videoStarted == true) {
BCL.videoPlayer.stop();
}
}

BCL.playPlayer= function(){
if(BCL.videoStarted == true) {
BCL.videoPlayer.play();
}
}

BCL.pausePlayer= function(){
if(BCL.videoStarted == true) {
BCL.videoPlayer.pause();
}
}


function destroySpoolers(){
  $$('.js_temp_spooler').destroy();
}
function updateScreenReading(parentEl, src_selector) {
    if (!parentEl)  return;
        var src_el = parentEl.getElement(src_selector);
        var tar_el = parentEl.getElement('.screenReading');
        if (src_el && tar_el) {
            tar_el.innerHTML = src_el.innerHTML;
        }
}


var MIMVideo= new Class({
	Implements:Options,
	options:{
	autoPlay:false, //Brightcove research needed
	loop:false //Brightcove research needed
	},
	videoPlaceHolder:null,
	videoEl:null,
	imgPopUp:null,
	isVideoActive:null,
	videoID:null,
	triggerEl:null,
	initialize:function(trigger,target,options){
	this.setOptions(options || {});
	this.triggerEl=trigger;
	if($defined($('carousel-tab-controller'))){
	if(!trigger || !target)return;
	this.videoID=target.get('id');
	this.imgPopUp=new CHKCustomPopUp(trigger,target,{showEvent:'click',hideEvent:null,showTriggerClass:'hidden'}); //Quitar show trigger class y mandarla llamar cuando el video detecte que ya se cargó (que va a comenzar).
	
	trigger.addEvent('click',function(){
	this.loadVideo(target);
	this.imgPopUp.show();
	}.bind(this));

	}
	else{
			
	return;
	}
	
	},
	loadVideo:function(target){
	//Construct video Object
	if(!isIE || isIE9){/*catch IE9*/
	this.videoEl=new Element('object',{id:target.get('id')});
	this.videoEl.addClass(''+target.getElements('.class')[0].get('html'));
	this.videoEl.adopt(new Element('param',{name:'bgcolor',value:'#FFFFFF'}));
	this.videoEl.adopt(new Element('param',{name:'width',value:'480'}));
	this.videoEl.adopt(new Element('param',{name:'height',value:'270'}));
	this.videoEl.adopt(new Element('param',{name:'playerID',value:target.getElements('.playerID')[0].get('html')}));
	this.videoEl.adopt(new Element('param',{name:'playerKey',value:target.getElements('.playerKey')[0].get('html')}));
	this.videoEl.adopt(new Element('param',{name:'isVid',value:'true'}));
	this.videoEl.adopt(new Element('param',{name:'isUI',value:'true'}));
	this.videoEl.adopt(new Element('param',{name:'wmode',value:'transparent'}));	
	this.videoEl.adopt(new Element('param',{name:'dynamicStreaming',value:'true'}));
	this.videoEl.adopt(new Element('param',{name:'@videoPlayer',value:target.getElements('.atvideoplayer')[0].get('html')}));
	this.videoEl.adopt(new Element('param',{name:'templateLoadHandler',value:'BCL.onTemplateLoaded'}));	
	this.videoEl.adopt(new Element('param',{name:'templateReadyHandler',value:'BCL.onTemplateReady'}));	
	//this.videoEl.adopt(new Element('param',{name:'includeAPI',value:'true'}));
	//this.videoEl.adopt(new Element('param',{name:'htmlFallback',value:'true'}));
	this.videoPlaceHolder=target; //Save placeholder El (to unload videos later)	
	this.videoEl.replaces(target);
	this.videoEl.getParent().removeClass('hidden');	
	}
	else{//Old IE versions (IE8-IE6)
	var ieWrapper=new Element('div');
	ieWrapper.addClass('hf_clear');
	ieWrapper.addClass('carousel-video-player');
	ieWrapper.innerHTML="<object id=\""+target.get('id')+"\" "+"class=\""+target.getElements('.class')[0].get('html')+"\""+"><param name=\"bgcolor\" value=\"#FFFFFF \"/><param name=\"width\" value=\"480 \"/><param name=\"height\" value=\"270 \"/><param name=\"playerID\" value=\""+target.getElements('.playerID')[0].get('html')+"\"/><param name=\"playerKey\" value=\""+target.getElements('.playerKey')[0].get('html')+"\"/><param name=\"isVid\" value=\"true \"/><param name=\"isUI\" value=\"true\"/><param name=\"wmode\" value=\"transparent\"/><param name=\"dynamicStreaming\" value=\"true\"/><param name=\"@videoPlayer\" value=\""+target.getElements('.atvideoplayer')[0].get('html')+"\"/><param name=\"templateLoadHandler\" value=\"BCL.onTemplateLoaded\"/><param name=\"templateReadyHandler\" value=\"BCL.onTemplateReady\"/></object>";
	this.videoEl=ieWrapper.getFirst('.'+target.getElements('.class')[0].get('html'));
	this.videoPlaceHolder=target; //Save placeholder El (to unload videos later)
	ieWrapper.replaces(target.getParent());

	}
	
	
	
	
	
	brightcove.createExperiences();
	var tempSpooler= $('carousel-video-spooler').clone();
	tempSpooler.removeClass('hidden');
	tempSpooler.addClass('js_temp_spooler');	
	tempSpooler.inject(this.triggerEl,'after');
	BCL.isPlayerAdded=true;
	this.isVideoActive=true;
	BCL.autoPlay=this.options.autoPlay;
	this.triggerEl.getParent().getElements('.carousel-video-player').removeClass('hidden');
	
	
	},
	unloadBCVideo:function(){
	if(this.isVideoActive==true){
	BCL.removePlayer();		
	this.videoPlaceHolder.replaces($(this.videoID));	
	this.isVideoActive=false;
	$(this.triggerEl).removeClass('hidden');
	this.triggerEl.getParent().getElements('.carousel-video-player').addClass('hidden');
	
	}
	else{
	return;
	}
	},
	playVideo:function(){	
	 BCL.videoPlayer.play();
		
	},
	pauseVideo:function(){		
	 BCL.videoPlayer.pause();
		
	}
	
	
});


/*
 * @Name MIMTabbedNavigation @Author Julio Tinajero @Params String ClassPath:
 * tabTriggerClass - Class in tab menu, String Classpath: tabTargetClass - class
 * in tab target container @Description Tabbed Navigation Menu, takes one tab
 * class as parameter and wires it up to its counterpart in tabTargetClass
 * (found in the DOM)
 */
var MIMTabbedNavigation = new Class({
	Implements:[Options,Events],
	tabControl:null,
	video:[],
	options:{
	currentTab:0
	},
    initialize : function(tabTriggerClass, tabTargetClass,options) {
		this.setOptions(options);
        if (!tabTriggerClass || !tabTargetClass) {
            return;
        }
        this.generateTabs(tabTriggerClass, tabTargetClass);
		this.onPageLoad(tabTriggerClass, tabTargetClass);
        // wire up the View controls
        this.tabControl = new CHKTabControl($(document.body));
        var triggerEls = $$(tabTriggerClass);
        var targetEls = $$(tabTargetClass);
		
		var showTabHandler = function (index) {
			updateScreenReading(this.tabs[index].triggerEl, '.js_selectedTab');
		}.bind(this.tabControl);
		
		var hideTabHandler = function (index) {
			updateScreenReading(this.tabs[index].triggerEl, '.js_unselectedTab');
		}.bind(this.tabControl);
		
		this.tabControl.addEvents({
			onShowTab : showTabHandler,
			onHideTab : hideTabHandler
		});
		/*Initialize default image*/
		$$(tabTargetClass)[this.options.currentTab].getElements('img').each(function(img){
		img.set('src',img.getProperty('title'));
		img.erase('title');
		});
		
        triggerEls.each(function(triggerEl, index) {
			var PopupController=new CHKCustomPopUp(triggerEl, ((triggerEl.getProperty('rel')!="" && triggerEl.getProperty('rel'))&&$defined($(triggerEl.getProperty('rel'))))?$(triggerEl.getProperty('rel')):targetEls[index], {
                showEvent : 'click',
                hideEvent : null,
                showTriggerClass : 'current',
                hideTriggerClass : null,
                preventDefault : false,
				stopPropagation:false,
                overrides: {
                    keypressHandler: function(event) {
                        if (event && event.key && event.key == 'enter') {
                            if (this.options.stopPropagation) event.stopPropagation();
                            if (this.options.preventDefault) event.preventDefault();
                            $clear(this.timer);
                            if (this.isOpen === false) {
                                this.show();
                            }
                        }
                    }
                }
            });
			
            this.tabControl.addTab(PopupController);
			this.video.push(new MIMVideo($(triggerEl.get('rel')).getElements('.js_mim_video_play')[0],$(triggerEl.get('rel')).getElements('.carousel-video-url')[0],{autoPlay:true}));
            if (triggerEl.hasClass('current')) {
                this.options.currentTab = index;				
            }
			
			 //Use video manager class
            triggerEl.addEvent('click',function(){
			   	
               this.setScreenReaderText(triggerEls,index);				 	
				 if (triggerEl.hasClass('current')) {
               	 this.options.currentTab = index;
				for(var i=0; i<this.video.length;i++){
				if(index==i){
				continue;
				}
				if(this.video[i].isVideoActive==true){
				this.video[i].unloadBCVideo();
				
				}
				}
				
				 this.tabControl.hideAllTabs(); 
				 $$(tabTriggerClass).removeClass('current');				
				this.tabControl.showTab(this.options.currentTab, false);		
            	}
				else{//IE8 and below
				 this.tabControl.hideAllTabs();
				 
				 for(var i=0; i<this.video.length;i++){
					if(index==i){
					continue;
					}
					if(this.video[i].isVideoActive==true){
						this.video[i].unloadBCVideo();
				
					}
				}
				 
				 
				}
			  
            }.bind(this));
			
			

			
			hideTabHandler(index);
			
        }.bind(this));
       
		this.tabControl.hideAllTabs();
		$$(tabTriggerClass).removeClass('current');
        if(!isIE6){
		this.tabControl.showTab(this.options.currentTab, false);
		}
		else{//IE6 patch
		(function(){this.tabControl.showTab(this.options.currentTab, false);}.bind(this)).delay(1);
		
		}
		core.addView(this.tabControl);
		

    },
     //NOTE: modified screenReading content
    setScreenReaderText: function(triggerEls, cur_tab) {
        triggerEls.each(function(triggerEl, i) {
            if (cur_tab == i){
                if($defined(triggerEl.getElements('.screenReading')[0])){
					triggerEl.getElements('.screenReading')[0].set("text", "Tab - Selected");
				}
			}
            else{
			 if($defined(triggerEl.getElements('.screenReading')[0])){
                triggerEl.getElements('.screenReading')[0].set("text", "Tab");
			}
			}
        });
    },
	generateTabs:function(tabTriggerClass, tabTargetClass) {
	//CREATE IDS AND RELS	
	 var triggers = $$(tabTriggerClass);
        var target = $$(tabTargetClass);
		if(triggers.length==target.length){
		triggers.each(function(trigger,index){		
		trigger.set('rel','videoid_'+index);
		target[index].set('id','videoid_'+index);
		});
		}
		else{
		return;
		}
	},
    onPageLoad : function(tabTriggerClass, tabTargetClass) {	
        var triggers = $$(tabTriggerClass);
        var target = $$(tabTargetClass);

		
        var location = window.location.href.split("#tab");
        var pattern = /[0-9]+/gi;
        var currentTab = pattern.exec(location[1]);

        if (currentTab <= target.length && currentTab > 0) {
            triggers.removeClass('current');
            triggers[currentTab - 1].addClass('current');
            this.setScreenReaderText(triggers,currentTab-1);
        }

    }
});

/* MIM Carousel Class */

var Carousel = new Class({
	Implements: [Options, Events],
	events : [],
	options : {	
		container : 'carousel-inner-rail', //rail id
		selector : '', //child selector
		activeClass : 'active', //className of current (active) element
		hoverClass : 'hover', //className of current (active) element
		startOnItem : 'first', //first, last, center, middle, right or element index
		visibleElements : 3, //elements visible on carousel,
		centerOnActive : true, //if true scrolls active item to the center
		autoAdjust : false,	//automatically adjust width of elements
		mode : 'horizontal', //horizontal or vertical scroll
		duration : 500, //duration of transition per item's width
		frames : 5, //frames per second for effect
		ratio : 50,
		minSpeed : 100,
		maxSpeed : 1000,
		enableHoverBehavior : false,
		updateOnHash : false,
		hashKey : 'carousel',
		hoverDelay : 500,
		onLoad : null,
		onChange : null,
		onComplete : null,
		onHover : null,
		onClick : null
	},
	initialize : function(options){
		this.options = Object.merge(this.options,options);
		
		this.options.container = $(this.options.container);
		this.innerRail = this.options.container.getParent();
		
		this.elements = this.getElements();	
		
		//Add custom events
		this.addEvents({
			'load' : this.options.onLoad?this.options.onLoad:function(){},
			'change' : this.options.onChange?this.options.onChange:function(){},
			'complete' : this.options.onComplete?this.options.onComplete:function(){},
			'hover' : this.options.onHover?this.options.onHover:function(){},
			'click' : this.options.onClick?this.options.onClick:function(){}
		});	
		
		if(this.options.frames <= 0)
			this.options.frames=1;
		
		//Hash events
		if(this.options.updateOnHash){
			this.addEvent("change",function(){
				this.hash.set(this.options.hashKey,this.currentIndex+1);	
			}.bind(this));	
		}
		
		this.setInitialElement();	
		this.setup();	
		this.addBehaviors();
		this.addAccessibility();
					
		this.fireEvent("load");
	},
	getElements : function(){			
		//Get rail elements
		return this.options.container.getChildren(this.options.selector);				
		
	},
	setup : function(){
		this.options.container.setStyle('position','relative');		
		this.innerRail.setStyle('position','relative');	
		this.adjustElementsSize();
		
		var dimensions = this.innerRail.getDimensions();
		var position = this.innerRail.getPosition(this.innerRail.getParent());
		this.rail = Object.merge(dimensions,position);
		if(this.options.mode=="horizontal"){
			this.rail.center = parseInt(dimensions.width / 2);
			this.rail.start = this.rail.center - parseInt(this.rail.width/2);
			this.rail.end = this.rail.width;
		}
		else{
			this.rail.center = parseInt(dimensions.height/2);
			this.rail.start = this.rail.center - parseInt(this.rail.height/2);
			this.rail.end = this.rail.height;
		}
			
		
			
		this.controllers = [this.innerRail.getPrevious('div').getChildren('a')[0],this.innerRail.getNext('div').getChildren('a')[0]];
		
		this.setActiveClass();
		
		if(this.options.centerOnActive)
			this.scrollToCenter();
		else
			this.scrollToVisible();
		//Add carousel events		
		this.addEvent("click",function(element,index){
			this.setCurrentElement(element,index);
		}.bind(this));	
				
		
	},
	adjustElementsSize : function(){
		//Adjust with of elements according to visibleElements number
		if(this.options.autoAdjust==true){
			var size = $(this.innerRail).getSize();		
			if(this.options.mode == 'horizontal'){				
				var width = parseInt( size.x / this.options.visibleElements );			
				$$(this.elements).each(function(el){					
					el.setStyle('width',width);
				}.bind(this));
			}else{	//vertical mode
				var height = parseInt( size.y / this.options.visibleElements );
				$$(this.elements).each(function(el){
					el.setStyle('height',height);
				}.bind(this));
			}
		}
		
		//Set ul total size
		var elementSize = this.element.getSize();
		if(this.options.mode == 'horizontal'){				
			var width = elementSize.x * this.elements.length;
			this.options.container.setStyle('width',width);
		}else{	//vertical mode
			var height = elementSize.y * this.elements.length;			
			this.options.container.setStyle('height',height);
		}
	},
	setInitialElement : function(){
		var currentIndex = 0;		
		if(this.options.updateOnHash && this.hash.get(this.options.hashKey)>0){
			currentIndex = 	this.hash.get(this.options.hashKey)-1;
		}else{
			switch(this.options.startOnItem){
				//first rail element
				case 'first': currentIndex = 0; break; 
				//last rail element
				case 'last' : currentIndex = this.elements.length-1; break; 
				//centered element on visible area
				case 'center' : currentIndex = parseInt(this.options.visibleElements / 2); break;  
				//middle element of total elements
				case 'middle' : currentIndex = parseInt((this.elements.length-1) / 2); break;
				//right element on visible area
				case 'right' : currentIndex = parseInt(this.options.visibleElements-1); break;  
				default : currentIndex = isNaN(this.options.startOnItem)?0:parseInt(this.options.startOnItem);
			}
		}
		this.currentIndex = currentIndex;
		this.element = this.elements[this.currentIndex];	
		
		//if(this.options.updateOnHash){
			//this.hash.set(this.options.hashKey,this.currentIndex+1);	
		//}
		
	},
	addBehaviors : function(){
		//Events attached to elements
		$$(this.elements).each(function(el,idx){
			el.addEvent("click" , function(){
				this.fireEvent('click',[el,idx]);
			 }.bind(this));
		}.bind(this));	
		
		
		$$(this.controllers).each(function(el){	
			el.addEvents({
				"mouseenter" : function(){ 
					this.fireEvent("hover",el);	
						this.stopScroll();
					if(this.options.enableHoverBehavior){					
						this.updateSpeed('max');
					}
						var direction = "right";
						if(el.hasClass("js_scroll_left"))
							direction = "left";
						this.startScroll(direction);
					
				}.bind(this),
				"mouseleave" : function(){ 
					this.fireEvent("leave",el); 					
						this.stopScroll();
				}.bind(this)
			});
		}.bind(this));	
		
		
		if(this.options.enableHoverBehavior){
			this.innerRail.addEvents({
					"mouseenter" : function(e){
						this.fireEvent("hover");
						this.stopScroll();
						this.updateSpeed(e.page.x);
						var direction = "right";
						if(e.page.x < (this.innerRail.getPosition().x + this.rail.center))
							direction = "left";
						this.startScroll(direction);
					}.bind(this), 
					"mousemove" : function(e){ 					
						if(this.isStopped){
							this.isStopped = false;
							var direction = "right";
							if(e.page.x < (this.innerRail.getPosition().x + this.rail.center))
								direction = "left";
							this.periodicalScroll(direction);	
						}
						this.updateSpeed(e.page.x);
					}.bind(this),
					"mouseleave" : function(e){ 
						this.fireEvent("hover");
						this.setTabIndex();
						this.stopScroll(); 
					}.bind(this),
			});		
		}
	},
	setCurrentElement : function(element,index){		
		if(this.currentIndex!=index){
			this.removeActiveClass();
			this.previous = this.element;
			this.element = element;
			this.currentIndex = index;
			this.setActiveClass();
			this.fireEvent("change");
		}else{
			this.fireEvent("doubleclick");	
		}
		if(this.options.centerOnActive)
			this.scrollToCenter();
		else
			this.scrollToVisible();
			
		this.isStopped = true;
	},
	setActiveClass : function(){
		this.element.addClass(this.options.activeClass);
	},
	removeActiveClass : function(){
		this.element.removeClass(this.options.activeClass);
	},
	startScroll : function(direction){
		this.isStopped = false;
		setTimeout(function(){
			if(!this.isStopped)
				this.periodicalScroll(direction);	
		}.bind(this),this.options.hoverDelay);	
	},
	stopScroll : function(){
		this.isStopped = true;
		this.effect.stop();
	},
	periodicalScroll : function(direction){
		if(this.options.speed)
			var distance = this.options.speed / this.options.frames;
		else
			var distance = this.options.duration / this.options.frames;
		var duration = 1000 / this.options.frames;
		if(direction=='right')
			distance = distance*-1;			
		this.scroll(distance,duration,function(){
			if(direction=='left' && this.isVisible('first'))
				this.moveLastToFirst();
			if(direction=='right' && this.isVisible('last'))
				this.moveFirstToLast();
			if(!this.isStopped)
				this.periodicalScroll(direction);
		}.bind(this));
	},
	updateSpeed : function(mousePosition){
		if(mousePosition != 'max'){		
			var pos = mousePosition - this.innerRail.getPosition().x;
			var diff = Math.abs(this.rail.center - pos);
			diff = diff - this.options.ratio;
			var speed = 0;
		}else{
			var speed = this.options.maxSpeed;	
		}
		if(diff > 0){
			var diffPercent = diff * 100 / (this.rail.center - this.options.ratio);
			speed = parseInt((this.options.maxSpeed - this.options.minSpeed) * diffPercent / 100)+this.options.minSpeed;
		}else
			this.stopScroll();
		this.options.speed = speed;
		
	},
	scrollToCenter : function(){
		var currentPosition = this.currentElementPosition();
		var size = this.options.mode=="horizontal"?this.element.getWidth():this.element.getHeight();
		var diff = parseInt(this.rail.center) - parseInt(currentPosition.x + parseInt(size/2));	
		if(diff>0 && this.isVisible('first')){			
			this.moveLastToFirst();
		}else if(diff<0 && this.isVisible('last')){
			this.moveFirstToLast();	
		}
		this.scroll(diff,this.options.duration,function(){
			this.fireEvent("complete");	
		}.bind(this));	
		
	},
	scrollToVisible : function(){		
		//If active element is not entirely visible, moves to visible area
		var currentPosition = this.options.mode=="horizontal"?this.currentElementPosition().x:this.currentElementPosition().y;
		var size = this.options.mode=="horizontal"?this.element.getWidth():this.element.getHeight();
		
		if(this.options.mode=="horizontal"){
			var currentPosition = this.currentElementPosition().x;
			var size = this.element.getWidth();			
		}else{
			var currentPosition = this.currentElementPosition().y;
			var size = this.element.getHeight();		}
		
		if(currentPosition < this.rail.start){
			var diff = parseInt(this.rail.start) - parseInt(currentPosition);
			if(this.isVisible('first'))
				this.moveLastToFirst();
		}
		else if((currentPosition + size) > this.rail.end){
			var diff = 	parseInt(this.rail.end) - (parseInt(currentPosition + size));
			if(this.isVisible('last'))
				this.moveFirstToLast();
		}else{
			var diff = 0;	
		}
		
		var duration = Math.abs(diff/size) * this.options.duration;
		
		this.scroll(diff,duration,function(){
			this.fireEvent("complete");	
		}.bind(this));	
		
	},
	scroll : function(distance,duration,callback){
		var currentLeft = this.options.container.getPosition(this.innerRail).x;	
		var position = currentLeft+distance;
		this.scrollTo(position,duration,callback);
	},
	scrollTo : function(position,duration,callback){				
		duration = duration || this.options.duration;
		this.isScrolling = true;
		
		this.effect = new Fx.Morph(this.options.container, {
			'duration': duration,
			'onComplete' : callback,
			'transition': Fx.Transitions.linear
		});
		this.effect.start({'left':position});
	},
	moveFirstToLast : function(){
		var element = this.getElements()[0];
		element.inject(this.options.container,'bottom');		
		//update position of ul
		var size = element.getSize();
		var current = this.options.container.getPosition(this.innerRail);
		if(this.options.mode == 'horizontal'){
			var left = current.x + size.x;
			this.options.container.setStyle('left',left);
		}else{
			var top = current.y + size.y;
			this.options.container.setStyle('top',top);
		}
		
		return element;
	},
	moveLastToFirst : function(){
		var element = this.getElements()[this.elements.length-1];
		element.inject(this.options.container,'top');
		//update position of ul
		var size = element.getSize();
		var current = this.options.container.getPosition(this.innerRail);
		if(this.options.mode == 'horizontal'){
			var left = current.x - size.x;
			this.options.container.setStyle('left',left);
		}else{
			var top = current.y - size.y;
			this.options.container.setStyle('top',top);
		}
		
		return element;
	},
	getNextIndex : function(){
		//var itemsCount = this.options.scrollPerItem?1:this.options.visibleElements;
		var nextIndex = this.currentIndex + 1;
		if(nextIndex >= this.elements.length)
			nextIndex -= this.elements.length;		
		return nextIndex;
	},
	getPreviousIndex : function(){
		//var itemsCount = this.options.scrollPerItem?1:this.options.visibleElements;
		var previousIndex = this.currentIndex - 1;
		if(previousIndex < 0)
			previousIndex += this.elements.length;
		return previousIndex;			
	},
	scrollToPrevious : function(){
		if(this.isVisible('first'))
			this.moveLastToFirst();
		var previousIndex = this.getPreviousIndex();
		var element = this.elements[previousIndex];
		this.setCurrentElement(element,previousIndex);
	},
	scrollToNext : function(){
		if(this.isVisible('last'))
			this.moveFirstToLast();
		var nextIndex = this.getNextIndex();
		var element = this.elements[nextIndex];
		this.setCurrentElement(element,nextIndex);
	},
	isVisible : function(position,fullElement){
		switch(position){
			case 'first' : var element = this.getElements()[0];break;
			case 'last' : var element = this.getElements()[this.elements.length-1];break;
			case 'previous' : var element = this.elements[this.getPreviousIndex()];break;
			case 'next' : var element = this.elements[this.getNextIndex()];break;
			default : var element = isNaN(position)?position || this.element:this.getElements()[position];
		}
		var visible = true;
		var errMargin = 5;
		if(!fullElement && ((element.getPosition(this.innerRail).x+element.getWidth())<=errMargin || element.getPosition(this.innerRail).x>=this.rail.width-errMargin))
			visible = false;
		else if(fullElement && (element.getPosition(this.innerRail).x<(this.rail.start-errMargin) || (element.getPosition(this.innerRail).x+element.getWidth()) > (this.rail.end+errMargin)))
			visible = false;
					
		return visible;
	},
	currentElementPosition : function(){
		return this.element.getPosition(this.innerRail);
	},
	cloneElements : function(){
		
	},
	addAccessibility : function(){
		//Scroll arrows		
		this.controllers.each(function(a){
			a.addEvents({
				'blur' : function(){
					a.removeClass('scroll-hover');
				}.bind(this),
				'focus' : function(){					
					a.addClass('scroll-hover');					
				}.bind(this),
				'keydown' : function(e){
					if(e.key=="enter"){
						if(a.hasClass('js_scroll_left'))
							this.scrollToPrevious();
						else
							this.scrollToNext();						
						this.element.getElement('a').fireEvent("click");
					}
				}.bind(this)
			});
		}.bind(this));
		
		this.elements.each(function(el){
			var a = el.getElement('a');
			a.addEvents({
				'blur' : function(){
					el.removeClass(this.options.hoverClass);
				}.bind(this),
				'focus' : function(){
					this.fireEvent("focus");
					el.addClass(this.options.hoverClass);					
				}.bind(this),
				'keydown' : function(e){
					var previousKeys = ["left","up"];
					var nextKeys = ["right","down"];
					if(previousKeys.indexOf(e.key)>=0){
					//if(e.key=="left"){
						e.stop();
						if(el==this.elements[this.getNextIndex()])
							this.element.getElement('a').focus();
						else{
							this.scrollToPrevious();
							this.element.getElement('a').focus();
							this.element.getElement('a').fireEvent("click");
						}						
					}
					if(nextKeys.indexOf(e.key)>=0){
					//if(e.key=="right"){
						e.stop();
						if(el==this.elements[this.getPreviousIndex()])
							this.element.getElement('a').focus();
						else{
							this.scrollToNext();
							this.element.getElement('a').focus();
							this.element.getElement('a').fireEvent("click");
						}
					}
					
				}.bind(this)
			});
		}.bind(this));
		
		this.setTabIndex();
		this.addEvent("complete",this.setTabIndex);
		
	},
	setTabIndex : function(){
		var tabIndex = this.controllers[0].get("tabindex");
		this.elements.each(function(el){
			if(this.isVisible(el,true)){
				el.getElement('a').set("tabindex",tabIndex);
			}
			else
				el.getElement('a').set("tabindex","-1");
		}.bind(this));
	},
	hoverNext : function(){
			
	},
	hoverPrevious : function(){
		
	},
	hash : {
		'getAll' : function(){			
			var hashes = window.location.hash.split("&");
			hashes[0] = hashes[0].replace("#","");
			var _hashes = new Array();
			for(var i=0;i<hashes.length;i++){
				var key = hashes[i].split("=")[0];
				var value = hashes[i].indexOf("=")>=0?hashes[i].split("=")[1]:"";
				_hashes[key] = value;
			}
			return _hashes;
		},
		'get' : function(hashKey){
			var hashes = this.getAll();
			return hashes[hashKey]?hashes[hashKey]:false;
		},
		'set' : function(hashKey,hashValue){
			var hashes = this.getAll();			
			hashes[hashKey]	= hashValue;
			window.location.hash = this.hashesToString(hashes);
		},
		'remove' : function(hashKey){
			var hashes = this.getAll();
			if(hashes[hashKey]){
				hashes[hashKey]	= null;
			}
			window.location.hash = this.hashesToString(hashes);
		},
		'hashesToString' : function(hashes){
			var hashStr = "";
			for(var i in hashes){
				if (hashes.hasOwnProperty(i)){
					if(hashes[i]!=null && i){
						if(hashStr!="") 
							hashStr+="&";
						hashStr += i+"="+hashes[i];	
					}
				}
			}
			return hashStr;
		},
		'removeAll' : function(){
			window.location.hash = "";	
		}
	},
	log : function(msg){
		if(typeof(console)!="undefined"){
			if(typeof(msg)=="string")
				console.log("[CAROUSEL LOG]: "+msg);
			else{
				console.log("[CAROUSEL LOG]: ");
				console.log(msg);
			}
		}
	}
});

/* End of MIM Carousel Class */

function initCarousel(){
	window.mimCarousel = new Carousel({
		container : 'carousel-carousel-tabs',
		autoAdjust : true,
		activeClass : 'carousel-active',
		hoverClass : 'carousel-hover',
		startOnItem : 'first',
		hashKey : 'carousel',
		duration : 500,
		centerOnActive : false,
		visibleElements : 4,
		frames : 16,
		updateOnHash : false,
		hoverDelay : 100,
		minSpeed : 200,
		maxSpeed : 600,
		ratio : 50,
		enableHoverBehavior : false,
		onLoad : function(){			
			setImagesSrc(this,true);
			this.element.getElement("a").fireEvent("click");
		},
		onChange : function(){
			setImagesSrc(this);	
			thumbClickMetrics(this.element);
			setFacebookShareImage(this.element);
		},
		onHover : function(){
			setImagesSrc(this);
			setImagesSrc(this);
		}
	});
	
	//Accesibilidad
	mimCarousel.addEvent("focus",function(){
		setImagesSrc(this);	
	});
}

function setImagesSrc(carousel,onlyVisibles){
	$$(".carousel-thumb-img").each(function(img,idx){		
		if(!img.get("src") && img.get("title")!=""){
			if(!onlyVisibles || carousel.isVisible(idx)){
				img.set("src",img.get("title"));
				img.set("title","");				
				img.getParents('.carousel-thumb')[0].setStyle("visibility","visible");				
			}
		}
	});	
}

function setFacebookShareImage(thumb){
	try{
		var imgPath = thumb.getElement('img').get('src');
		var meta = $$('meta[property=og:image]')[0];
		meta.set('content',imgPath);
	}catch(e){}
}

function initVideoMetrics(){
	//Video thumb click
	$$('.carousel-button').each(function(el){
		el.addEvent('mousedown',function(e){
			if(!e.rightClick){
				var webSecId = hpmmd.metatags.web_section_id || 'r163';
				var videoId = el.getAttribute('name') || 'NoID';
				var pageId ='re_'+webSecId+'_carousel-home/'; 
				
				if(el.href.indexOf('jumpid=') <= -1){
					if(videoId.indexOf('carousel-home/') <= -1){
						s_setJumpid(pageId+videoId);
					}
					else{
						s_setJumpid(videoId);
					}
				}

				}
		})
	});
}

function thumbClickMetrics(thumb){
	try{
		var value = thumb.getElement('a.carousel-thumb-url').get("name");
		trackMetrics("newLink",{'name': value, 'type': 'link' });
	}catch(e){}
}

var imgs_loaded=false;
function loadImgs(){

$$("body")[0].addEvent('mouseenter',function(){
if(window.imgs_loaded==true){return;}
$$('.carousel-banner-area img').each(function(img){
if(img.getProperty('title')){
img.set('src',img.getProperty('title'));
img.erase('title');
}

});
window.imgs_loaded=true;
});


$$('a').addEvent('focus',function(){
if(window.imgs_loaded==true){return;}
$$('.carousel-banner-area img').each(function(img,index){
if(img.getProperty('title')){
img.set('src',img.getProperty('title'));
img.erase('title');
}
});
window.imgs_loaded=true;

});
}

function setOmgTrack(input) {
	var axel = Math.random() + "";
	var a = axel * 10000000000000;
	var floodURL = '';
	if(input == ''){
	}
	else if(input == 'Video'){
		floodURL='http://ad.doubleclick.net/activity;src=2305757;type=hpphf063;cat=mimph273;ord='+a+'?';
		window.frames['trackframe'].location=floodURL;
	}
	else if(input == 'PDF'){
		floodURL='http://ad.doubleclick.net/activity;src=2305757;type=hpphf063;cat=mimph413;ord='+a+'?';
		window.frames['trackframe'].location=floodURL;
	}
	else if(input == 'Carousel'){
		floodURL='http://ad.doubleclick.net/activity;src=2305757;type=hpphf063;cat=mimph097;ord='+a+'?';
		window.frames['trackframe'].location=floodURL;
	}
	else{ }
}

function initOmgTrack(){
	//Add iframe at the end of the document
	var frame = new IFrame({
		'src' : '',
		'width' : 1,
		'height' : 1,
		'frameborder' : 0,
		'name' : 'trackframe'
	});
	$$("body")[0].adopt(frame);
	//Video
	$$('.js_mim_video_play').each(function(el){
		el.addEvent("click",function(){
			setOmgTrack('Video');
		});	
	});
	//PDF
	/*$$('.icn_pdf').getNext('.lnk_txt').getElement('a').each(function(el){
		el.addEvent("click",function(){
			setOmgTrack('PDF');
		});	
	});*/
	//Carousel
	$$('.js_tab_trigger').each(function(el){
		el.addEvent("click",function(){
			setOmgTrack('Carousel');
		});	
	});
}


window.addEvent('domready', function () {
	core = new CHKCoreEngine_Base();
	
	
	
	//VIDEO TEST
		
	/*
	*Omniture Metrics for CTA button
	*/
	initVideoMetrics();	
	
	//INIT TABS:
	var CarouselTabs=new MIMTabbedNavigation('.js_tab_trigger', '.js_tab_content');	
	//Carousel    
	initCarousel();
	loadImgs();	
	initOmgTrack();
	
	if(isIE9){
	$$('img').addEvent('contextmenu',function(){
	return false;
	});
	}
});



/*Last Modified 13/07/2012 - 14:00 CST*/