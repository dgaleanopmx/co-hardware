hp.Tooltip = new Class({
    Extends: CustomPopup,

    options:{
        opening: {
            after: {opacity: 1,display: 'block'}
        },
        closing: {
            after: {opacity: 0, display:'none'}
        },
        effect: {duration:0, transition: Fx.Transitions.Sine.easeOut, link: 'cancel'}
    },

    initialize:function (cnt, trigger, options) {
        this.parent(cnt, options);
        //this.popup.show();
        trigger.addEvent("mouseover",this.mouseOverHandler.bind(this));
        trigger.addEvent("mouseleave",this.mouseLeaveHandler.bind(this));
        cnt.addEvent("mouseleave",this.mouseLeaveHandler.bind(this));
        cnt.addEvent("mouseover",function(){
            clearTimeout(this.timer);
        }.bind(this));
    },

    mouseLeaveHandler:function(){
        this.timer = setTimeout(this.hide.bind(this), 100);
    },

    mouseOverHandler:function(){
        setTimeout(this.show.bind(this), 100);
    }
});

function initTooltip(cnt,trigger){
    $$(cnt).map(function(tooltip){
        var trg = tooltip.getPrevious($(trigger));
return new hp.Tooltip(tooltip,trg);
})

}