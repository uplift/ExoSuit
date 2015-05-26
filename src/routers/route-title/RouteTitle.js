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

        // Set defaults if properties arent set
        this.titlePrefix = this.titlePrefix || "";
        this.titleSuffix = this.titleSuffix || "";
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
                title = title.apply( this );
            }

            // Run existing execute function i.e. run route callback
            if ( oldExecute.apply( this, arguments ) !== false ) {
                // Set title if callback doesnt return false
                this.setTitle( title );
            }
        };

        // Set document title
        this.setTitle = oldSetTitle || function( title ) {
            document.title = this.titlePrefix + title + this.titleSuffix;
        };
    };

    return RouteTitleMixin;
} ));
