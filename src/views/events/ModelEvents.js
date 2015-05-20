( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            function() {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.ModelEventsMixin = factory( root, {} ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        module.exports = factory( root, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.ModelEventsMixin = factory( root, {} );
    }
}( this, function( root, ModelEventsMixin ) {
    "use strict";
    ModelEventsMixin = function() {
        var oldInitialize = this.initialize,
            oldDelegateEvents = this.delegateEvents,
            oldUndelegateEvents = this.undelegateEvents;

        this.initialize = function( options ) {
            options = options || {};

            if ( options.modelEvents ) {
                this.modelEvents = options.modelEvents;
                // Backbone 1.2.0 stopped calling delegateEvents after initialize so need to bindModelEvents now
                this.bindModelEvents();
            }

            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        this.delegateEvents = function( events ) {
            oldDelegateEvents.call( this, arguments );
            this.bindModelEvents();
            return this;
        };

        this.undelegateEvents = function( events ) {
            oldUndelegateEvents.call( this, arguments );
            this.unbindModelEvents();
            return this;
        };

        this.bindModelEvents = function() {
            if ( !this.model || !this.modelEvents ) {
                return;
            }

            for ( var modelEvent in this.modelEvents ) {
                var callback;
                if ( typeof this.modelEvents[ modelEvent ] === 'string' && typeof this[ this.modelEvents[ modelEvent ] ] === 'function' ) {
                    callback = this[ this.modelEvents[ modelEvent ] ];
                }
                if ( typeof this.modelEvents[ modelEvent ] === 'function' ) {
                    callback = this.modelEvents[ modelEvent ];
                }
                if ( callback ) {
                    this.listenTo( this.model, modelEvent, callback );
                }
            }
        };

        this.unbindModelEvents = function() {
            if ( !this.model || !this.modelEvents ) {
                return;
            }

            for ( var modelEvent in this.modelEvents ) {
                var callback;
                if ( typeof this.modelEvents[ modelEvent ] === 'string' && typeof this[ this.modelEvents[ modelEvent ] ] === 'function' ) {
                    callback = this[ this.modelEvents[ modelEvent ] ];
                }
                if ( typeof this.modelEvents[ modelEvent ] === 'function' ) {
                    callback = this.modelEvents[ modelEvent ];
                }
                if ( callback ) {
                    this.stopListening( this.model, modelEvent, callback );
                }
            }
        };
    };

    return ModelEventsMixin;
} ));
