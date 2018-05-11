var Spooler = new Class({
	
	Implements : Options,
	
	options: {
		activeClass: 'active',
		relClass: 'active',
		considerScroll: true
		
	},
    
    initialize : function(targetEl, relSelector, options) {
        if (!targetEl) {
            return;
        }
        this.setOptions(options || {});
		
		var o = this.options;
		
		var getScrollOffsetHeight = function(el) {
			var result = 0;
			var element = el;
			var offset;
			do {
				element = element.getParent();
				offset = element.getScroll().y;
				if (offset>0)
				{
					result += offset;
				}
			} while (element!=window.document.body)
			return result;
		};
		
		var considerScroll = this.options.considerScroll;
		var wrapper = false;
		
		if(targetEl.getParent().getProperty('class').contains('spooler_wrapper'))
		{
		wrapper = true;
		considerScroll = false;
		}
				
		targetEl.addEvents({
			'show': function (e) {
				if(wrapper)$$('.spooler_wrapper_650').setStyle('display','block');					
				this.addClass(o.activeClass);
				var img = this.getFirst() ;
				var height = window.getSize().y;
				var parentSize = this.getParent().getSize();
				if (height>parentSize.y) {
					height = parentSize.y;
				} else {
					height -= this.getPosition().y;
				}
				img.setStyle('top',Math.floor((height - img.getSize().y + (considerScroll ? getScrollOffsetHeight(this) : 0)) / 2));
				
				this.setStyles({
					'width':parentSize.x+'px',
					'height':parentSize.y+'px'
				});
				
				$$(relSelector).each(function(el){
					el.addClass(o.relClass);
					var size = el.getParent().getSize();
					el.setStyles({
						'width':size.x+'px',
						'height':size.y+'px'					
					})
					//adds fade effect					
					el.set('tween',{duration:100})
					el.tween('opacity',0.7)
					
				});
			},
			'hide': function(e) {
				this.removeClass(o.activeClass);
				$$(relSelector).each(function(el){
					//adds fade out effect
					el.set('tween',{duration:100})
					el.tween('opacity',0)
					el.removeClass(o.relClass);	
					if(wrapper)$$('.spooler_wrapper_650').setStyle('display','none');
				});
			}
		});
	}
});

var initSpoolers = function (elementSelector, options) {
    $$(elementSelector || '.js_spooler').each(function(targetEl) {
		new Spooler(targetEl, targetEl.get('rel'), options);
	});
};

/* UnCompressed - Reason: DISABLED_TARGET-PREVIEWCWADEPLOYER# */

/*
Date: 2/22/2012 10:43:13 PM
All images published
*/