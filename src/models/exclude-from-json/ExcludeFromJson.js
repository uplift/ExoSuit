( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'underscore',
                'exosuit/models/flatten/Flatten'
            ],
            function( _, FlattenMixin ) {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.ExcludeFromJSONMixin = factory( root, {}, _, FlattenMixin ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var _ = require( 'underscore' );
        var FlattenMixin = require( '../flatten/Flatten' );

        module.exports = factory( root, exports, _, FlattenMixin );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.ExcludeFromJSONMixin = factory( root, {}, root._, root.ExoSuit.Mixins.FlattenMixin );
    }
}( this, function( root, ExcludeFromJSONMixin, _, FlattenMixin ) {
    "use strict";
    ExcludeFromJSONMixin = function() {
        // Cache current mixin methods to use later
        var oldToJSON = this.toJSON;

        // Mixin flatten functionality if it doesnt exist already
        if ( !this.flatten && !this.unflatten ) {
            FlattenMixin.call( this );
        }

        // Wrap existing toJSON method
        this.toJSON = function() {
            // Run current toJSON function and cache response
            var json = oldToJSON.apply( this, arguments );

            // If excludeFromJSON exists on model
            if ( this.excludeFromJSON ) {
                // Flatten json object into single depth
                json = this.flatten( json );
                // Remove keys from excludeFromJSON array
                json = _.omit( json, function( value, key, object ) {
                    // Loop over excludeFromJSON array
                    for ( var i = 0, len = this.excludeFromJSON.length; i < len; i++ ) {
                        // Check if key includes part of exclude key i.e. parent object/array to be removed
                        if ( key.indexOf( this.excludeFromJSON[ i ] ) !== -1 ) {
                            // Delete key
                            return true;
                        }
                    }
                    return false;
                }, this );
                // Return flattened json into original structure minus deleted properties
                json = this.unflatten( json );
            }

            // Return json
            return json;
        };
    };

    return ExcludeFromJSONMixin;
} ));
