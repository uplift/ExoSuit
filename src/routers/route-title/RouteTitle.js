( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'underscore',
                'backbone'
            ],
            function( _, Backbone ) {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.RouteTitleMixin = factory( root, {}, _, Backbone ) );
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
        root.ExoSuit.Mixins.RouteTitleMixin = factory( root, {}, root._, root.Backbone );
    }
}( this, function( root, RouteTitleMixin, _ ) {
    "use strict";

    RouteTitleMixin = function() {
        // Cache current mixin methods to use later
        var oldExecute = this.execute,
            oldSetTitle = this.setTitle;

        // Patch route function to pass the name of route callback function to execute like it does on the current master branch of backbone
        // Only patch if execute has 2 function parameters ( might not be best way ) which should mean route hasnt been overwritten yet to support name argument
        // Remove if later Backbone release supports changes in master
        if ( oldExecute.length === 2 ) {
            this.route = function( route, name, callback ) {
                if ( !_.isRegExp( route ) ) { route = this._routeToRegExp(route); }
                if ( _.isFunction( name ) ) {
                    callback = name;
                    name = '';
                }
                if ( !callback ) { callback = this[ name ]; }
                var router = this;
                Backbone.history.route( route, function( fragment ) {
                    var args = router._extractParameters( route, fragment );
                    if ( router.execute( callback, args, name ) !== false ) {
                        router.trigger.apply( router, [ 'route:' + name ].concat( args ) );
                        router.trigger( 'route', name, args );
                        Backbone.history.trigger( 'route', router, name, args );
                    }
                });
                return this;
            };
        }

        // Set defaults if properties arent set
        this.titlePrefix = this.titlePrefix || "";
        this.defaultTitle = this.defaultTitle || "";

        // Override execute method
        this.execute = function( callback, args, name ) {
            var title = "";

            // If this.routeConfig is an object and has matching route callback name with title property
            if ( this.routeConfig && this.routeConfig[ name ] && this.routeConfig[ name ].title ) {
                title = this.routeConfig[ name ].title;
            }

            // If no title is set, set to default title
            if ( !title ) {
                title = this.defaultTitle;
            }

            // If title and its a function, get return value of the function
            if ( title && _.isFunction( title ) ) {
                title = title();
            }

            // Run existing execute function i.e. run route callback
            if ( oldExecute.apply( this, arguments ) !== false ) {
                // Set title if callback doesnt return false
                this.setTitle( title );
            }
        };

        // Set document title
        this.setTitle = oldSetTitle || function( title ) {
            document.title = this.titlePrefix + title;
        };
    };

    return RouteTitleMixin;
} ));
