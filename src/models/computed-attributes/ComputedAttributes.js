// Heavily Inspired by https://github.com/alexbeletsky/backbone-computedfields
( function( root, factory ) {
    "use strict";
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
                return ( root.ExoSuit.Mixins.ComputedAttributesMixin = factory( root, _, {} ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var _ = require( 'underscore' );

        module.exports = factory( root, _, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.ComputedAttributesMixin = factory( root, root._, {} );
    }
}( this, function( root, _, ComputedAttributesMixin ) {
    "use strict";
    ComputedAttributesMixin = function() {
        var oldInitialize = this.initialize,
            oldToJSON = this.toJSON;

        this.initialize = function( attrs, options ) {
            this.setupComputedEvents();

            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        this.setupComputedEvents = function() {
            var computedAttr;

            for ( var key in this.computed ) {
                computedAttr = this.computed[ key ];

                this.on( 'change:' + key, function( model, value, options ) {
                    this.updateDeps( key, value, options );
                } );

                this.setupDepEvents( computedAttr.deps );

                if ( !_.isEmpty( this.attributes ) ) {
                    this.setComputed( key );
                }
            }
        };

        this.getDepValues = function( deps ) {
            return _.reduce( deps, function( mem, field ) {
                mem[ field ] = this.get( field );
                return mem;
            }, {}, this );
        };

        this.updateDeps = function( key, value, options ) {
            options = options || {};

            var computedAttr = this.computed[ key ],
                fields;

            if ( options.silentUpdateDeps ) {
                return;
            }

            if ( computedAttr.set ) {
                fields = this.getDepValues( computedAttr.deps );

                computedAttr.set.apply( this, [ value, fields ] );
                return this.set( fields, options );
            }
        };

        this.setupDepEvents = function( deps ) {
            for ( var i = 0, len = deps.length; i < len; i++ ) {
                this.on( 'change:' + deps[ i ], this.setComputed );
            }
        };

        this.setComputed = function( key ) {
            var computedAttr = this.computed[ key ],
                fields, value;

            if ( computedAttr && computedAttr.get ) {
                fields = this.getDepValues( computedAttr.deps );
                value = computedAttr.get.apply( this, [ fields ] );
                this.set( key, value, { silentUpdateDeps: true } );
            }
        };

        this.toJSON = function() {
            var json = oldToJSON.apply( this, arguments );

            return _.omit( json, _.keys( this.computed ) );
        };
    };

    return ComputedAttributesMixin;
} ));
