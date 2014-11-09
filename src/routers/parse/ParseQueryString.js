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
                return ( root.ExoSuit.Mixins.ParseQueryStringMixin = factory( root, {}, _ ) );
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
        root.ExoSuit.Mixins.ParseQueryStringMixin = factory( root, {}, root._ );
    }
}( this, function( root, ParseQueryStringMixin, _ ) {
    "use strict";

    ParseQueryStringMixin = function() {
        // Cache current mixin methods to use later
        var oldExecute = this.execute;

        this._parseQueryString = function( querystring ) {
            var params = {};

            if ( typeof querystring !== 'string' ) {
                return params;
            }

            querystring = querystring.split( '&' );

            return _.reduce( querystring, function( mem, param ) {
                var key, value;

                param = param.replace( /\+/g, ' ' ).split( '=' );
                key = decodeURIComponent( param[ 0 ] );
                value = typeof param[ 1 ] !== 'undefined' ? decodeURIComponent( param[ 1 ] ) : null;

                if ( _.isArray( mem[ key ] ) ) {
                    mem[ key ].push( value );
                } else if ( mem[ key ] ) {
                    mem[ key ] = [ mem[ key ], value ];
                } else {
                    mem[ key ] = value;
                }

                return mem;
            }, params );
        };

        this.execute = function( callback, args, name ) {
            // Get querystring from args array and push them back on as param object
            args.push( this._parseQueryString( args.pop() ) );

            // Run existing execute function i.e. run route callback
            oldExecute.apply( this, arguments );
        };
    };

    return ParseQueryStringMixin;
} ));
