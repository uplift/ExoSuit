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
                return ( root.ExoSuit.Mixins.ClientPaginationMixin = factory( root, {}, _ ) );
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
        root.ExoSuit.Mixins.ClientPaginationMixin = factory( root, {}, root._ );
    }
}( this, function( root, ClientPaginationMixin, _ ) {
    "use strict";
    ClientPaginationMixin = function() {
        // Cache current mixin methods to use later
        var oldInitialize = this.initialize,
            oldPagingState = ( this.pagingState || {} ),
            // Set default paging state
            pagingState = {
                currentPage: 0,
                perPage: 10
            };

        // Override initialize
        this.initialize = function( models, options ) {
            // Passing any state options through to set state
            this._setState( options.pagingState );
            // If old initialize method, run here
            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        // Set state object on instance
        this._setState = function( state ) {
            // Check if any state is passed
            state = state || {};
            // Set instance state, passed in state overrides extended state which overrides default state
            this.pagingState = _.extend( {}, pagingState, oldPagingState, state );
        };

        // Set number of models shown per page
        this.howManyPerPage = function( perPage ) {
            // Make sure passed in argument is a number
            if ( typeof perPage !== 'number' || parseInt( perPage, 10 ) !== perPage ) {
                throw new Error( 'Per page must be a number' );
            }

            // Set state
            this.pagingState.perPage = perPage;

            // Auto refresh page date with new state
            return this.goTo( this.pagingState.currentPage );
        };

        // Does collection have any previous models from current state
        this.hasPrevious = function() {
            return this.pagingState.currentPage > 0;
        };

        // Does collection have any more models from current state
        this.hasNext = function() {
            return ( this.pagingState.currentPage + 1 ) < Math.ceil( this.length / this.pagingState.perPage );
        };

        // Shortcut to go to first page
        this.firstPage = function() {
            return this.goTo( "first" );
        };

        // Shortcut to go to last page
        this.lastPage = function() {
            return this.goTo( "last" );
        };

        // Shortcut to go to previous page
        this.previousPage = function() {
            return this.goTo( "previous" );
        };

        // Shortcut to go to next page
        this.nextPage = function() {
            return this.goTo( "next" );
        };

        // Go to a specific page in the collection
        this.goTo = function( page ) {
            var collection = this,
                // Get collection paging state
                state = this.pagingState,
                currentPage = state.currentPage,
                pageLimit = state.perPage,
                total = this.length,
                // Total number of pages for collection size
                totalPages = Math.ceil( total / pageLimit ) - 1,
                // Shortcut keywords
                pageTypes = {
                    "previous": function() {
                        var page = collection.hasPrevious() ? currentPage - 1 : 0;
                        return page;
                    },
                    "next": function() {
                        var page = collection.hasNext() ? currentPage + 1 : currentPage;
                        return page;
                    },
                    "first": function() {
                        return 0;
                    },
                    "last": function() {
                        return totalPages;
                    }
                };

            // If page is a number
            if ( typeof page === 'number' ) {
                // Round number incase of float
                page = Math.round( page );
                // No negative numbers allowed, reset to 0
                if ( page < 0 ) {
                    page = 0;
                }
                // Cant be bigger than max page number, reset to max page number
                if ( page > totalPages ) {
                    page = totalPages;
                }
                // Set current page
                this.pagingState.currentPage = currentPage = page;
            } else {
                // If page is no a number and doesn't exist in pageTypes shortcut keywords
                if ( !pageTypes[ page ] ) {
                    // Set to first page
                    page = "first";
                }
                // Set current page
                this.pagingState.currentPage = currentPage = pageTypes[ page ]();
            }

            // Return data (not models) from current page to page limit
            return _.map( this.slice( ( currentPage * pageLimit ), ( currentPage * pageLimit ) + pageLimit ), function( model ) {
                return model.toJSON();
            } );
        };
    };

    return ClientPaginationMixin;
} ));
