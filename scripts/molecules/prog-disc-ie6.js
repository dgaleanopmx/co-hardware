/**
 * Overrided method, that returns DD height. In ie6 we close popup before defining its height.
 * This browser doesn't take into account margin of child component, if we define height just
 * after initialising.
 * <dd><div style="margin: 30px;"></div></dd>
 */
(function () {
    var options = hp.ProgressiveDisclosureItem.prototype.options;
    options.closeStyles.height = 1;
    options.closeEffect.height = 1;

    var oldMethod = hp.ProgressiveDisclosureItem.prototype._popupHeight;

    hp.ProgressiveDisclosureItem.prototype._popupHeight = function (content) {
        var content = this.item.getNext('.js_prg_dsc_cnt');
        this.fx = new Fx.Morph(content, this.options.fx);

        this.fx.addEvent('complete', function() {
            if (!this.isOpen()) {
                content.hide();
            }
            this.fireEvent("itemStateChanged");
        }.bind(this));

        content.show();

        var res = content.getScrollHeight();

        return  res <= 0 ? 0 : res;
    };
})();