hp = hp || {};

function cropTextByHeight(text, targetEl, heightEl, maxHeight) {
    if (!targetEl) {
        return;
    }

    var params = {
        cropChars : 1,
        noneStyles : {visibility:'hidden', display:'inline'},
        restoreStyles : {visibility:'', display:''}
    };

    if (targetEl.getStyle('display') == 'none') {
        targetEl.setStyles(params.noneStyles);
    }
    targetEl.set('text', text);

    if (heightEl.offsetHeight > maxHeight && text.length > 0) {
        var newText = '';
        targetEl.innerHTML = '';
        var i = 0;
        while (heightEl.offsetHeight <= maxHeight && i < text.length) {
            i += params.cropChars;
            newText = targetEl.innerHTML;
            targetEl.innerHTML = text.substr(0, i) + '...';
        }
        targetEl.innerHTML = newText;
    }

    targetEl.setStyles(params.restoreStyles);
}

var DefaultFacetWidthSettingStrategy = new Class({

    setFacetWidths: function(navigationWidth, facets, moreFacet) {
        var facetsNumber = facets.length;
        var facetSpace = facets[0].facet.getStyle('margin-right').toInt() || facets[0].facet.getStyle('margin-left').toInt() || 10;
        var facetWidth = 0;
        if (moreFacet) {
            var moreFacetMaxWidth = moreFacet.facet.getStyle('max-width');
			moreFacetMaxWidth = moreFacetMaxWidth ? moreFacetMaxWidth.toInt() : null;
            if(moreFacetMaxWidth)
                moreFacet.setWidth(moreFacetMaxWidth);
            else
            {
                facetWidth = Math.floor((navigationWidth - facetSpace * facetsNumber) / (facetsNumber + 2));
                moreFacet.setWidth(navigationWidth - ((facetWidth + facetSpace) * facetsNumber));
            }
        } else {
            facetWidth = Math.floor((navigationWidth + facetSpace) / facetsNumber - facetSpace);
            facets[facets.length - 1].facet.addClass('facet_last');
        }

        facets.each(function(facet) {
                var facetMaxWidth = facet.facet.getStyle('max-width');
				facetMaxWidth = facetMaxWidth ? facetMaxWidth.toInt() : null;
                if(facetMaxWidth && facetMaxWidth>0)
                    facet.setWidth(facetMaxWidth);
                else
                    facet.setWidth(facetWidth);
        });
    },

    setWidthForSingleShownFacet: function(facetOptions, calculatedWidth) {
        facetOptions.setStyle('width', calculatedWidth + 'px');
    }

});

var SearchFacetWidthSettingStrategy = new Class({

    setFacetWidths: function(navigationWidth, facets, moreFacet) {

        var facetAdditionalSpace = parseInt(facets[0].facet.getStyle("margin-left")) + parseInt(facets[0].facet.getStyle("margin-right"));
        var facetWidth = (navigationWidth / 5) - facetAdditionalSpace;
        if (moreFacet) {
            var moreFacetWidth = parseInt(moreFacet.facet.getStyle('max-width'));

            if(!moreFacetWidth){
                moreFacetWidth = facetWidth;
            }

            facetWidth = ((navigationWidth - moreFacetWidth) / 4) - facetAdditionalSpace;
            moreFacet.setWidth(moreFacetWidth);
        }

        facets.each(function(facet) {
            facet.setWidth(facetWidth);
        });
    },

    setWidthForSingleShownFacet: function(facetOptionsEl, calculatedWidth) {
        facetOptionsEl.setStyle('width', calculatedWidth + 'px');
    }
});

var FixedFacetWidthSettingStrategy = new Class({

    setFacetWidths: function(navigationWidth, facets, moreFacet) {

        var facetWidth = 226;

        facets[facets.length - 1].facet.addClass('facet_last');

         if (moreFacet) {
            moreFacet.setWidth(facetWidth);
            moreFacet.facet.setStyle('margin-left','20px');
        }

        facets.each(function(facet) {
            facet.setWidth(facetWidth);
            if(!facet.facet.hasClass('facet_last'))
               facet.facet.setStyle('margin-right','20px');
            else
               facet.facet.setStyle('margin-right','0px');
        });
    },

     setWidthForSingleShownFacet: function(facetOptionsEl, calculatedWidth) {
        facetOptionsEl.setStyle('width', calculatedWidth + 'px');
        var width = facetOptionsEl.getParent().getSize().x;
        //facetOptionsEl.getFirst('div').setStyle('width', width - 23 + 'px');
    }



});



var DefaultFacetsDataAdapter = new Class({

    adapt: function(facets) {
        var result = [];
        var size = facets.length;
        for (var i = 0; i < size; i++) {
            var facet = facets[i];
            result.push(this.adaptFacet(facet));
        }
        return result;
    },

    adaptFacet: function(data) {
        var facet = {};
        var name = data[0];
        facet.name = name;
        facet.caption = data[1];
        facet.allOption = {caption: data[2], value: 'all', name: name, checked: true, id: name + '_all'};

        var optionsData = data[3];
        facet.width = data[4];

        var size = optionsData.length;
        facet.columns = size > 10 ? 2 : 1;
        facet.isOneColumn = facet.columns == 2 ? false : true;

        var options = [];
        for (var i = 0; i < size; i++) {
            var optionData = optionsData[i];
            var value = optionData[0];
            var id = name + '_' + this._sanitize(value);
            var checked = optionData[3];
            options.push({caption: optionData[1], value: value, name: name, disabled: optionData[2], id: id, checked: checked});
            if (checked) {
                facet.allOption.checked = false;
            }
        }

        facet.options = options;
        return facet;
    },

    _sanitize: function(string) {
        return string.replace(/\W/g, '').replace(/\s/g, '')
    }

});


/**
 * Disable All - Enable Active strategy
 *
 * @description Strategy, which provides all options for disabling and active options for enabling
 */
var DisableAllEnableActiveStrategy = new Class({

    initialize: function(controller) {
        this.controller = controller;
    },

    process: function(facets) {
        var size = facets.length;
        var optionsToEnable = [];
        for (var i = 0; i < size; i++) {
            var facet = facets[i];
            var options = facet.options;
            var optionsSize = options.length;

            for (var j = 0; j < optionsSize; j++) {
                var option = options[j];
                if (!option.disabled) {
                    optionsToEnable.push(option.id);
                }
            }
        }
        return {toDisable: this._getOptionsToDisable(), toEnable: optionsToEnable};
    },

    _getOptionsToDisable: function() {
        var optionsToDisable = [];

        this.controller.facetsOptions.each(function(facetOptions) {
            facetOptions._getOptions().each(function(option) {
                if (!option.isAll) {
                    optionsToDisable.push(option.getElement('input').id);
                }
            });
        });
        return optionsToDisable;
    }

});

/**
 * Disable Inactive - Enable Active strategy
 *
 * @description Strategy, which provides inactive options for disabling and active options for enabling
 */
var DisableInactiveEnableActiveStrategy = new Class({

    process: function(facets) {
        var size = facets.length;
        var optionsToEnable = [];
        var optionsToDisable = [];
        for (var i = 0; i < size; i++) {
            var facet = facets[i];
            var options = facet.options;
            var optionsSize = options.length;

            for (var j = 0; j < optionsSize; j++) {
                var option = options[j];
                if (option.disabled) {
                    optionsToDisable.push(option.id);
                } else {
                    optionsToEnable.push(option.id);
                }
            }
        }
        return {toDisable: optionsToDisable, toEnable: optionsToEnable};
    }

});


var FacetedNavigation = new Class({

    Implements: [Events, Options],

    updateStrategy: null,

    options: {
        facetsDataAdapter: new DefaultFacetsDataAdapter(),
        facetWidthSettingStrategy: new DefaultFacetWidthSettingStrategy(),
        createStrategyClass: DisableInactiveEnableActiveStrategy,
        updateStrategyClass: DisableAllEnableActiveStrategy,
        moreThreshold: 6,
        titleOnTop: true,
        titleLittle: false,
        aboveHeight: 7,
		hideResultsCount: false,
		placeTitleOnPaginatorLine: false,
        facetsAccessibilitySelector: ".facet_option:not(.disabled) a"
    },

    /**
     *
     * @constructs
     * @param {Object} labels localized labels
     * @param {Array} modifiers used to customize presentation of the navigation
     * @param {Object} options define common configuration
     */
    initialize: function(labels, modifiers, options) {
        this.setOptions(options);

        this.labels = labels;
        this.modifiers = modifiers;
        this.renderer = new FacetedNavigationRenderer(labels, this.options.moreThreshold);
    },

    create: function(title, data) {
        var facets = this.options.facetsDataAdapter.adapt(data.facets);
        var facetedNavigation = this.renderer.render({ title: data.title || title, count: data.count, facets: facets, titleOnTop: this.options.titleOnTop, titleLittle: this.options.titleLittle, hideResultsCount: this.options.hideResultsCount });
        var placeholder = this.options.placeholderEl;
        placeholder.set('html', facetedNavigation);

        var root = placeholder.getChildren()[0];
        this.modifiers.each(function(modifier) {
            root.addClass('faceted_navigation_' + modifier);
        });
		
		if (this.options.placeTitleOnPaginatorLine) {
			var titleEl = root.getChildren()[2];
			if (titleEl) {
				titleEl.dispose();
				var targetTitleEl = document.getElement('.js_paging');
				if (targetTitleEl) {
					targetTitleEl.getParent().grab(titleEl,'top');
					targetTitleEl.getParent().setStyle('width','100%');
				}
			}
		}
		
        if( data.facets.length === 0 )
        	return;
        this.controller = new FacetedNavigationController(root, this.labels, this.options.facetWidthSettingStrategy, this.options.aboveHeight);
        this._update(facets, new this.options.createStrategyClass(this.controller));

        this.updateStrategy = new this.options.updateStrategyClass(this.controller);

        this._cropFacetsTitles();
		this.controller.facets.each(function(facet){
			facet.cropSelectedContent();
            facet.addSimpleAccessibility(this.options.facetsAccessibilitySelector); //NOTE: need to add after disabled states set
		}.bind(this));
		if (this.controller.moreFacet) {
			this.controller.moreFacet.cropSelectedContent();
            this.controller.moreFacet.addSimpleAccessibility(this.options.facetsAccessibilitySelector);
		}

        this.controller.addEvent('selectionChanged', function(e) {
            this.fireEvent('selectionChanged', e);
        }.bind(this));
    },

    _cropFacetsTitles: function() {
        var self = this;
        var placeholder = this.options.placeholderEl;
        placeholder.getElements('.js_facet_trigger a').each(function(el) {
            el.setAttribute('hideFocus', true);
            self._cropFacetTitle(el);
        });

        placeholder.getElements('.js_facet_target').each(function(el) {
            el.show();

            var title = el.getElement('.js_facet_options_header a');
            self._cropFacetTitle(title);

            el.hide();
        });

        (placeholder.getElements('a.js_clear_all_button')||document.getElement('.res_page .js_clear_all_button')).each(function(el) {
            el.setAttribute('hideFocus', true);
        });
    },

    _cropFacetTitle: function(facetTitle) {
        var label = facetTitle.get('text');
        facetTitle.set('text', '.');
        var height = facetTitle.getHeight();
		
        cropTextByHeight(label, facetTitle, facetTitle, height+Math.floor(height/2));

    },

    update: function(data) {
		if (this.controller) {
			this.controller.updateCount(data.count);
			this.controller.updateTitle(data.title);
		}

        var facets = this.options.facetsDataAdapter.adapt(data.facets);
        this._update(facets, this.updateStrategy);
    },

    _update: function(facets, disableEnableStrategy) {
        if (this.controller) {
			var options = disableEnableStrategy.process(facets);
			this.controller.disableOptions(options.toDisable);
			this.controller.enableOptions(options.toEnable);
		}
    },

    dispose: function() {
        var facetesList = this.options.placeholderEl.getElement('.js_faceted_navigation');
        if( facetesList != null )
    		facetesList.dispose();
    },

    hide: function() {
        this.options.placeholderEl.addClass("hidden");
    },

    show: function() {
        this.options.placeholderEl.removeClass("hidden");
    }

});

var FacetedNavigationController = new Class({
    Implements: [Events],

    facets: [],
    moreFacet: null,
    facetsOptions: [],

    initialize: function (root, labels, facetWidthSettingStrategy,aboveHeight) {
        this.root = root;

        root.getElements(".js_facet").each(function(el) {
            var facet = new Facet(el, labels, facetWidthSettingStrategy,aboveHeight);
            facet.addEvent('selectionChanged', function(e) {
			    var anySimpleFacetSelected = this._isAnySimpleFacetOptionSelected();
                this._updateClearButtonState(e.isAll && !anySimpleFacetSelected);
                this._notifyAboutChangedSelection();
            }.bind(this));
            this.facets.push(facet);
            this.facetsOptions.push(facet.facetOptions);
        }.bind(this));


        var clearAllInitState = false;

        var popupManager = new hp.PopupManager();
        this.facets.each(function(facet) {
            popupManager.add(facet);

           if(facet.facetOptions.isAllState)
                clearAllInitState = true;
        });

        var moreFacetEl = root.getElement(".js_more_facet");
        if (moreFacetEl) {
            this.moreFacet = new MoreFacet(moreFacetEl, labels, aboveHeight);
            this.moreFacet.addEvent('selectionChanged', function(e) {
                var anySimpleFacetSelected = this._isAnySimpleFacetOptionSelected();

                this._updateClearButtonState(e.isAll && !anySimpleFacetSelected);
                this._notifyAboutChangedSelection();
            }.bind(this));

            this.moreFacet.facetOptions.each(function(options) {
                if(options.isAllState)
                    clearAllInitState = true;
            });

            this.facetsOptions.combine(this.moreFacet.facetOptions);
            popupManager.add(this.moreFacet);
        }


        var navigationWidth = root.getSize().x;
        facetWidthSettingStrategy.setFacetWidths(navigationWidth, this.facets, this.moreFacet);

        this.clearAllInitState = clearAllInitState;
        this.clearAllButton = this._initClearButton();
    },

    _isAnySimpleFacetOptionSelected: function() {
        var result = false;
        this.facets.each(function(facet) {
            var options = facet._getSelectedOptions();
            result = result || (options.length != 0);
        });
        return result;
    },

    _notifyAboutChangedSelection: function() {
        var selectedOptions = [];
        this.facets.each(function(facet) {
            var options = facet.getSelectedOptions();
            if (options[1].length != 0) {
                selectedOptions.push(options);
            }
        });

        if (this.moreFacet) {
            var moreOptions = this.moreFacet.getSelectedOptions();
            moreOptions.each(function(options) {
                if (options[1].length != 0) {
                    selectedOptions.push(options);
                }
            });
        }
        this.fireEvent('selectionChanged', {data: selectedOptions});
    },

    _updateClearButtonState: function(disable) {
        if (disable) {
            this.clearAllButton.addClass('disabled');
        } else {
            this.clearAllButton.removeClass('disabled');
        }
    },

    _initClearButton: function() {
        var button = this.root.getElement('.js_clear_all_button')||document.getElement('.res_page .js_clear_all_button');
        if(!this.clearAllInitState)
            button.addClass('disabled');

        button.addEvent('click', function() {
            if (!button.hasClass('disabled')) {
                button.addClass('disabled');
                if (this.moreFacet) {
                    this.moreFacet.reset();
                }
                this.facets.each(function(facet) {
                    facet.reset();
                }.bind(this));
                this._updateClearButtonState(true);
                this._notifyAboutChangedSelection();
            }
        }.bind(this));

        return button;
    },

    updateCount: function(count) {
		var el = this.root.getElement('.js_results_count');
        if (el) {
			el.set('text', count);
		}
    },

    updateTitle: function(count) {
        var el = this.root.getElement('.js_title') || document.getElement('.res_page .js_title');
		if (el) {
			el.set('text', count);
		}
    },

    disableOptions: function(options) {
        options.each(function(option) {
			var el = $(option);
			if (el) {
				this._disableOption(el.getParent());
			}
        }.bind(this));
    },

    enableOptions: function(options) {
        options.each(function(option) {
			var el = $(option);
			if (el) {
				this._enableOption(el.getParent());
			}
        }.bind(this));
    },

    _disableOption: function(option) {
       // option.disabled = true;         //NOTE: occure to bug in ie (drop shadow 6031QC)
        option.addClass('disabled');

    },

    _enableOption: function(option) {
        option.disabled = false;
        option.removeClass('disabled');
    }

});

var AbstractFacet = new Class({
    Extends: CHKCustomPopUp,
    Implements: [Events, hp.PopupAccessibility],
	isWidthInit: false,

    initialize: function (facet, labels) {
        this.facet = facet;
        this.labels = labels;

        var trigger = facet.getElement('.js_facet_trigger');
        var target = facet.getElement('.js_facet_target');

        this.parent(trigger, target, {
            showEvent : ['click'],
            hideEvent : []
        });

        this.addHideElement(target, 'mouseleave');

        // fix ie7's z-index problem
        var bodyEl = document.getElements('.body'); /* QC9363 -  footer is overlap facet dropdown in IE 7*/


        this.addEvent('onshow', function() {
            if (isIE7 || isIE6) {
                trigger.setStyle('display', 'none');
            }
            if(isIE7 && bodyEl.length > 0){    /* QC9363*/
                bodyEl[0].setStyle("z-index", 10000);
            }
            facet.setStyle('z-index', 4);
        });
        this.addEvent('onhide', function() {
            if (isIE7 || isIE6) {
                trigger.setStyle('display', 'block');
            }
            if(isIE7 && bodyEl.length > 0){    /* QC9363*/
                bodyEl[0].setStyle("z-index", 0);
            }
            facet.setStyle('z-index', 3);
        });

        this._initOptions();

    },

    setWidth: function(width) {
		if (!isNaN(width)) {
			this.facet.setStyle('width', width + 'px'); //Single element width
			this.isWidthInit = true;
		}
    },

    setAboveHeight: function(aboveHeight) {
        this.targetEl.setStyle('top','-'+aboveHeight+'px');
    },

    _createOptions: function(optionsEl, facetName) {
        var options = new FacetOptions(optionsEl, this.labels, facetName);
        options.addEvent('selectionChanged', function() {
            this._updateState();
        }.bind(this));
        return options;
    },

    _updateState: function() {
        this._updateStateSilently();

        this.fireEvent('selectionChanged', {isAll: this.isAll});
    },

    _updateStateSilently: function() {
        var selectedOptions = this._getSelectedOptions();
        var numberOfSelectedOptions = selectedOptions.length;
        this.isAll = (numberOfSelectedOptions == 0);

		if (this.isWidthInit) {
			this.cropSelectedContent();
		}

        if (typeof this._updateSpecificState == 'function') {
            this._updateSpecificState();
        }
    },

    _withoutAllOption: function(options) {
        if (options.length == 1 && options[0].isAll) return [];
        return options;
    },

	cropSelectedContent: function() {

        var selectedOptions = this._getSelectedOptions();
        var numberOfSelectedOptions = selectedOptions.length;
        this.isAll = (numberOfSelectedOptions == 0);
        var label;
        if (this.isAll) {
            label = this.labels.allOption;
        } else if (numberOfSelectedOptions == 1) {
            var selectedOption = selectedOptions[0];
            label = this._getLabel(selectedOption);
        } else if (numberOfSelectedOptions > 1) {
            label = (numberOfSelectedOptions + ' ' + this.labels.selected);
        } else {
            throw "incorrect number of selected options: " + numberOfSelectedOptions;
        }

	    var selectedContentLabel = this.facet.getElement(".js_selected_content");
        selectedContentLabel.set('text', '.');
		var height = selectedContentLabel.getHeight();
        cropTextByHeight(label, selectedContentLabel, selectedContentLabel, height+Math.floor(height/2));
	}

});

var MoreFacet = new Class({
    Extends: AbstractFacet,

    facetOptions: [],
    DEFAULT_FACET_WIDTH: 176,

    initialize: function (facet, labels,aboveHeight) {
        this.parent(facet, labels);

        var _this = this;
        this._getClearButton().addEvent('click', function(e) {
            e.stopPropagation();
            if (!this.hasClass('disabled')) {
                _this.reset();
                _this.fireEvent('selectionChanged', {isAll: true});
            }
        });

        var target = this.targetEl;

        this.addHideElement(target.getElement('.more_facet_header'), 'click');

        target.setStyle('width', this.DEFAULT_FACET_WIDTH * this.facetOptions.length + 'px');

        this.setAboveHeight(aboveHeight);

    },

    reset: function() {
        this._clearOptions();
        this._updateStateSilently();
    },

    _initOptions: function() {
        var facetsContainer = this.facet.getElement('.js_facets');
        var facetTitles = facetsContainer.getElements('.js_facet_title');

        facetTitles.each(function(el) {
            el.getParent('th').setStyle('width', this.DEFAULT_FACET_WIDTH + 'px');
            var facetName = el.id.replace('js_facet_', '');
            var options = this._createOptions(facetsContainer, facetName);
            this.facetOptions.push(options);
        }.bind(this));
        this._updateState();
    },

    _clearOptions: function() {
        this.facetOptions.each(function(options) {
            options.clear();
        }.bind(this));
    },

    _updateSpecificState: function() {
        this._setClearButtonEnabled(!this.isAll);
    },

    _setClearButtonEnabled: function(enabled) {
        var clearButton = this._getClearButton();
        if (enabled) {
            clearButton.removeClass("disabled");
        } else {
            clearButton.addClass("disabled");
        }
    },

    _getClearButton: function() {
        return this.facet.getElement('.js_more_facet_clear_button');
    },

    _getSelectedOptions: function() {
        var result = [];
        this.facetOptions.each(function(options) {
            var selectedOptions = options.getSelectedOptions();
            result.combine(this._withoutAllOption(selectedOptions));
        }.bind(this));
        return result;
    },

    getSelectedOptions: function() {
        var result = [];
        this.facetOptions.each(function(options) {
            var selectedOptions = options.getSelectedOptions();
            var name = options.facetName;
            result.push([name, this._withoutAllOption(selectedOptions).map(function(el) {
                return el.getElement('input').value;
            })]);
        }.bind(this));
        return result;
    },

    _getLabel: function(option) {
        return option.title + ': ' + option.get('text').trim();
    }

});

var Facet = new Class({
    Extends: AbstractFacet,

    initialize: function (facet, labels, facetWidthSettingStrategy,aboveHeight) {
        this.parent(facet, labels);
        this.facetWidthSettingStrategy = facetWidthSettingStrategy;
        this.addHideElement(this.targetEl.getElement('.js_facet_options_header'), 'click');
        this.setAboveHeight(aboveHeight);
    },

    _initOptions: function() {
        var header = this.targetEl.getElement('.js_facet_title');
        var facetName = header.id.replace('js_facet_', '');
        this.facetOptions = this._createOptions(this._getFacetOptionsElement(), facetName);
        this._updateState();
    },

    _getSelectedOptions: function() {
        return this._withoutAllOption(this.facetOptions.getSelectedOptions());
    },

    getSelectedOptions: function() {
        var selected = this._getSelectedOptions();

        var name = this.facetOptions.facetName;

        return [name, selected.map(function(el) {
            return el.getElement('input').value;
        })];
    },

    setWidth: function(width) {
        this.parent(width);

        var columnsNumber = this._getNumberOfColumns();
        if (columnsNumber == 2) {
            this._doublePopupWidth(width);
        } else {
            this._widenPopupToFitContent(width);
        }
    },

    _widenPopupToFitContent : function(width) {
        var optionsEl = this._getFacetOptionsElement();
        var idealRowHeight = this._getIdealRowHeight(optionsEl);//40;

        var row = this._getRowWithTheLongestOptionTitle(optionsEl);

        function getRowHeight() {
            optionsEl.show();
            var size = row.getSize();
            var height = size.y;
            optionsEl.hide();
            return height;
        }

        function getTableWidth() {
            optionsEl.show();
            var size = optionsEl.getElement('.values').getSize();
            var width = size.x;
            optionsEl.hide();
            return width;
        }

        var calculatedWidth = width;
        var maxWidth = width * 2;
        if (getRowHeight() > idealRowHeight) {
            while (calculatedWidth < maxWidth) {
                calculatedWidth++;
                this.facetWidthSettingStrategy.setWidthForSingleShownFacet(optionsEl, calculatedWidth);
                if (getRowHeight() <= idealRowHeight) {
                    break;
                }
            }
        } else {
			var optionsWidth = getTableWidth();
			if (calculatedWidth < optionsWidth) {
				calculatedWidth = optionsWidth;
				this.facetWidthSettingStrategy.setWidthForSingleShownFacet(optionsEl, calculatedWidth);
			}
		}
    },

    _getIdealRowHeight : function(optionsEl){
        optionsEl.show();
        var row = optionsEl.getElements('tr')[1];  //get the 2nd row, because the 1st row doesn't have border-top
        var labelEl = row.getElement('label');
        var realValue = labelEl.get('text');
        labelEl.set("text", "A");
        var idealRowHeight = row.getSize().y;
        labelEl.set("text",realValue);
        optionsEl.hide();
        return idealRowHeight;
    },

    _getRowWithTheLongestOptionTitle : function (optionsEl) {
        var rows = optionsEl.getElements('tr');
        var neededRow = rows[0];
        var neededOptionValue = "";
        rows.each(function(row) {
            var optionValue = row.getElement('label').get('text');
            if (optionValue.length > neededOptionValue.length) {
                neededRow = row;
                neededOptionValue = optionValue;
            }
        });
        return neededRow;
    },

    _doublePopupWidth : function(width) {
        this.facetWidthSettingStrategy.setWidthForSingleShownFacet(this._getFacetOptionsElement(), width * 2 + 1);
    },

    _getFacetOptionsElement : function() {
        return this.facet.getElement(".js_facet_options");
    },

    _getNumberOfColumns : function () {
        var table = this.facet.getElement('table');
        var firstRow = table.getElements('tr')[0];
        var singleColumn = firstRow.getElement('td');
        var columnsNumber = singleColumn.get('colspan');
        return columnsNumber;
    },

    _getLabel: function(option) {
        return option.get('text').trim();
    },

    reset: function() {
        this.facetOptions.clear();
        this._updateStateSilently();
    }

});

var FacetOptions = new Class({
    Implements:Events,

    labels: null,

    initialize: function(facetOptions, labels, facetName) {
        this.options = facetOptions;
        this.labels = labels;
        this.facetName = facetName;
        this.isAllState = true;

        this.facetTitleSelector = facetName ? '.js_' + facetName : '.js_facet_title';
        this.facetOptionsSelector = facetName ? '.js_facet_option_' + facetName : '.js_facet_option';

        var title = this.options.getElement(this.facetTitleSelector).get('text').trim();

        var items = this._getOptions();
        items.each(function (item) {
            item.isAll = (item.getElement('input').value == 'all');
            item.title = title;

            item.addEvent("valueChange", (item.isAll ? this._allItemSelectionHandler : this._changeEventHandler).bind(this));
        }.bind(this));

        this._initItems(items);
    },

    clear: function() {
        this._setAllCheckboxValue(true);
        this._clearSimpleOptions();
    },

    getSelectedOptions: function () {
        return this.options.getElements(this.facetOptionsSelector + ".selected");
    },

    _initItems: function (items) {
        this.isAllState = true;
        var allItem;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.isAll) {
                allItem = item;
                var checked = item.getElement("input").checked;
                if(checked)
                    this.isAllState = false;
            } else {
                this._initItem(item);
            }
        }
        if (allItem) {
            this._initItem(allItem);
        }


    },

    /**
     * This function will be used as detached, it is mean this will pointed to window.
     * It is initialize general list item: add event handlers, ...
     *
     * @private
     * @param {Element} item - mootools element object
     * */
    _initItem: function (item) {
        item.disabled = false;
        var checkbox = item.getElement("input");
        if (checkbox.checked) {
            item.addClass("selected");
        }

        var _this = this;
        item.addEvents({
            mouseover: function (e) {
                this.addClass("hover")
            },
            mouseout: function (e) {
                this.removeClass("hover")
            },

            click: function (e) {
                e.stop();
                if (item.hasClass('disabled')) {
                    return;
                }
                var checked = checkbox.checked;

                if (item.isAll && checked) {
                    return;
                }

                if (_this._setCheckboxValue(item, checkbox, !checked)) {
                    item.fireEvent("valueChange", {selected: !checked, text: item.get("text").trim()});
                }
            }
        });
    },

    /**
     * @private
     * */
    _changeEventHandler: function (e) {
        if (e.selected) {
            this._setAllCheckboxValue(false);
        }

        var selectedItems = this.getSelectedOptions();
        if (selectedItems.length == 0) {
            this._setAllCheckboxValue(true);
        }

        this._fireSelectionChangedEvent();
    },

    _allItemSelectionHandler: function (e) {
        if (!e.selected) {
            return false;
        }

        this._clearSimpleOptions();

        this._fireSelectionChangedEvent();
    },

    _clearSimpleOptions: function() {
        var items = this.getSelectedOptions();
        items.each(function(item) {
            if (!item.isAll) {
                this._setCheckboxValue(item, item.getElement('input'), false);
            }
        }.bind(this));
    },

    _fireSelectionChangedEvent: function () {
        this.fireEvent("selectionChanged");
    },

    _setAllCheckboxValue: function (checked) {
        var allItem;
        this._getOptions().each(function (item) {
            if (item.isAll) {
                allItem = item;
            }
        }.bind(this));

        if (allItem) {
            var checkbox = allItem.getElement('input');
            this._setCheckboxValue(allItem, checkbox, checked);
        }
    },

    _setCheckboxValue : function (item, checkbox, checked) {
        if (checkbox.checked == checked) {
            return false;
        }
        checkbox.checked = checked;
        item.toggleClass("selected");

        return true;
    },

    _getOptions: function() {
        return this.options.getElements(this.facetOptionsSelector);
    }

});

var FacetedNavigationRenderer = new Class({

    initialize : function(labels, moreThreshold) {
        this.labels = labels;

        this.containerTemplate = Handlebars.compile($('faceted-nav-container').innerHTML);
        var facetItemTemplate = Handlebars.compile($('facet-item').innerHTML);
        var facetTemplate = Handlebars.compile($('facet').innerHTML);
        var moreFacetTemplate = Handlebars.compile($('more-facet').innerHTML);

        Handlebars.registerHelper('facetItem', function(context) {
            return facetItemTemplate(context);
        });

        Handlebars.registerHelper('facet', function() {
            return facetTemplate(this);
        });

        Handlebars.registerHelper('eachOption', function(options, columns, block) {
            var result = "";
            var numberOfOptions = options.length;
            var isOneColumn = (columns == 1);

            for (var i = 0; i < numberOfOptions; i += columns) {
                var context = {isOneColumn: isOneColumn};
                if (isOneColumn) {
                    context.option = options[i];
                } else {
                    context.first = options[i];
                    if (i + 1 < numberOfOptions) {
                        context.second = options[i + 1];
                    }
                    context.needEmptyCell = (numberOfOptions % 2 == 1) && (i + 1 == numberOfOptions);
                }
                result = result + block(context);
            }

            return result;
        });

        Handlebars.registerHelper('forEach', function(collection, block) {
            var result = '';
            var size = collection.length;
            for (var i = 0; i < size; i++) {
                var status = { last: (i == size - 1) };
                var element = collection[i];
                element.status = status;
                result = result + block(element);
            }
            return result;
        });

        Handlebars.registerHelper('forEachIndex', function(start, end, block) {
            var result = '';
            for (var i = 0; i < end; i++) {
                result = result + block({ index: i });
            }
            return result;
        });

        Handlebars.registerHelper('forEachIndexedOption', function(facets, index, block) {
            var result = '';
            var size = facets.length;
            for (var i = 0; i < size; i++) {
                result = result + block({ option: facets[i].options[index], status : {last: (i == size - 1) }});
            }
            return result;
        });

        var _labels = this.labels;
        Handlebars.registerHelper('facetedNavigation', function(facets) {
            var numberOfFacets = facets.length;

            function renderSimpleFacets(facetsToRender) {
                var result = '';
                var size = facetsToRender.length;
                for (var i = 0; i < size; i++) {
                    result = result + facetTemplate(facetsToRender[i]);
                }
                return result;
            }

            if (numberOfFacets <= moreThreshold) {
                return renderSimpleFacets(facets);
            } else {
                var numberOfSimpleFacets = moreThreshold - 1; // formerly set to "2" but changed to "1" because UX wanted 4 facets  
				                                              // instead of diaplaying just 3
                var simpleFacets = facets.slice(0, numberOfSimpleFacets);
                var facetsInMore = facets.slice(numberOfSimpleFacets);

                var maxOptionsCount = 0;
                var size = facetsInMore.length;
                for (var i = 0; i < size; i++) {
                    var facet = facetsInMore[i];
                    var optionsCount = facet.options.length;
                    if (optionsCount > maxOptionsCount) {
                        maxOptionsCount = optionsCount;
                    }
                }

                return renderSimpleFacets(simpleFacets) + moreFacetTemplate({facets: facetsInMore, maxOptionsCount: maxOptionsCount, labels: _labels, width: facet.width});
            }
        });
    },

    render : function(data) {
        data.labels = this.labels;
        return this.containerTemplate(data);
    }

});

function initFacetedNav(data, options) {
    var disabled = false;

    function disableEnableOptions() {
        disabled = !disabled;
        data.count = disabled ? 5 : 419;
        var facets = data.facets;
        for (var i = 0; i < facets.length; i++) {
            var facet = facets[i];
            var options = facet[3];
            for (var j = 0; j < options.length; j++) {
                var option = options[j];
                var id = option[0];
                if (id == 'isv' || id == 'nvidia' || id == 'amd' || id == '1000x800') {
                    option[2] = disabled;
                }
            }
        }
    }

    var labels = {clear_all: "Clear all", more: "More", clear: "Clear all", allOption: 'All', selected: 'selected'};

    var facetedNav = new FacetedNavigation(labels, [], options);
    facetedNav.create(data.title, data);

    facetedNav.addEvent('selectionChanged', function(e) {
        disableEnableOptions();
        facetedNav.update(data);
    });
    return facetedNav;
}