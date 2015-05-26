( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    /* istanbul ignore next */
    if ( typeof define === 'function' && define.amd ) {
        define(
            function() {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.SortOnChangeMixin = factory( root, {} ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        module.exports = factory( root, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.SortOnChangeMixin = factory( root, {} );
    }
}( this, function( root, SortOnChangeMixin ) {
    "use strict";
    SortOnChangeMixin = function() {
        // Cache current mixin methods to use later
        var oldOnModelEvent = this._onModelEvent;

        this._onModelEvent = function( event, model, collection, options ) {
            var isSortByKey = typeof this.comparator === 'string' && event === 'change:' + this.comparator,
                isSortByFunc = typeof this.comparator !== 'string' && event === 'change';

            if ( this.comparator && ( isSortByKey || isSortByFunc ) ) {
                this.sort();
            }
            oldOnModelEvent.apply( this, arguments );
        };
    };

    return SortOnChangeMixin;
} ));
