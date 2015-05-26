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
                return ( root.ExoSuit = factory( root, _, Backbone, ( root.ExoSuit || {} ) ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var _ = require( 'underscore' ),
            Backbone = require( 'backbone' );

        module.exports = factory( root, _, Backbone, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = factory( root, root._, root.Backbone, ( root.ExoSuit || {} ) );
    }
}( this, function( root, _, Backbone, ExoSuit ) {
    "use strict";
    function newExtend( protoProps, classProps ) {
        /*jshint validthis:true */
        var oldExtend = Backbone.Model.extend,
            child,
            copyProto = _.extend( {}, protoProps ),
            mixins;

        if ( protoProps && protoProps.mixins ) {
            mixins = protoProps.mixins;
            delete copyProto.mixins;
        }
        child = oldExtend.call( this, copyProto, classProps );

        if ( mixins ) {
            _.each( mixins, function( mixin ) {
                if ( _.isFunction( mixin ) ) {
                    mixin.call( child.prototype );
                }
            } );
        }

        child.extend = newExtend;
        return child;
    }

    function extendModule( module ) {
        var extended = module.extend();
        extended.extend = newExtend;
        return extended;
    }

    ExoSuit.Model = extendModule( Backbone.Model );
    ExoSuit.Collection = extendModule( Backbone.Collection );
    ExoSuit.View = extendModule( Backbone.View );
    ExoSuit.Router = extendModule( Backbone.Router );
    ExoSuit.MixinExtend = newExtend;

    return ExoSuit;
} ));
