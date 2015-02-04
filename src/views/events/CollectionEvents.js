( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            function() {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.CollectionEventsMixin = factory( root, {} ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        module.exports = factory( root, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.CollectionEventsMixin = factory( root, {} );
    }
}( this, function( root, CollectionEventsMixin ) {
    "use strict";
    CollectionEventsMixin = function() {
        var oldInitialize = this.initialize,
            oldDelegateEvents = this.delegateEvents,
            oldUndelegateEvents = this.undelegateEvents;

        this.initialize = function( options ) {
            options = options || {};

            if ( options.collectionEvents ) {
                this.collectionEvents = options.collectionEvents;
            }

            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        this.delegateEvents = function( events ) {
            oldDelegateEvents.call( this, arguments );
            this.bindCollectionEvents();
            return this;
        };

        this.undelegateEvents = function( events ) {
            oldUndelegateEvents.call( this, arguments );
            this.unbindCollectionEvents();
            return this;
        };

        this.bindCollectionEvents = function() {
            if ( !this.collection || !this.collectionEvents ) {
                return;
            }

            for ( var collectionEvent in this.collectionEvents ) {
                var callback;
                if ( typeof this.collectionEvents[ collectionEvent ] === 'string' && typeof this[ this.collectionEvents[ collectionEvent ] ] === 'function' ) {
                    callback = this[ this.collectionEvents[ collectionEvent ] ];
                }
                if ( typeof this.collectionEvents[ collectionEvent ] === 'function' ) {
                    callback = this.collectionEvents[ collectionEvent ];
                }
                if ( callback ) {
                    this.listenTo( this.collection, collectionEvent, callback );
                }
            }
        };

        this.unbindCollectionEvents = function() {
            if ( !this.collection || !this.collectionEvents ) {
                return;
            }

            for ( var collectionEvent in this.collectionEvents ) {
                var callback;
                if ( typeof this.collectionEvents[ collectionEvent ] === 'string' && typeof this[ this.collectionEvents[ collectionEvent ] ] === 'function' ) {
                    callback = this[ this.collectionEvents[ collectionEvent ] ];
                }
                if ( typeof this.collectionEvents[ collectionEvent ] === 'function' ) {
                    callback = this.collectionEvents[ collectionEvent ];
                }
                if ( callback ) {
                    this.stopListening( this.collection, collectionEvent, callback );
                }
            }
        };
    };

    return CollectionEventsMixin;
} ));
