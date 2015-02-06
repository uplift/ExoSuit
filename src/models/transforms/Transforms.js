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
                return ( root.ExoSuit.Mixins.TransformMixin = factory( root, {}, _, FlattenMixin ) );
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
        root.ExoSuit.Mixins.TransformMixin = factory( root, {}, root._, root.ExoSuit.Mixins.FlattenMixin );
    }
}( this, function( root, TransformMixin, _, FlattenMixin ) {
    "use strict";
    var transformations = {
        "string": {
            deserialize: function( value ) {
                return value ? String( value ) : null;
            },
            serialize: function( value ) {
                return value ? String( value ) : null;
            }
        },
        "number": {
            deserialize: function( value ) {
                return value ? Number( value ) : null;
            },
            serialize: function( value ) {
                return value ? Number( value ) : null;
            }
        },
        "boolean": {
            deserialize: function( value ) {
                var type = typeof value;

                if ( type === 'boolean' ) {
                    return value;
                } else if ( type === 'string' ) {
                    return value.match( /^false$|^n$|^f$|^0$/i ) === null;
                } else if ( type === 'number' ) {
                    return value !== 0;
                } else {
                    return false;
                }
            },
            serialize: function( value ) {
                return Boolean( value );
            }
        }
    };

    TransformMixin = function() {
        var oldParse = this.parse,
            oldToJSON = this.toJSON,
            oldSync = this.sync;

        // Mixin flatten functionality if it doesnt exist already
        if ( !this.flatten && !this.unflatten ) {
            FlattenMixin.call( this );
        }

        // Merge default transformation with transformation set on model
        this._transformations = _.defaults( ( this.transformations || {} ), transformations );

        this._transformData = function( data, serialize ) {
            var transformer;

            if ( typeof serialize === 'boolean' ) {
                // Flatten response so easier to loop over
                data = this.flatten( data );
                // Iterate over defined transforms
                for ( var transform in this.transforms ) {
                    // If key is in response then run defined transformation over it
                    if ( data[ transform ] ) {
                        transformer = this.transformations[ this.transforms[ transform ] ];
                        if ( serialize ) {
                            data[ transform ] = transformer.serialize( data[ transform ] );
                        } else {
                            data[ transform ] = transformer.deserialize( data[ transform ] );
                        }
                    }
                }
                // Return response to unflattened state
                data = this.unflatten( data );
            }

            return data;
        };

        this.parse = function( resp, options ) {
            if ( this.transforms ) {
                resp = this._transformData( resp, false );
            }

            // Call super parse with new response data
            return oldParse.apply( this, [ resp, options ] );
        };

        this.toJSON = function() {
            // Call super toJSON to get data to transform
            var attrs = oldToJSON.apply( this );

            if ( this.transforms ) {
                attrs = this._transformData( attrs, true );
            }

            // Return transformed attributes
            return attrs;
        };

        this.sync = function( method, model, options ) {
            if ( method === 'patch' && this.transforms ) {
                options.attrs = this._transformData( options.attrs, true );
            }

            // Call super save with new options
            return oldSync.apply( this, [ method, model, options ] );
        };
    };

    return TransformMixin;
} ));
