var DefaultFacetsDataAdapter = new Class({

    adapt: function(facets, maxFacetsCount, facetValuesThreshold, lastSelectedFacet) {
        var result = [];
        var size = facets.length;
        if(maxFacetsCount && maxFacetsCount <= facets.length) {
            size = maxFacetsCount;
        }

        for (var i = 0; i < size; i++) {
            var facet = facets[i];
//            if(typeof lastSelectedFacet != "undefined" && facet[0] == lastSelectedFacet.facetName && !facet[4]) {
//                facet[3] = this.forceEnableFacetOptions(lastSelectedFacet)
//            }
            result.push(this.adaptFacet(facet, facetValuesThreshold));
        }
        return result;
    },

    forceEnableFacetOptions: function(facet) {
        var options = $$(facet.facetOptionsSelector);
        var preparedOptions = [];
        options.each(function(option){
            var optionName = option.getElement("input").get("value").trim();
            if(optionName != "all") {
                var preparedOption = [
                    optionName,
                    option.get("text").trim(),
                    option.hasClass("disabled"),
                    false
                ];

                preparedOptions.push(preparedOption);
            }
        });

        return preparedOptions;
    },

    adaptFacet: function(data, facetValuesThreshold) {
        var type;
        var optionsData = data[3];
        var isRadio = !data[4];

        var facet = {};
        var name = data[0];

        if(!isRadio) {
            type = "checkbox";
        } else {
            type = "radio";
        }

        facet.hasMore = false;
        if(optionsData.length > facetValuesThreshold) {
            facet.hasMore = true;
        }

        facet.isRadio = isRadio;
        facet.name = name;
        facet.caption = data[1];

        if(isRadio) {
            facet.allOption = {caption: data[2], value: 'all', name: name, checked: true, id: name + '_all', isRadio: isRadio};
        }

        facet.type = type;

        var size = optionsData.length;

        var options = [];
        for (var i = 0; i < size; i++) {
            var optionData = optionsData[i];
            var value = optionData[0];
            var id = name + '_' + this._sanitize(value);
            var checked = optionData[3];
            var hidden = false;

            if(i >= facetValuesThreshold) {
                hidden = true;
            }

            options.push({caption: optionData[1], value: value, name: name, disabled: optionData[2], id: id, checked: checked, isRadio: isRadio, hidden: hidden});
            if (checked && isRadio) {
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
        createStrategyClass: DisableInactiveEnableActiveStrategy,
        updateStrategyClass: DisableAllEnableActiveStrategy,
		hideResultsCount: false,
        categoryFacetsLimit: false,
        facetValuesThreshold: 5,
        useTree: false,
        treeOptions: {
            treeObject: null,
            placeHolderClassName: "js_cn_facets_holder"
        }
    },

    selections: [],
    currentCategoryLabel: null,

    /**
     *
     * @constructs
     * @param {Object} labels localized labels
     * @param {Array} modifiers used to customize presentation of the navigation
     * @param {Object} options define common configuration
     */
    initialize: function(labels, modifiers, options) {
        this.labels = labels;
        this.setOptions(options);
        this.modifiers = modifiers;
        this.renderer = new FacetedNavigationRenderer();
    },

    create: function(title, data) {
        var placeholder;
        var savedSelections = false;

        if(this.options.useTree) {
            placeholder = this.prepareTreePlaceholder(facetedNavigation);
            savedSelections = this.saveCurrentFacetsData(data.facets);
        } else {
            placeholder = this.options.placeholderEl;
            savedSelections = data.facets;
        }

        var facets = this.options.facetsDataAdapter.adapt(savedSelections, this.options.categoryFacetsLimit, this.options.facetValuesThreshold);

        if(facets.length == 0) {
            placeholder.dispose();
            return;
        }

        var facetedNavigation = this.renderer.render({ title: title, count: data.count, facets: facets, hideResultsCount: this.options.hideResultsCount });

        placeholder.set('html', facetedNavigation);

        var root = placeholder.getChildren()[0];
        this.modifiers.each(function(modifier) {
            root.addClass('faceted_navigation_' + modifier);
        });
        if( data.facets.length === 0 )
        	return;

        this.controller = new FacetedNavigationController(root, this.labels, savedSelections);
        this._update(facets, new this.options.createStrategyClass(this.controller));

        this.updateStrategy = new this.options.updateStrategyClass(this.controller);

        this.controller.addEvent('selectionChanged', function(e) {
            this.fireEvent('selectionChanged', e);
            this.lastSelectedFacet = e.initiatorFacet;
        }.bind(this));

		this.updateSelections();
		this.controller.openActiveItems();

    },

    getSavedSelectionsForCategory: function() {
		return this.selections[this.currentCategoryLabel] || false;
    },

    getFacetsDataForSelectedCategory: function(category, facetsData) {
        var returnValue = false;
        var selectedFacets = [];
        var facets = facetsData || this.selections[category];
		if (facets) {
			for(var i = 0; i < facets.length; i++){
				var facetOptions = facets[i][3];
				for(var k = 0; k < facetOptions.length; k++) {
					var option = facetOptions[k];
					if(option[3]) {
						selectedFacets.push(option[0]);
					}
				}
			}
		}

        if(selectedFacets.length > 0) {
            returnValue = selectedFacets.join('|');
        }

        return returnValue;
    },

    saveCurrentFacetsData:  function(facetsData) {
		var savedFacets = this.selections[this.currentCategoryLabel];
		if (!savedFacets ||
			(this.getFacetsDataForSelectedCategory(this.currentCategoryLabel, savedFacets)!=this.getFacetsDataForSelectedCategory(this.currentCategoryLabel, facetsData))) {

			this.selections[this.currentCategoryLabel] = savedFacets = facetsData;
		}

		return savedFacets || facetsData;
    },

    updateSelections: function() {
		var categorySelection = this.selections[this.currentCategoryLabel];
		if (categorySelection) {
			this.updateCategorySelections(categorySelection);
		}
    },

    updateCategorySelections: function(categorySelections) {
        for (var i = 0; i < categorySelections.length; i++) {
            categorySelections[i][5] = !this.controller.facets[i].isAll;
            var facetSelectionName = categorySelections[i][0];
            var facetSelectionData = categorySelections[i][3];
            for (var j = 0; j < this.controller.facets.length; j++) {
                if (this.controller.facets[j].facetOptions.facetName == facetSelectionName) {
                    facetSelectionData = this.updateFacetSelection(facetSelectionData, this.controller.facets[j].facetOptions.options);
                    categorySelections[i][3] = facetSelectionData;
                    break;
                }
            }
        }

        return categorySelections;
    },

    updateFacetSelection: function(facetSelectionData, facetOptions) {

        for(var i = 0; i < facetSelectionData.length; i++) {
            facetOptions.getElements(".facet_option").each(function(optionEl) {
                if(optionEl.getElement("input").get("value") == facetSelectionData[i][0]) {
                    facetSelectionData[i][3] = optionEl.hasClass("selected");
                    facetSelectionData[i][2] = optionEl.hasClass("disabled");
                }
            });
        }

        return facetSelectionData;
    },

    removeSelections: function() {
        this.currentCategoryLabel = null;
        this.selections = [];
    },

    prepareTreePlaceholder: function(facetedNavigation) {

        var selectedCategoryEl = this.options.treeOptions.treeObject.getSelectedTrigger();

        this.previousCategoryLabel = this.currentCategoryLabel;
        this.currentCategoryLabel = selectedCategoryEl.getParent().get("rel");

        var placeholder = new Element("div");
        placeholder.addClass(this.options.treeOptions.placeHolderClassName);
        placeholder.addClass("temp_faceted_navigation");
        placeholder.inject(document.body);
        placeholder.set("html", facetedNavigation);
        this.options.treeOptions.treeObject.prepareFacetsPlaceholder(placeholder.getScrollSize().y);
        placeholder = placeholder.dispose();
        placeholder.inject(selectedCategoryEl, "after");
        placeholder.removeClass("temp_faceted_navigation");

        return placeholder;
    },

    update: function(data) {
        var facets = this.options.facetsDataAdapter.adapt(data.facets, this.options.categoryFacetsLimit, this.facetValuesThreshold, this.lastSelectedFacet);
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
        if(this.options.useTree) {
            var placeholderEl = $$("." + this.options.treeOptions.placeHolderClassName)[0];
            if(typeof placeholderEl != "undefined") {
                this.updateSelections();
                $$("." + this.options.treeOptions.placeHolderClassName).dispose();
            }
        } else {
            var facetesList = this.options.placeholderEl.getElement('.js_faceted_navigation');
            if( facetesList != null ) {
                facetesList.dispose();
            }
        }
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
    facetsOptions: [],
    accordions: [],
    savedSelections: false,

    initialize: function (root, labels, savedSelections) {
        this.savedSelections = savedSelections;
        this.root = root;
        triggers = [];
        targets = [];
        root.getElements(".js_facet").each(function(el) {
            var facet = new Facet(el, labels);
            facet.addEvent('selectionChanged', function(e) {
			    var anySimpleFacetSelected = this._isAnySimpleFacetOptionSelected();
                this._notifyAboutChangedSelection(facet.facetOptions);
            }.bind(this));
            this.facets.push(facet);
            this.facetsOptions.push(facet.facetOptions);
            triggers.push(facet.triggerEl);
            targets.push(facet.targetEl.getParent(".js_facet_slider"));
        }.bind(this));

        if (triggers.length > 0) {
            this.initAccordion(root, triggers, targets, {});
        }

        var clearAllInitState = false;

        var popupManager = new PopupManager();
        this.facets.each(function(facet) {
            popupManager.add(facet);

           if(facet.facetOptions.isAllState)
                clearAllInitState = true;
        });

        this.clearAllInitState = clearAllInitState;
    },

    _isAnySimpleFacetOptionSelected: function() {
        var result = false;
        this.facets.each(function(facet) {
            var options = facet._getSelectedOptions();
            result = result || (options.length != 0);
        });
        return result;
    },

    _notifyAboutChangedSelection: function(initiatorFacet) {
        var selectedOptions = [];
        this.facets.each(function(facet) {
            var options = facet.getSelectedOptions();
            if (options[1].length != 0) {
                selectedOptions.push(options);
            }
        });

        this.fireEvent('selectionChanged', {data: selectedOptions, initiatorFacet: initiatorFacet});
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
    },

    initAccordion:function (root, triggers, targets, options) {
        targets.each(function(target, i) {
            this.accordions.push(new Fx.Tween(target, {property: 'height', duration:300,
                onComplete:function() {
                    if (!this.isOpen(triggers[i])) {
                        target.hide();
                    }else{
                        target.setStyle('height',null);
                    }
                }.bind(this)
            }));
            this.facets[i].popupHeight = this.popupHeight(target);
            target.setStyles({display:"none", height : 0});
        }.bind(this));

        triggers.each(function(trigger, i) {
            trigger.addEvent("click", function() {
                this.toggleSlide(trigger, i);
            }.bind(this));
        }.bind(this));
    },
    toggleSlide:function(trigger, i) {
        var itemEffect = this.accordions[i];
        if (this.isOpen(trigger)) {
            itemEffect.start(this.facets[i].popupHeight, 0);
            trigger.getFirst("a").removeClass("active");

        } else {
            targets[i].show();
            itemEffect.start(0, this.facets[i].popupHeight);
            trigger.getFirst("a").addClass("active");
        }
    },
    popupHeight: function (content) {
        content.show();
        var res = content.getScrollHeight();
        return  res <= 0 ? 0 : res;

    },
    isOpen:function(trigger) {
        return trigger.getFirst("a").hasClass("active");
	},
	openActiveItems: function() {
        var isSliderInitialized = false;

        for (var i = 0; i < this.savedSelections.length; i++) {
            if (this.savedSelections[i][5]) {
                this.toggleSlide(triggers[i], i);
                isSliderInitialized = true;
            }
        }

        if (!isSliderInitialized) {
            this.toggleSlide(triggers[0], 0);
        }
	}
});

var AbstractFacet = new Class({
    Implements: [Events, PopupAccessibility],
	isWidthInit: false,

    initialize: function (facet, labels) {
        this.facet = facet;
        this.labels = labels;

        this.triggerEl = facet.getElement('.js_facet_trigger');
        this.targetEl = facet.getElement('.js_facet_target');
        this.hasMore = (facet.getElement('.js_more') != null);

        this._initOptions();

        if(this.hasMore) {
            this.moreButton = facet.getElement('.js_more');
            this.lessButton = facet.getElement('.js_less');
            this.initMoreButtons();
        }
    },

    initMoreButtons: function() {
        this.setLabel(this.moreButton.getElement(".js_more_less_label"), this.labels.showMore);
        this.setLabel(this.lessButton.getElement(".js_more_less_label"), this.labels.showLess);

        this.moreButton.addEvent("click", function() {
            this.toggleHiddenOptions($$(this.facetOptions.facetOptionsSelector));
        }.bind(this));

        this.lessButton.addEvent("click", function() {
            this.toggleHiddenOptions($$(this.facetOptions.facetOptionsSelector));
        }.bind(this));
    },

    setLabel: function(el, label) {
        el.set("text", label);
    },

    toggleHiddenOptions: function(options) {
        options.each(function(optionEl) {
            if(optionEl.hasClass("js_hidden_option")) {
                if(optionEl.hasClass("hidden")) {
                    optionEl.removeClass("hidden");
                } else {
                    optionEl.addClass("hidden");
                }
            }
        }.bind(this));

        if(this.moreButton.hasClass("hidden")){
            this.lessButton.addClass("hidden");
            this.moreButton.removeClass("hidden");
        } else {
            this.moreButton.addClass("hidden");
            this.lessButton.removeClass("hidden");
        }
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
    }

});


var Facet = new Class({
    Extends: AbstractFacet,

    initialize: function (facet, labels) {
        this.parent(facet, labels);
    },

    _initOptions: function() {
        var facetName = this.targetEl.id.replace('js_facet_', '');
        this.facetOptions = this._createOptions(this._getFacetOptionsElement(), facetName);
        this._updateState();
        this._addAccessibility();
    },

    _addAccessibility: function () {
        var optionsForAccessibility = this.facetOptions._getOptions();
        var firstLink = optionsForAccessibility[0].getElement("a");
        var lastLink = optionsForAccessibility[optionsForAccessibility.length - 1].getElement("a");
        this.addAccessibility(firstLink, lastLink);
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

    _getFacetOptionsElement : function() {
        return this.facet.getElement(".js_facet_options");
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
            item.isRadio = (item.getElement('.radio') != null);
            item.title = title;

            item.addEvent("valueChange", function(e) {
                if(item.isAll) {
                    this._allItemSelectionHandler(e);
                } else if(item.isRadio){
                    this._radioItemSelectionHandler(e, item);
                } else {
                    this._changeEventHandler(e);
                }

            }.bind(this));
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
                if (item.hasClass('disabled') || (item.isRadio && checkbox.checked)) {
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

    _radioItemSelectionHandler: function (e, item) {
        if (!e.selected) {
            return false;
        }

        this._clearRadioOptions();
        this._setCheckboxValue(item, item.getElement('input'), true);
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

    _clearRadioOptions: function() {
        var items = this.getSelectedOptions();
        items.each(function(item) {
            this._setCheckboxValue(item, item.getElement('input'), false);
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

        if(checked) {
            item.addClass("selected");
        } else {
            item.removeClass("selected");
        }

        return true;
    },

    _getOptions: function() {
        return this.options.getElements(this.facetOptionsSelector);
    }

});

var FacetedNavigationRenderer = new Class({

    initialize : function(labels) {
        this.labels = labels;
        this.containerTemplate = Handlebars.compile($('faceted-nav-container').innerHTML);
        var facetItemTemplate = Handlebars.compile($('facet-item').innerHTML);
        var facetTemplate = Handlebars.compile($('facet').innerHTML);

        Handlebars.registerHelper('facetItem', function(context) {
            return facetItemTemplate(context);
        });

        Handlebars.registerHelper('facet', function() {
            return facetTemplate(this);
        });

        Handlebars.registerHelper('eachOption', function(options) {
            var result = "";
            var numberOfOptions = options.length;

            for (var i = 0; i < numberOfOptions; i ++) {
                result = result + facetItemTemplate(options[i]);
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
			var result = '';
			var size = facets.length;
			for (var i = 0; i < size; i++) {
				result = result + facetTemplate(facets[i]);
			}
			return result;
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

function initFacetedNavigation(data, title, placeholderEl) {
    var facetedNav = new FacetedNavigation(
            {showMore: "Show More", showLess: "Show Less"},
            ['white', 'search'],
            {useTree: false, placeholderEl: placeholderEl});

    facetedNav.create("", {title: "Updated title", count: 872, facets: data});
}