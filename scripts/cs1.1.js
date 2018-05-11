// Clean Sheet 1.1 JavaScript

//BEGIN: NavToggler Class
var NavToggler = new Class
({
	 
	 /**
	* @class NavToggler
	* @param {Object} navSectionHeaders - array-like collection of elements
	*/
	 initialize: function (navSectionHeaders)
	 {
		 this.navSectionHeaders = navSectionHeaders;
		 navSectionHeaders.addEvent('click', this.toggleNavigation);
	 },
	 
	 toggleNavigation: function(sectionHeader)
	 {
		var sectionHeader = sectionHeader.target;
		var sectionHeaderParent = sectionHeader.getParent('li');
		var sectionHeaderSubNav = sectionHeader.getNext('ul');
		var visibleSubNavItems = sectionHeaderSubNav.getElements('li.menu_open');
	 
		if (sectionHeaderParent.hasClass('menu_open') === true)
		{
			
			if (visibleSubNavItems.length > 0) {
				visibleSubNavItems.each(function(el)
				{
					el.removeClass('menu_open').addClass('menu_closed');
					el.getElement('ul').setStyle('display', 'none');
				});
			}
			
			// Close the parent nav item that was clicked
			sectionHeaderParent.removeClass('menu_open').addClass('menu_closed');
			sectionHeaderSubNav.setStyle('display', 'none');
		}
		
		// Else if the menu clicked was closed, let's open it
		else if (sectionHeaderParent.hasClass('menu_closed') === true)
		{
			sectionHeaderParent.removeClass('menu_closed').addClass('menu_open');
			sectionHeaderSubNav.setStyle('display', 'block');
		}
	}
});
//END: NavToggler Class

// BEGIN: ContentToggler Class
var ContentToggler = new Class
({
	
	/**
	* @class ContentToggler
	* @param {String} selectionItems - CSS selector ending with 'ul li a'. Default: '.tab_selection_items ul li a'
	* @param {String} contentItems - CSS selector ending with '.tab_content'. Default: '.tab_content_items .tab_content'
	* @param  {Boolean} makeBookmarkable - Default: 'true'
	*
	* Can have more than one instance per page, but only one should allow for bookmarkablility
	* 		new ContentToggler('#tab_group1 ul li a', '#tab_content_group1 .tab_content', true);	
	* 		new ContentToggler('#tab_group2 ul li a', '#tab_content_group2 .tab_content', false);	
	*/
	initialize: function (selectionItems, contentItems, makeBookmarkable)
	{
		this.selectionItems = (selectionItems) ? $$(selectionItems) : $$('.tab_selection_items ul li a');
		this.contentItems = (contentItems) ? $$(contentItems) : $$('.tab_content_items .tab_content');
		this.urlHash = document.location.hash;
		this.makeBookmarkable = (makeBookmarkable) ? makeBookmarkable : true;
		
		if (this.selectionItems != undefined)
		{
			this.selectionItems.addEvent('click', this.executeToggle.bind(this));
		}
		
		// If a url hash is found in document.location, check it's validity for this page.
		if (this.urlHash != undefined && this.urlHash !== '')
		{
			this._checkForValidBookmarkableURL(this.urlHash, this.selectionItems);
		}
	},
	
	/**
	* Checks that the selector and content item referenced in the url hash are both present in the DOM.
	* Valid url hash for a bookmarakble is "#/id-name-of-content-to-display/" (e.g. hp.com/hello.html#/tab1/)
	* Slashes "/" are used in the url hash to prevent the browser from jumping down the page to the element ID
	*/
	_checkForValidBookmarkableURL: function(urlHash, selectionItems)
	{
			var urlHash = urlHash.split('/')[1];
			var contentEl = $(urlHash);
			var selectorEl = selectionItems.filter(function(el)
			{
				 return el.getProperty('href') == '#' + urlHash;
			})[0];

			if (selectorEl && contentEl)
			{
				this.executeToggle(selectorEl);
			}
			else
			{
				return;
			}

	},
	
	/**
	* This function has two purposes.
	* First: Will be used as an event handler for onclick events received from a selectionItem ('event' will be the event object)
	* Second: Can be invoked programatically when a valid url hash is found (' event' will be the element to simulate a click event on)
	*/
	executeToggle: function(event) {
		
		if (event.target === '')
		{
			// Because event.target was a blank String, we know this function is being called programatically rather than from a click event.
			// This occurs when a valid url hash has been found.
			var elClicked = event;
		}
		else
		{
			var elClicked = event.target;
			event.stop();
		}
		
		var hrefName = elClicked.getProperty('href').replace('#','');
		 
		 // Don't toggle anything if the tab is active or disabled
		if (elClicked.hasClass('active') || elClicked.hasClass('disabled'))
		{
			return;
		}
		else
		{
			// Remove the .active class from all selectionItems
			this.selectionItems.each(function(el)
			{
				el.removeClass('active');
			});
			
			// Add the .active class to the selectionItem clicked
			elClicked.addClass('active');
			
			// Hide all the content items
			this.contentItems.each(function(el)
			{
				el.hide();
			});
			
			// Display the contentItem with the matching ID 
			this.contentItems.each(function(el)
			{
				var elID = el.getProperty('id');
				if (elID === hrefName)
				{
					el.setStyle('display','block');
				}
			});
			
			// Check to see if the content should be bookmarkable. If so, set the hash.
			if (this.makeBookmarkable === true)
			{
				document.location.hash = "/" + hrefName + "/";
			}

		}

	}
	
});
// END: ContentToggler Class