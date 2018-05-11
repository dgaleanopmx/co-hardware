function transparentizeIE6PNGs(imagesSelector) {
    /* FILTER FOR IE6 */
    /* transparency for non background png images */
    if (Browser.Engine.trident4) {
        $$(imagesSelector)
                .each(
                function(image) {
                    var size = image.getSize();
                    var src = image.getProperty('src');
                    var div = new Element('div');
                    div.setProperty('title', image.getProperty('alt'));
                    div.replaces(image); // image is replaced by a
                    // div with its height and
                    // width and a title instead
                    // of an alt property
                    div
                            .setStyles({
                                           filter : 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'
                                                   + src
                                                   + '"),sizingMethod="scale")',
                                           width : size.x,
                                           height : size.y
                                       });
                });
    }
}
/**/


function addHover(selector, hoverClass) {
    $$(selector).addEvents({
        mouseenter: function () {
            this.addClass(hoverClass);
        },
        mouseleave: function () {
            this.removeClass(hoverClass);
        }
    });
}