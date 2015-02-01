( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            function() {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.FilteredSubsetMixin = factory( root, {} ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        module.exports = factory( root, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.FilteredSubsetMixin = factory( root, root.Backbone, {} );
    }
}( this, function( root, Backbone, FilteredSubsetMixin ) {
    "use strict";
    FilteredSubsetMixin = function() {
        // Cache current mixin methods to use later
        var oldInitialize = this.initialize;

        this.initialize = function( models, options ) {
            options = options || {};

            if ( options.parent ) {
                this.parent = options.parent;
            }

            if ( !this.parent ) {
                throw new Error( "Parent collection is required to use subset collection" );
            }

            this.model = this.parent.model;

            if ( options.filter ) {
                this.filter = options.filter;
            }

            this.listenTo( this.parent, {
                add: this.__add,
                remove: this.__remove,
                reset: this.__reset,
                change: this.__change
            } );

            this.__reset( this._getParentModels() );

            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        // Default noop filter function if one isn't specified
        this.filter = this.filter || function( model ) {
            return true;
        };

        this._getParentModels = function() {
            if ( !this.parent ) {
                return;
            }

            return this.parent.filter( this.filter );
        };

        this.__add = function( model, collection, options ) {
            if ( this.filter( model ) ) {
                this.add( model, options );
            }
        };

        this.__remove = function( model, collection, options ) {
            if ( this.contains( model ) ) {
                this.remove( model, options );
            }
        };

        this.__reset = function( collection, options ) {
            this.reset( this._getParentModels(), options );
        };

        this.__change = function( model, options ) {
            if ( this.contains( model ) ) {
                if ( !this.filter( model ) ) {
                    this.remove( model, options );
                }
            } else {
                if ( this.filter( model ) ) {
                    this.add( model, options );
                }
            }
        };
    };

    return FilteredSubsetMixin;
} ));
