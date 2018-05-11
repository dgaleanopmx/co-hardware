hp.LinkListExpandable = new Class({

    Implements: [Options],

    options: {
        toggleEvent: "click",
        targetClass: ".js_list_expandable_target"
    },

    triggerEl: null,

    initialize : function(triggerEl, options) {
        this.setOptions(options);
        this.triggerEl = triggerEl;
        this.targetEl = this.triggerEl.getNext(this.options.targetClass);
        this.triggerEl.addEvent(this.options.toggleEvent, this.toggle.bind(this));
    },

    toggle: function(){
        if(this.targetEl.getStyle("display") == "none"){
            this.targetEl.show();
        } else {
            this.targetEl.hide();
        }
        this.triggerEl.getFirst("a").toggleClass("expanded");
    }
});

function initLinkListExpandable(triggerClass, options){
    var triggerClass = triggerClass || ".js_list_expandable_trigger";
    $$(triggerClass).each(function(triggerEl){
        new hp.LinkListExpandable(triggerEl, options);
    });
}