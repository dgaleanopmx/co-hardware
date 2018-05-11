function initVideoPoster(triggerClass, targetClass) {
    $$("." + triggerClass).each(function (trigger) {
        var target = trigger.getParent().getNext("." + targetClass);
        //target.hide();
        trigger.addEvent('click', function () {
            target.show();
        });
    });
}