/**
 * @class AnimatedContainer
 *
 * DOM element with animation
 * primary benefit in pre\post actions for show\hide
 * @events:
 *    before-opening
 *    before-closing
 *    after-opening
 *    after-closing
 */
hp.AnimatedContainer = new Class({

    Implements: [Options, CHKOverrides],

    options: {
        opening: {
            state: "opening",

            before: null,       // css styles to apply before effect
            beforeAction: null, // function () {}

            effect: null,       // styles to do effect

            after: null,        // css styles to apply before effect
            afterAction: null   // function () {}
        },
        closing: {
            state: "closing",

            before: null,       // css styles to apply before effect
            beforeAction: null, // function () {}

            effect: null,       // styles for effect

            after: null,        // css styles to apply before effect
            afterAction: null   // function () {}
        },
        effect: {duration: 500, transition: Fx.Transitions.Sine.easeOut, link: 'cancel'}
    },

    /**
     * @param {Element} cnt
     * @param {Hash} options
     */
    initialize: function (cnt, options) {
        this.setOptions(options);
        this.setOverrides();

        cnt.effect = new Fx.Morph(cnt, this.options.effect);
        cnt.effect.addEvent("complete", function () {
            cnt.inprogress = false;
            cnt.open = cnt.effectState == "opening";

            // applay after styles if any
            var afterStyles = cnt.fxOptions.after;
            if (afterStyles) {
                cnt.setStyles(afterStyles);
            }

            // call afterAction if any
            var action = cnt.fxOptions.afterAction;
            if (action) {
                action.bind(cnt)(cnt);
            }
            cnt.fireEvent("after-" + cnt.fxOptions.state);
        });

        cnt.effectShow = this._effectFunction(this.options.opening).bind(cnt);
        cnt.effectHide = this._effectFunction(this.options.closing).bind(cnt);
    },

    _effectFunction: function (options) {
        return function () {
            if (this.inprogress) {
                if (this.effectState != options.state) {
                    this.effect.cancel();
                } else {
                    return;
                }
            }

            this.fxOptions = options;
            if (this.fxOptions.before) {
                this.setStyles(this.fxOptions.before);
            }

            // call beforeAction if any
            var action = this.fxOptions.beforeAction;
            if (action) {
                action.bind(this)(this);
            }
            this.fireEvent("before-" + this.fxOptions.state);

            this.inprogress = true;
            this.effectState = this.fxOptions.state;

            this.effect.start(this.fxOptions.effect);
        }
    }
});

/**
 * @return {Array} - array of created objects
 */
hp.AnimatedContainer.init = function(cntSelector, options) {
    return $(cntSelector).map(function (cnt) {
        return new hp.AnimatedContainer(cnt, options);
    });
};