hp.resetForm = function() {
    setTimeout(function() {
        this.widgetsCollection.each(function(el) {
            if (typeof el.reset == 'function') {
                el.reset();
            }
        });
    }.bind(this), 50);
};

hp.addWidgetToFormCollection = function (el,widget) {
    var form = el.getParent("form");
    if (form) {
        if (!form.widgetsCollection) {
            form.widgetsCollection = [];
        }

        form.widgetsCollection.push(widget);
    }
};