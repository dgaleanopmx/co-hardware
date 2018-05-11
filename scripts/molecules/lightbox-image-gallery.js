hp.ImageSelector = new Class({

    selectedItemIndex: null,

    initialize: function (thumbnails, contentElements) {
        this.thumbnails = thumbnails;
        this.contentElements = contentElements;
        var self = this;
        this.thumbnails.each(function(el, index) {
            el.addEvent('click', function () {
                self.select(index);
            });
        });
    },

    select: function(itemIndex) {
        var selectedItemIndex = this.selectedItemIndex;
        if (selectedItemIndex !== null) {
            this.hide(selectedItemIndex);
        }

        this.selectedItemIndex = itemIndex;

        this.show(itemIndex);
    },

    show: function(itemIndex) {
        var imageEl = this.thumbnails[itemIndex].getElement('img');
        imageEl.removeClass('drk');
        var contentEl = this.contentElements[itemIndex];
        contentEl.removeClass('hidden');
        var relatedImage = imageEl.get('rel');
        if (relatedImage) {
            contentEl.getElement('img').set('src', relatedImage);
            imageEl.erase('rel');
        }
    },

    hide: function(itemIndex) {
        this.thumbnails[itemIndex].getElement('img').addClass('drk');
        this.contentElements[itemIndex].addClass('hidden');
    }

});

var initImagesOverlay = function (popupId, triggerCntSelector) {
    var popupEl = $(popupId);
    var containerEl = popupEl.getElement('.js_images_popup_items');
    var elementToClone = containerEl.getFirst().dispose();
    var popupImages = [];

    var updateImages = function(el) {
        var newEl = elementToClone.clone();
        popupImages.push(newEl);

        newEl = newEl.getElement('img');
        newEl.set('src', el.get('src'));
        newEl.set('rel', el.get('rel'));
        el.erase('rel');

        newEl.addClass('drk');
    };

    $$(triggerCntSelector || '.js_images_overlay').each(function(el) {
        // clone image items in popup and update images
        el.getElements('img').each(updateImages);
        containerEl.adopt(popupImages);

        var selector = new hp.ImageSelector($$(popupImages).getElements('a'), popupEl.getElement('.js_images_popup_content').getChildren());
        el.getElements('a').each(function(trigger, index) {
            trigger.addEvent('click', function() {
                selector.select(index);
            });
        });
    });
};

function initGalleryOverlay(triggerSelector) {
    var GALLERIES = {};

    $$(triggerSelector).each(function (trigger) {
        var popupId = trigger.get("rel");
        if (!popupId) {
            return;
        }

        if (!GALLERIES[popupId]) {
            var popup = $(popupId);
            popup.getElements('.js_images_popup_items img').addClass('drk');
            GALLERIES[popupId] = new hp.ImageSelector(popup.getElements('.js_images_popup_items a'), popup.getElement('.js_images_popup_content').getChildren());
        }

        trigger.addEvent('click', function() {
            GALLERIES[popupId].select(0);
        });
    });
}