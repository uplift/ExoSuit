( function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'underscore'
            ],
            function( _ ) {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.ExcludeFromJSONMixin = factory( root, {}, _ ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var _ = require( 'underscore' );

        module.exports = factory( root, exports, _ );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.ExcludeFromJSONMixin = factory( root, {}, root._ );
    }
}( this, function( root, ExcludeFromJSONMixin, _ ) {
    // Flatten a nested object to flat single depth object
    //
    // {
    //   "main" : {
    //      "childKey": "value",
    //      "myArray": [ "good", "bye" ],
    //      "arrayObjects": [ { "key": "value" } ]
    //   }
    // }
    //
    // to
    //
    // {
    //   "main.childKey" : "value",
    //   "main.myArray.0" : "good",
    //   "main.myArray.1" : "bye",
    //   "main.arrayObjects.0.key" : "value"
    // }
    function flatten( object, scope, prefix ) {
        prefix = prefix || '';
        scope = scope || {};

        // Reduce object into new object
        return _( object ).reduce( function( result, value, key ) {
            if ( _.isObject( value ) ) {
                // If value is an object/array, run it through flatten again with a set prefix
                flatten( value, result, prefix + key + '.' );
            } else {
                // If just a primitive value then set on result object
                result[ prefix + key ] = value;
            }

            return result;
        }, scope );
    }

    // Unflatten a single depth object with dot notation keys to a multi level object
    // Opposite of above flatten method
    function unflatten( object ) {
        return _.chain( object ).reduce( function( result, value, key ) {
            // Get parts information of flattened key
            var parts = key.split( "." ),
                partsLength = parts.length;

            // Reduce parts into unflattened object
            result = _.reduce( parts, function( partResult, part, index ) {
                var current = partResult,
                    idx = 0;

                // Get currently constructed unflattened object
                while ( index !== idx ) {
                    current = current[ parts[ idx ] ];
                    idx++;
                }

                // If the current part in loop is not created
                if ( !current[ part ] ) {
                    // If current index is last part
                    if ( index === partsLength - 1 ) {
                        // Set value on unflattened object
                        current[ part ] = value;
                    } else {
                        // If next part in flattened key is a number
                        if ( !isNaN( parseInt( parts[ index + 1 ] ) ) ) {
                            // Must be array so create empty array
                            current[ part ] = [];
                        } else {
                            // Otherwise its an object so create empty array
                            current[ part ] = {};
                        }
                    }
                }

                // Return current unflattened object
                return partResult;
            }, result );

            return result;
        }, {} ).each( function( value, key ) {
            // Clear up any array values that have been deleted but not changed array length
            if ( value instanceof Array ) {
                _.each( value, function( arrayValue, index ) {
                    if ( typeof arrayValue === "undefined" ) {
                        value = value.splice( index, 1 );
                    }
                } );
            }
        } ).value();
    }

    ExcludeFromJSONMixin = function() {
        // Cache current mixin methods to use later
        var oldToJSON = this.toJSON;

        // Wrap existing toJSON method
        this.toJSON = function() {
            // Run current toJSON function and cache response
            var json = oldToJSON.apply( this, arguments );

            // If excludeFromJSON exists on model
            if ( this.excludeFromJSON ) {
                // Flatten json object into single depth
                json = flatten( json );
                // Loop over excludeFromJSON array
                for ( var i = 0, len = this.excludeFromJSON.length; i < len; i++ ) {
                    // Delete property in excludeFromJSON from json response
                    delete json[ this.excludeFromJSON[ i ] ];
                    // Loop over json keys
                    for ( var key in json ) {
                        // Check if key includes part of exclude key i.e. parent object/array to be removed
                        if ( key.indexOf( this.excludeFromJSON[ i ] ) !== -1 ) {
                            // Delete key
                            delete json[ key ];
                        }
                    }
                }
                // Return flattened json into original structure minus deleted properties
                json = unflatten( json );
            }

            // Return json
            return json;
        };
    };

    return ExcludeFromJSONMixin;
} ));
