( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            function() {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.SelectListMixin = factory( root, {} ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        module.exports = factory( root, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.SelectListMixin = factory( root, {} );
    }
}( this, function( root, SelectListMixin ) {
    "use strict";
    SelectListMixin = function() {
        var oldInitialize = this.initialize;

        this.tagName = "select";
        this.labelKey = this.labelKey || "label";
        this.valueKey = this.valueKey || "value";
        this.addInitialOption = this.addInitialOption || false;
        this.initialOptionLabel = typeof this.initialOptionLabel !== "undefined" ? this.initialOptionLabel : "Please Select";
        this.initialOptionValue = typeof this.initialOptionValue !== "undefined" ? this.initialOptionValue : "0";

        this.initialize = function( options ) {
            options = options || {};

            if ( options.labelKey ) {
                this.labelKey = options.labelKey;
            }
            if ( options.valueKey ) {
                this.valueKey = options.valueKey;
            }
            if ( options.addInitialOption ) {
                this.addInitialOption = options.addInitialOption;
            }
            if ( typeof options.initialOptionLabel !== "undefined" ) {
                this.initialOptionLabel = options.initialOptionLabel;
            }
            if ( typeof options.initialOptionValue !== "undefined" ) {
                this.initialOptionValue = options.initialOptionValue;
            }
            if ( typeof options.selectedIndex !== "undefined" ) {
                this.selectedIndex = options.selectedIndex;
            }

            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        this.render = function() {
            var options = "";

            if ( this.addInitialOption ) {
                options += "<option value='" + this.initialOptionValue + "'>" + this.initialOptionLabel + "</option>";
            }

            if ( this.collection ) {
                this.collection.forEach( function( model, index ) {
                    var selected = this.selectedIndex && this.selectedIndex === index ? " selected" : "";

                    options += "<option value='" + model.get( this.valueKey ) + "'" + selected + ">" + model.get( this.labelKey ) + "</option>";
                }, this );
            }

            return this.$el.html( options );
        };
    };

    return SelectListMixin;
} ));
