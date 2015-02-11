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
                return ( root.ExoSuit.Mixins.ViewSwitcherMixin = factory( root, _, {} ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var _ = require( 'underscore' );

        module.exports = factory( root, _, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.ViewSwitcherMixin = factory( root, root._, {} );
    }
}( this, function( root, _, ViewSwitcherMixin ) {
    "use strict";
    ViewSwitcherMixin = function() {
        // Cache current mixin methods to use later
        var oldInitialize = this.initialize,
            oldRender = this.render,
            oldRemove = this.remove;

        // Override constructor
        this.initialize = function( options ) {
            options = options || {};

            // Initialize object to hold managed views
            this._views = {};

            // If any views declared in the module definition, then add them to container view
            if ( this.views ) {
                this.addView( this.views );
            }

            // If any views declared in options arguments, then add them to container view
            if ( options.views ) {
                this.addView( options.views );
            }

            // Call Backbone View initialization
            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        this.render = function() {
            // If an initial view is added, then switch to that view
            if ( this.getView( "initial" ) ) {
                this.switchView( "initial" );
            }

            // Call existing render method
            if ( oldRender ) {
                oldRender.apply( this, arguments );
            }

            // Return object for chaining
            return this;
        };

        this.switchView = function( id ) {
            // Get new view
            var newView = this.getView( id );

            // If there is a current view
            if ( this.currentView ) {
                // If new view matches current view then return as nothing to do
                if ( newView.cid === this.currentView.cid ) {
                    return this;
                }
                // Remove old view (only the DOM nodes, events are kept until view is removed from container or container is removed)
                this.currentView.$el.remove();
            }

            // Set new view as current view
            this.currentView = newView;
            // Render new view
            this.currentView.render();
            // Redelegate view events
            this.currentView.delegateEvents();
            // Render new view to container view
            this.$el.html( this.currentView.$el );
            // Return container view
            return this;
        };

        // Get managed view by id
        this.getView = function( id ) {
            if ( typeof this._views[ id ] === 'string' ) {
                return this._views[ this._views[ id ] ];
            }
            return this._views[ id ];
        };

        // Add managed view
        // Add one view with id, view arguments
        // or multiple views with id as a hash of id: view pairs
        this.addView = function( id, view ) {
            if ( typeof id === 'undefined' ) {
                return;
            }

            var views = id;

            if ( typeof id !== "object" ) {
                views = {};
                views[ id ] = view;
            }

            for ( view in views ) {
                this._views[ view ] = views[ view ];
                if ( typeof this._views[ view ] !== 'string' ) {
                    this.addProxyEvent( this._views[ view ] );
                }
            }
        };

        // Proxy events from managed views through the container view
        this.addProxyEvent = function( view ) {
            if ( typeof view === 'undefined' ) {
                return;
            }

            this.listenTo( view, "all", function() {
                this.trigger.apply( this, arguments );
            }, this );
        };

        // Remove managed view
        // Remove one view with id arguments
        // or multiple views with id as a hash of id: view pairs
        this.removeView = function( id ) {
            if ( typeof id === 'undefined' ) {
                return;
            }

            var views = id, view;

            if ( typeof id === "string" ) {
                views = [];
                views.push( id );
            }

            for ( var i = 0, len = views.length; i < len; i++ ) {
                view = this._views[ views[ i ] ];
                if ( typeof view !== 'undefined' ) {
                    if ( typeof view !== 'string' ) {
                        this.removeProxyEvent( view );
                        view.remove();
                    }
                    delete this._views[ views[ i ] ];
                }
            }
        };

        // Remove any bound proxy events
        this.removeProxyEvent = function( view ) {
            if ( typeof view === 'undefined' ) {
                return;
            }

            this.stopListening( view, "all" );
        };

        // Remove all managed views when removing this view
        this.remove = function() {
            this.removeView( _.keys( this._views ) );
            // Call super remove method
            oldRemove.apply( this, arguments );
        };
    };

    return ViewSwitcherMixin;
} ));
