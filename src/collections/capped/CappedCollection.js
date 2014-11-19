( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            function() {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.CappedCollectionMixin = factory( root, {} ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        module.exports = factory( root, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.CappedCollectionMixin = factory( root, {} );
    }
}( this, function( root, CappedCollectionMixin ) {
    "use strict";
    CappedCollectionMixin = function() {
        // Cache current mixin methods to use later
        var oldInitialize = this.initialize,
            oldAdd = this.add;

        // Set collection capped limit
        this.limit = this.limit || 100;

        this.initialize = function( models, options ) {
            options = options || {};

            if ( options.limit ) {
                this.limit = options.limit;
            }

            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        // Override add method
        this.add = function( models, options ) {
            var added = oldAdd.apply( this, arguments ),
                addedOverLimit;

            if ( this.length <= this.limit ) {
                return added;
            }

            this.remove( this.first( this.length - this.limit ) );

            addedOverLimit = added.length - this.limit;

            if ( addedOverLimit > 0 ) {
                return added.slice( addedOverLimit );
            } else {
                return added;
            }
        };
    };

    return CappedCollectionMixin;
} ));
