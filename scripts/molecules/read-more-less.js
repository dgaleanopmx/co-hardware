function initReadMoreLessWidget (selector) {
    $$(selector || '.js_read_more_less').map(function(toggler) {
        toggler.getElement('a').addClass("more");
        toggler.getElement('a').addEvent('click', function() {
            if (this.hasClass("more")) {
                this.removeClass("more");
                this.addClass("less");
            } else {
                this.removeClass("less");
                this.addClass("more");
            }
        });
    });
}