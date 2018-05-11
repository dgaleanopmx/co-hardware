/*Printable version code*/
function printPage(printableClass) {
    $$(printableClass).each(function(el) {
        el.addEvents({
            click: function(e) {
                new Event(e).stop();
                window.print();
            },
            keypress: function(e) {
                if (e.key == 'enter') {
                    new Event(e).stop();
                    window.print();
                }
            }
        });
    });
}