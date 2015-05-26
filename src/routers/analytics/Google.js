( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    /* istanbul ignore next */
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone'
            ],
            function( Backbone ) {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.GoogleAnalyticsRouteMixin = factory( root, {}, Backbone ) );
            }
        );
    // This is a Client side mixin only so no Node.js or CommonJS.
    // Finally, as a browser global.
    } else if ( typeof exports === 'undefined' ) {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.GoogleAnalyticsRouteMixin = factory( root, {}, root.Backbone );
    }
}( this, function( root, GoogleAnalyticsRouteMixin, Backbone ) {
    "use strict";

    GoogleAnalyticsRouteMixin = function() {
        // Cache current mixin methods to use later
        var oldExecute = this.execute;

        this.execute = function( callback, args, name ) {
            var url = Backbone.history.getFragment();

            if ( oldExecute.apply( this, arguments ) !== false ) {
                if ( !/^\//.test( url ) ) {
                    url = "/" + url;
                }

                // ga.js
                if ( typeof window._gaq !== 'undefined' ) {
                    window._gaq.push( [ '_trackPageview', url ] );
                }

                // analytics.js
                if ( typeof window.GoogleAnalyticsObject !== 'undefined' ) {
                    window[ window.GoogleAnalyticsObject ]( 'send', 'pageview', url );
                }
            }
        };
    };

    return GoogleAnalyticsRouteMixin;
} ));
