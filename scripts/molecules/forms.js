hp.AutoResizableTextarea = new Class({

    targetEl: null,
    targetPaddingTop: null,
    targetPaddingBottom: null,
    targetHeight: null,
    patternEl: null,
    storedHeight: false,


    initialize: function(targetEl) {
        this.targetEl = targetEl;
        this.patternEl = new Element("textarea");
        this.targetPaddingTop = parseInt(this.targetEl.getStyle("padding-top"));
        this.targetPaddingBottom = parseInt(this.targetEl.getStyle("padding-bottom"));
        this.targetHeight = parseInt(this.targetEl.getStyle("height"));
        var targetCoordinates = this.targetEl.getCoordinates();

        var patternStyles = {
            "display": "block",
            "position": "absolute",
            "visibility": "hidden",
            "z-index": "10",
            "left": targetCoordinates.left+"px",
            "top": targetCoordinates.top+"px",
            "background-color": "red",
            "height": this.targetEl.getStyle("height"),
            "width": this.targetEl.getStyle("width"),
            "padding": this.targetEl.getStyle("padding"),
            "font-size": this.targetEl.getStyle("font-size"),
            "font-family": this.targetEl.getStyle("font-family"),
            "line-height": this.targetEl.getStyle("line-height")
        };

        this.updatePatternContent();
        this.patternEl.setStyles(patternStyles);
        this.patternEl.inject($$("body")[0]);

        this.targetEl.addEvent("keyup", this.buttonPressHandler.bind(this));
    },

    updatePatternContent: function(){
        this.patternEl.set("value", this.targetEl.get("value"));
    },

    buttonPressHandler: function(){
        this.updatePatternContent();
        var patternHeight = this.patternEl.getScrollSize().y;
        var height = (patternHeight > this.targetHeight ? patternHeight : this.targetHeight);
        if(this.storedHeight != height){
            this.storedHeight = height;
            this.targetEl.tween("height", height);
        }
    }
})

function initAutoResizableTextareas(targetClass){
    var targetClass = targetClass || "js_auto_resize";
    $$("." + targetClass).each(function(targetEl) {
		new hp.AutoResizableTextarea(targetEl);
	});
}

function inputColorChange(){
    var inputs = $$('.js_color_change');

    inputs.each(function(el){
        var placeholder = el.value;

        el.addEvents({
            focus: function(){
                    if(this.value == placeholder){
                    this.value = '';
                }
            },
            blur: function(){
                if (this.value == ''){
                    this.value = placeholder;
                    if(!this.hasClass('pre-active')) this.addClass('pre-active');
                }
                else{
                    this.removeClass('pre-active').removeClass('pre-active-search');
                }
            }

        });
    });
}