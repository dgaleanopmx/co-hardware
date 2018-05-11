function initAddThisShareWidget(){
    addthis.addEventListener('addthis.menu.open', addThisOpenHandler);
}

function addThisOpenHandler(evt){
    if(evt.data.pane == "compact"){
        var triggers = $$(".js_share_popup_trigger");
        var target = $("at15s");

        target = target.clone(true, true).replaces(target);

        $("at15s").setProperties({
                    "onmouseover": "javascript:void(0);",
                    "onmouseout": "javascript:void(0);"
        });
        triggers.each(function(trigger){
            trigger = trigger.clone().replaces(trigger);
            if(window.rtl){
                addThisApplyPosition(trigger, target, true);
            }
            $("at20mc").show();
            trigger.addEvent("click", addThisClick);
        });
    }
}

function addThisClick(event){
    var popup = $('at15s');
    var popupInner = $('at_hover');

    if(popup.getStyle('display') == "none"){

        popup.setStyle("display", "block");
        popupInner.setStyle("display", "block");
        addThisApplyPosition(this, popup);
    } else {
        popup.setStyle("display", "none");
        popupInner.setStyle("display", "none");
    }
}

function addThisApplyPosition(trigger, popup, horiz){
    var popupPosition = trigger.getCoordinates();
    var popupWidth = 250;

    if (!window.rtl) {
        popup.setStyles({
            "top": popupPosition.top + 26,
            "left": popupPosition.left
        });
    } else {
        if(!horiz){
            popup.setStyles({
                "top": popupPosition.top + 26
            });
        }
        popup.setStyles({
            "left": popupPosition.right - popupWidth - 7
        });
    }

    addThisApplyAccessability(popup);
}

function addThisApplyAccessability(popupInner){
    var links = popupInner.getElements(".at_item");
    links.each(function(item){
        item.setProperty("onkeypress", item.getProperty("onclick"));
        item.setProperty("href", "javascript:void(0);");
    });

    links[0].focus();
}