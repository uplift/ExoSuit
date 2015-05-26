( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    /* istanbul ignore next */
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'underscore',
                'backbone'
            ],
            function( _, Backbone ) {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.FlattenMixin = factory( root, {}, _, Backbone ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var _ = require( 'underscore' );
        var Backbone = require( 'backbone' );

        module.exports = factory( root, exports, _, Backbone );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.FlattenMixin = factory( root, {}, root._, root.Backbone );
    }
}( this, function( root, FlattenMixin, _, Backbone ) {
    "use strict";
    FlattenMixin = function() {
        this.flatten = function( attrs ) {
            return this._flatten( attrs || this.attributes );
        };

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
        this._flatten = function( object, scope, prefix ) {
            prefix = prefix || '';
            scope = scope || {};

            var model = this;

            // Reduce object into new flat object
            return _( object ).reduce( function( memory, item, key ) {
                if ( _.isObject( item ) ) {
                    if ( item instanceof Backbone.Model || item instanceof Backbone.Collection ) {
                        // If value is an Backbone Model/Backbone Collection, run its toJSON result through flatten again with a set prefix
                        model._flatten( item.toJSON(), memory, prefix + key + '.' );
                    } else {
                        // If value is an object/array, run it through flatten again with a set prefix
                        model._flatten( item, memory, prefix + key + '.' );
                    }
                } else {
                    // If just a primitive value then set on memory object
                    memory[ prefix + key ] = item;
                }

                return memory;
            }, scope );
        };

        this.unflatten = function( attrs ) {
            return this._unflatten( attrs );
        };

        // Unflatten a single depth object with dot notation keys to a multi level object
        this._unflatten = function( object ) {
            return _.chain( object ).reduce( function( memory, value, prop ) {
                // Get key parts information of flattened key
                var keys = prop.split( "." ),
                    partsLength = keys.length;

                // Reduce keys into unflattened object
                memory = _.reduce( keys, function( key, part, index ) {
                    // Copy key to current so it can be used to grab part of the object later without overwriting key completely
                    var current = key,
                        idx = 0;

                    // Walk current unflattened object till reach correct depth
                    while ( index !== idx ) {
                        current = current[ keys[ idx ] ];
                        idx++;
                    }

                    // If the current part in loop is not currently created
                    if ( !current[ part ] ) {
                        // If current index is last part set value on unflattened object
                        if ( index === partsLength - 1 ) {
                            current[ part ] = value;
                        } else {
                            // Lookahead in keys and if next key in flattened key is a number
                            if ( !isNaN( parseInt( keys[ index + 1 ] ) ) ) {
                                // Must be array so create empty array
                                current[ part ] = [];
                            } else {
                                // Otherwise its an object so create empty array
                                current[ part ] = {};
                            }
                        }
                    }

                    // Return current unflattened object
                    return key;
                }, memory );

                return memory;
            }, {} ).each( function( value, key ) {
                // If the unflattened object has sparse arrays, remove the undefined values within the array
                if ( value instanceof Array ) {
                    var indexes = [];
                    for ( var index = 0, len = value.length; index < len; index++ ) {
                        if ( typeof value[ index ] === "undefined" ) {
                            indexes.push( index );
                        }
                    }
                    _.each( indexes, function( val, index ) {
                        value.splice( ( val - index ), 1 );
                    } );
                }
            } ).value();
        };
    };

    return FlattenMixin;
} ));
