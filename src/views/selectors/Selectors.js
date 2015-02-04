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
                return ( root.ExoSuit.Mixins.SelectorMixin = factory( root, {}, _ ) );
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
        root.ExoSuit.Mixins.SelectorMixin = factory( root, {}, root._ );
    }
}( this, function( root, SelectorMixin, _ ) {
    "use strict";
    SelectorMixin = function() {
        // Cache current mixin methods to use later
        var oldInitialize = this.initialize,
            oldDelegateEvents = this.delegateEvents,
            oldRemove = this.remove;

        // Override constructor
        this.initialize = function() {
            // Create empty cached selectors object
            this._selectors = {};
            // Call Backbone View initialization
            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        // Extend delegateEvents function to cater for selector keys
        this.delegateEvents = function( events ) {
            var match, eventName, selector, newSelector;

            if ( !( events || ( events = _.result( this, 'events' ) ) ) ) {
                return this;
            }

            // Loop over events
            for ( var key in events ) {
                // Split event and selector out from key
                match = key.match( /^(\S+)\s*(.*)$/ );
                eventName = match[ 1 ];
                selector = match[ 2 ];
                // If selector is a selector key
                if ( this.hasSelector( selector ) ) {
                    // Get the selector for the key and use that for delegate selector
                    newSelector = this.selectors[ selector ];
                    // Replace current key in events object with correct selector from selectors list
                    events[ eventName + " " + newSelector ] = events[ key ];
                    // Delete old event with selector name as no longer needed
                    delete events[ key ];
                }
            }

            // Call mixin (i.e. Backbone) delegateEvents function
            return oldDelegateEvents.call( this, events );
        };

        // Get a selector from the view and cache it for later use
        // If cached already, return cached selector
        //
        // Selectors should be on this.selectors which is a hash of
        //
        // * { "key" : "selector" } *
        //
        // {
        //      "usernameField" : ".username",
        //      "passwordField" : ".password"
        // }
        //
        // pairs.
        // Returns undefined if no key supplied or selector for given key.
        this.get = function( key, refresh ) {
            // Manual refresh of selector flag
            refresh = refresh || false;
            var element;

            // If not manual refresh
            // and is already cached selector
            // and cached selector is still in the DOM within the view
            if ( !refresh && this.isCachedSelector( key ) && this._selectors[ key ].closest( this.$el ).length > 0 ) {
                // Use cached selector
                element = this._selectors[ key ];
            // Else if key has a selector defined
            } else if ( this.hasSelector( key ) ) {
                // Get selector and cache it
                element = this._selectors[ key ] = this.$( this.selectors[ key ] );
                if ( element.length === 0 ) {
                    delete this._selectors[ key ];
                    element = null;
                }
            }

            // Return reference to selector
            return element;
        };

        // Check if a selector key has a selector defined in the view
        this.hasSelector = function( key ) {
            return _.has( this.selectors, key );
        };

        // Check if a selector key has a valid selector in the view
        this.isValidSelector = function( key ) {
            return this.$( this.selectors[ key ] ).length > 0;
        };

        // Check if a selector key has already been cached
        this.isCachedSelector = function( key ) {
            return _.has( this._selectors, key );
        };

        // Clear a selector from cache or clear all cached references if no key is passed
        this.clearSelector = function( key ) {
            // If key has been supplied
            if ( key ) {
                // Is key cached
                if ( this.isCachedSelector( key ) ) {
                    // Remove cached key from list
                    delete this._selectors[ key ];
                }
            } else {
                // Reset cache object to empty object to remove all cached selectors
                this._selectors = {};
            }
        };

        // Clear selectors when view is removed to prevent any memory leaks
        this.remove = function() {
            this.clearSelector();
            return oldRemove.apply( this, arguments );
        };
    };

    return SelectorMixin;
} ));
