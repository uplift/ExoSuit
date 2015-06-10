( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    /* istanbul ignore next */
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'underscore',
                'bootstrap'
            ],
            function( _ ) {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.BootstrapModalMixin = factory( root, _, {} ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        require( 'bootstrap' );
        var _ = require( 'underscore' );

        module.exports = factory( root, _, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.BootstrapModalMixin = factory( root, root._, {} );
    }
}( this, function( root, _, ModalMixin ) {
    "use strict";
    ModalMixin = function() {
        var oldInitialize = this.initialize;
        var oldRemove = this.remove;

        this.bootstrapOptions = this.bootstrapOptions || {};

        this.initialize = function( options ) {
            options = options || {};

            if ( options.bootstrapOptions ) {
                this.bootstrapOptions = options.bootstrapOptions;
            }

            this.$el.modal( _.extend( this.bootstrapOptions, { show: options.autoShow ? true : false } ) );

            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        this.open = function() {
            this.$el.modal( 'show' );
        };

        this.close = function() {
            this.$el.modal( 'hide' );
        };

        this.toggle = function() {
            this.$el.modal( 'toggle' );
        };

        this.remove = function() {
            this.close();
            oldRemove.apply( this, arguments );
        };
    };

    return ModalMixin;
} ));
