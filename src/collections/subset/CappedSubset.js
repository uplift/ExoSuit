( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    /* istanbul ignore next */
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'underscore'
            ],
            function( _ ) {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.CappedSubsetMixin = factory( root, {}, _ ) );
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
        root.ExoSuit.Mixins.CappedSubsetMixin = factory( root, {}, root._ );
    }
}( this, function( root, CappedSubsetMixin, _ ) {
    "use strict";
    CappedSubsetMixin = function() {
        var orderMethods = [ 'first', 'last' ];

        // Internal functions
        function isInt( number ) {
            if ( typeof number !== 'number' || parseInt( number, 10 ) !== number ) {
                return false;
            }
            return true;
        }

        function contains( value, array ) {
            var doesContain = false;

            for ( var i = 0, len = array.length; i < len; i++ ) {
                if ( !doesContain && value === array[ i ] ) {
                    doesContain = true;
                }
            }

            return doesContain;
        }

        // Cache current mixin methods to use later
        var oldInitialize = this.initialize;

        // Set collection capped limit
        this.limit = isInt( this.limit ) ? this.limit : 100;
        this.order = contains( this.order, orderMethods ) ? this.order : 'last';

        this.initialize = function( models, options ) {
            options = options || {};

            if ( options.parent ) {
                this.parent = options.parent;
            }

            if ( !this.parent ) {
                throw new Error( 'Parent collection is required to use subset collection' );
            }

            this.model = this.parent.model;

            if ( options.limit && options.limit !== this.limit ) {
                this.resize( options.limit, { silent: true } );
            }

            if ( options.order && options.order !== this.order ) {
                this.reorder( options.order, { silent: true } );
            }

            this.listenTo( this.parent, {
                add: this.__add,
                remove: this.__remove,
                reset: this.__reset,
                sort: this.__reset
            } );

            this.__reset();

            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        this._getParentModels = function() {
            if ( !this.parent ) {
                return;
            }

            var limit = this.parent.length < this.limit ? this.parent.length : this.limit;

            return this.parent[ this.order ]( limit );
        };

        this.__add = function( model, collection, options ) {
            options = options || {};

            var index;

            if ( !this.comparator && typeof options.at !== 'undefined' ) {
                index = options.at;
            }

            if ( this.parent.length < this.limit ) {
                this.add( model, options );
            } else if ( this.order.toLowerCase() === 'last' && this.parent.indexOf( model ) >= ( this.parent.length - this.limit ) ) {
                this.remove( this.parent.at( this.parent.length - this.limit - 1 ), options );
                options.at = index ? index - this.limit : undefined;
                this.add( model, options );
            } else if ( this.order.toLowerCase() === 'first' && this.parent.indexOf( model ) < this.limit ) {
                this.remove( this.parent.at( this.limit ), options );
                this.add( model, options );
            }
        };

        this.__remove = function( model, collection, options ) {
            options = options || {};

            var parentModels;

            if ( this.contains( model ) ) {
                this.remove( model, options );
                if ( this.parent.length > this.length ) {
                    parentModels = this._getParentModels();
                    if ( this.order.toLowerCase() === 'last' ) {
                        if ( !this.comparator && typeof options.at === undefined ) {
                            options.at = 0 ;
                        }
                        this.add( parentModels[ 0 ], options );
                    } else {
                        this.add( parentModels[ this.limit - 1 ], options );
                    }
                }
            }
        };

        this.__reset = function( collection, options ) {
            this.reset( this._getParentModels(), options );
        };

        this.resize = function( size, options ) {
            // Make sure passed in size is a number
            if ( !isInt( size ) ) {
                throw new Error( 'Size must be a number' );
            }

            options = options || {};

            var models,
                modelsToProcess = [],
                newCids,
                oldLimit = this.limit;

            this.limit = size;
            models = this._getParentModels();
            newCids = _.pluck( models, 'cid' );

            if ( size > oldLimit ) {
                if ( this.order === 'last' ) {
                    modelsToProcess = models.slice( 0, this.limit - this.length );
                    if ( !this.comparator && typeof options.at === "undefined" ) {
                        options.at = 0 ;
                    }
                } else {
                    modelsToProcess = models.slice( this.length, this.limit );
                }
                this.add( modelsToProcess, options );
            } else if ( size < oldLimit ) {
                modelsToProcess = this.filter( function( model ) {
                    return !_.contains( newCids, model.cid );
                }, this );
                this.remove( modelsToProcess );
            }

            if ( !options.silent ) {
                this.trigger( 'resize', size, this, options );
            }
        };

        this.reorder = function( options ) {
            options = options || {};

            this.order = this.order === 'first' ? 'last' : 'first';

            this.reset( this._getParentModels() );

            if ( !options.silent ) {
                this.trigger( 'reorder', this.order, this, options );
            }
        };
    };

    return CappedSubsetMixin;
} ));
