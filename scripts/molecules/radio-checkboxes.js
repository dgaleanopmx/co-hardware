(function () {

    function applyInputValue(value) {
        if (value == undefined) {
            value = this.getElement("input").checked;
        }
        if (value) {
            this.removeClass("unchkd");
            this.addClass("chkd");
            if(navigator.userAgent.toUpperCase().indexOf("MSIE 6.0") != -1){
                if (this.hasClass("error")) {
                    this.removeClass("error_unchkd");
                    this.addClass("error_chkd");
                }
            }
        } else {
            this.addClass("unchkd");
            this.removeClass("chkd");
            if(navigator.userAgent.toUpperCase().indexOf("MSIE 6.0") != -1){
                if (this.hasClass("error")) {
                    this.addClass("error_unchkd");
                    this.removeClass("error_chkd");
                }
            }
        }
    }

    var RADIO_BUTTONS = {};

    function initRadio(inputEl, enclosingSpan) {
        var parentForm = inputEl.getParent("form");
        var parentName = parentForm || inputEl.name || inputEl.id || "null";

        if (!RADIO_BUTTONS[parentName]) {
            RADIO_BUTTONS[parentName] = [];
        }
        RADIO_BUTTONS[parentName].push(enclosingSpan);

        initCheckBox(inputEl, enclosingSpan);

        inputEl.addEvent('change', function () {
            RADIO_BUTTONS[parentName].each(function (span) {
                span.reset();
            });
        });
    }

    function initCheckBox(inputEl, enclosingSpan) {
        enclosingSpan.reset = applyInputValue;
        enclosingSpan.reset(inputEl.checked);

        /*ie6 multi-class bug fix*/
        if (enclosingSpan.hasClass("unchkd") && enclosingSpan.hasClass("dis")) {
            enclosingSpan.addClass("unchkd_dis");
            return;
        }

        if (enclosingSpan.hasClass("dis")) {
            inputEl.disabled = true;
            return;
        }

        enclosingSpan.addEvent("click", function () {
            inputEl.checked = !inputEl.checked;
            this.reset(inputEl.checked);

            inputEl.fireEvent('change', inputEl);
        });
    }

    function initFormWidget(selector, initFunction) {
        $$(selector).each(function (el) {
            initFunction(el.getElement("input"), el);

            hp.addWidgetToFormCollection(el, el);
        });
    }

    window.initRadioButtons = function() {
        initFormWidget(".rbtn", initRadio);
    };

    window.initCheckBoxes = function () {
        initFormWidget(".chbx", initCheckBox);
    };

})();