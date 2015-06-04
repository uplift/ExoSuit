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
                return ( root.ExoSuit.Mixins.RouteFilterMixin = factory( root, {}, _, Backbone ) );
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
        root.ExoSuit.Mixins.RouteFilterMixin = factory( root, {}, root._, root.Backbone );
    }
}( this, function( root, RouteFilterMixin, _, Backbone ) {
    "use strict";

    RouteFilterMixin = function() {
        // Loop through filter functions
        this._runRouteFilters = function( filters, args ) {
            var router = this;

            // Get next filter function to run
            var filter = filters.shift(),
                // Create next function for when this filter is done
                next = function( result ) {
                    // If result is not false and filters still remaining
                    if ( result !== false && filters.length > 0 ) {
                        // Run this function again with remaining filters
                        router._runRouteFilters( filters, args );
                    }
                };

            // If filter function has 4 arguments, its expecting async done function
            if ( filter.length === 2 ) {
                // Run filter function passing in args and next function
                filter.apply( this, args.concat( [ next ] ) );
            } else {
                // Run filter function passing in args
                // Pass the result of the filter function to next function
                next( filter.apply( this, args ) );
            }
        };

        this.execute = function( callback, args, name ) {
            // Does a route config exist for name of route callback
            var hasRouteConfig = ( this.routeConfig && this.routeConfig[ name ] ),
                filters = [];

            // Add any filter functions to filters array
            // If leave route function then add it to filters
            if ( this.leave && _.isFunction( this.leave ) ) {
                filters.push( this.leave );
            }

            // If this.before is a function then add it to filters
            if ( this.before && _.isFunction( this.before ) ) {
                filters.push( this.before );
            }

            // If this.routeConfig is an object and has matching route callback name with a before function then add it to filters
            if ( hasRouteConfig && _.isFunction( this.routeConfig[ name ].before ) ) {
                filters.push( this.routeConfig[ name ].before );
            }

            // If callback then add it to filters
            if ( callback ) {
                // Wrap callback to trigger routing events
                // Different wrapper depending on whether the callback is async or sync
                if ( callback.length === 2 ) {
                    // Async Wrapper
                    filters.push( this._wrapCallbackAsAsync( callback, name ) );
                } else {
                    // Sync Wrapper
                    filters.push( this._wrapCallbackAsSync( callback, name ) );
                }
            }

            // If this.routeConfig is an object and has matching route callback name that is a function then add it to filters
            if ( hasRouteConfig && _.isFunction( this.routeConfig[ name ].after ) ) {
                filters.push( this.routeConfig[ name ].after );
            }

            // If this.after is a function
            if ( this.after && _.isFunction( this.after ) ) {
                filters.push( this.after );
            }

            // Run through added filter functions
            this._runRouteFilters( filters, args );
        };

        this._wrapCallbackAsAsync = function( callback, name ) {
            var router = this;

            return function( args, next ) {
                // Wrap next function
                function done( result ) {
                    // If result of callback is not false, trigger route events
                    if ( result !== false ) {
                        router.trigger.apply( router, [ 'route:' + name ].concat( args ) );
                        router.trigger( 'route', name, args );
                        Backbone.history.trigger( 'route', router, name, args );
                    }
                    // Pass result of callback to next function
                    next( result );
                }

                // args should always be set but check incase it isnt
                if ( !args ) {
                    args = [ null ];
                }
                // Run callback and pass wrapped done as second argument to callback
                callback.apply( this, _.toArray( args ).concat( [ done ] ) );
            };
        };

        this._wrapCallbackAsSync = function( callback, name ) {
            var router = this;

            return function( args ) {
                // args should always be set but check incase it isnt
                if ( !args ) {
                    args = [ null ];
                }

                // Run callback and store any returned value
                var result = callback.apply( this, args );

                // If result of callback is not false, trigger route events
                if ( result !== false ) {
                    router.trigger.apply( router, [ 'route:' + name ].concat( args ) );
                    router.trigger( 'route', name, args );
                    Backbone.history.trigger( 'route', router, name, args );
                }

                // Return the result of the callback
                return result;
            };
        };
    };

    return RouteFilterMixin;
} ));
