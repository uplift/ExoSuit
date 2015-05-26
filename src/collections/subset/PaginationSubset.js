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
                return ( root.ExoSuit.Mixins.PaginationSubsetMixin = factory( root, _, Backbone, {} ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var _ = require( 'underscore' );
        var Backbone = require( 'backbone' );
        module.exports = factory( root, _, Backbone, exports );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.PaginationSubsetMixin = factory( root, root._, root.Backbone, {} );
    }
}( this, function( root, _, Backbone, PaginationSubsetMixin ) {
    "use strict";
    PaginationSubsetMixin = function() {
        // Cache current mixin methods to use later
        var oldInitialize = this.initialize,
            oldPagingState = ( this.pagingState || {} ),
            // Set default paging state
            pagingState = {
                currentPage: 1,
                perPage: 10
            };

        this.updateOnAdd = typeof this.updateOnAdd === "boolean" ? this.updateOnAdd : true;
        this.updateOnRemove = typeof this.updateOnRemove === "boolean" ? this.updateOnRemove : true;

        this.initialize = function( models, options ) {
            options = options || {};
            this.pagingState = new Backbone.Model();

            if ( options.parent ) {
                this.parent = options.parent;
            }

            if ( !this.parent ) {
                throw new Error( "Parent collection is required to use subset collection" );
            }

            this.model = this.parent.model;
            // Passing any state options through to set state
            this._setState( options.pagingState );

            this.listenTo( this.parent, {
                add: this.__add,
                remove: this.__remove,
                reset: this.__reset,
                sort: this.__sort
            } );

            this.__reset( this._getParentModels() );

            if ( oldInitialize ) {
                oldInitialize.apply( this, arguments );
            }
        };

        this._getParentModels = function() {
            if ( !this.parent ) {
                return;
            }

            var currentPage = this.pagingState.get( "currentPage" ),
                perPage = this.pagingState.get( "perPage" ),
                pageStart = ( currentPage - 1 ) * perPage,
                pageLimit = pageStart + perPage;

            return this.parent.slice( pageStart, pageLimit );
        };

        this.__add = function( model, collection, options ) {
            options = options || {};

            this.pagingState.set( "total", this.parent.length );

            if ( this.updateOnAdd ) {
                var currentPage = this.pagingState.get( "currentPage" ),
                    perPage = this.pagingState.get( "perPage" ),
                    pageStart = ( currentPage - 1 ) * perPage,
                    pageLimit = pageStart + perPage,
                    modelIndex = this.parent.indexOf( model );

                if ( modelIndex >= pageStart && modelIndex <= pageLimit ) {
                    if ( !this.comparator ) {
                        options.at = modelIndex - pageStart;
                    }
                    this.add( model, options );
                    if ( this.length > perPage ) {
                        this.remove( this.last() );
                    }
                }
            }
        };

        this.__remove = function( model, collection, options ) {
            options = options || {};

            this.pagingState.set( "total", this.parent.length );

            if ( this.updateOnRemove ) {
                var currentPage = this.pagingState.get( "currentPage" ),
                    perPage = this.pagingState.get( "perPage" ),
                    hasNext = this.hasNext(),
                    startPage;

                if ( this.contains( model ) ) {
                    this.remove( model, options );
                    // If next page available, get first model from that page to replace removed model
                    if ( hasNext ) {
                        var nextModelIndex = ( currentPage * perPage ) - 1;
                        this.add( this.parent.at( nextModelIndex ), options );
                    }
                    // If no more models in subset, then go to last page
                    if ( this.length === 0 ) {
                        this.lastPage();
                    }
                } else {
                    startPage = ( currentPage - 1 ) * perPage;

                    // If total is less or equal to start page, then go to last page
                    if ( this.getMaxPages() < currentPage ) {
                        this.lastPage();
                    // If removed model is lower index than subset models, reshow data on the page
                    } else if ( this.parent.indexOf( this.at( 0 ) ) !== startPage ) {
                        this.reset( this._getParentModels() );
                    }
                }
            }
        };

        this.__reset = function() {
            this.pagingState.set( "total", this.parent.length );
            this.reset( this._getParentModels() );
        };

        this.__sort = function() {
            this.reset( this._getParentModels() );
        };

        // Set state object on instance
        this._setState = function( state ) {
            // Check if any state is passed
            state = state || {};
            // Set instance state, passed in state overrides extended state which overrides default state
            this.pagingState.set( _.extend( {}, pagingState, oldPagingState, state ) );
        };

        // Set number of models shown per page
        this.howManyPerPage = function( perPage ) {
            // Make sure passed in argument is a number
            if ( typeof perPage !== 'number' || parseInt( perPage, 10 ) !== perPage ) {
                throw new Error( 'Per page must be a number' );
            }

            // Set state
            this.pagingState.set( "perPage", perPage );

            // Auto refresh page data with new state
            this.goTo( this.pagingState.get( "currentPage" ) );
        };

        // Does collection have any previous models from current state
        this.hasPrevious = function() {
            return this.pagingState.get( "currentPage" ) > 1;
        };

        // Does collection have any more models from current state
        this.hasNext = function() {
            return this.pagingState.get( "currentPage" ) < this.getMaxPages();
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

        // Get the max number of pages for the current collection size and state
        this.getMaxPages = function() {
            return Math.ceil( this.pagingState.get( "total" ) / this.pagingState.get( "perPage" ) );
        };

        // Go to a specific page in the collection
        this.goTo = function( page ) {
            var collection = this,
                currentPage = this.pagingState.get( "currentPage" ),
                // Total number of pages for collection size
                totalPages = this.getMaxPages(),
                // Shortcut keywords
                pageTypes = {
                    "previous": function() {
                        var page = collection.hasPrevious() ? currentPage - 1 : 1;
                        return page;
                    },
                    "next": function() {
                        var page = collection.hasNext() ? currentPage + 1 : currentPage;
                        return page;
                    },
                    "first": function() {
                        return 1;
                    },
                    "last": function() {
                        return totalPages;
                    }
                };

            // If page is a number
            if ( typeof page === 'number' ) {
                // Round number incase of float
                page = Math.round( page );
                // No negative numbers allowed, reset to 1
                if ( page < 1 ) {
                    page = 1;
                }
                // Cant be bigger than max page number, reset to max page number
                if ( page > totalPages ) {
                    page = totalPages;
                }
                // Set current page
                currentPage = page;
            } else {
                // If page is no a number and doesn't exist in pageTypes shortcut keywords
                if ( !pageTypes[ page ] ) {
                    // Set to first page
                    page = "first";
                }
                // Set current page
                currentPage = pageTypes[ page ]();
            }

            // Trigger event for state change
            this.pagingState.set( "currentPage", currentPage );

            // Get models for current page state
            this.reset( this._getParentModels() );
        };
    };

    return PaginationSubsetMixin;
} ));
