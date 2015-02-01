(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'collections/subset/PaginationSubset'
            ],
            function( Backbone, PaginationSubsetMixin ) {
                factory( Backbone, root.sinon, root.expect, PaginationSubsetMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var sinon = require( 'sinon' );
        var PaginationSubsetMixin = require( '../../../../src/collections/subset/PaginationSubset' );
        factory( Backbone, sinon, expect, PaginationSubsetMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.sinon, root.expect, root.ExoSuit.Mixins.PaginationSubsetMixin );
    }
}( this, function( Backbone, sinon, expect, PaginationSubsetMixin ) {
    describe('Pagination Subset Collection Mixin', function () {
        var collection, model, fullCollection, PagingCollection, oldMethodStub, stub;

        describe('initialize()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend();
                oldMethodStub = sinon.stub( PagingCollection.prototype, "initialize" );
                PaginationSubsetMixin.call( PagingCollection.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if( stub ) {
                    stub.restore();
                }
            });

            it('should call the super initialize method', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should throw error if no parent collection is given', function() {
                expect( function() { new PagingCollection() } ).to.throw( 'Parent collection is required to use subset collection' );
            });

            it('should set the parent of the collection to the parent collection', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                expect( collection.parent ).to.equal( fullCollection );
            });

            it('should set the model of the collection to the parent collection model', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                expect( collection.parent.model ).to.equal( fullCollection.model );
            });

            it('should call _setState method passing any pagingState options in the options argument', function() {
                stub = sinon.stub( PagingCollection.prototype, "_setState" );
                collection = new PagingCollection( null, {
                    parent: fullCollection,
                    pagingState: {
                        perPage: 2
                    }
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( { perPage : 2 } ) ).to.be.true;
            });

            it('should set up listeners to the parent collection', function() {
                stub = sinon.stub( PagingCollection.prototype, "listenTo" );
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( collection.parent, {
                    add: collection.__add,
                    remove: collection.__remove,
                    reset: collection.__reset,
                    sort: collection.__sort
                } ) ).to.be.true;
            });

            it('should call __reset method', function() {
                stub = sinon.stub( PagingCollection.prototype, "__reset" );
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });
        });

        describe('_getParentModels()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection([
                    {
                        id: 1
                    },
                    {
                        id: 2
                    },
                    {
                        id: 3
                    },
                    {
                        id: 4
                    },
                    {
                        id: 5
                    }
                ], {
                    model: Backbone.Model
                });
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend();
                PaginationSubsetMixin.call( PagingCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should return undefined if no parent is set', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                collection.parent = null;
                expect( collection._getParentModels() ).to.be.undefined;
            });

            it('should get first page of models', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection,
                    pagingState: {
                        perPage: 2
                    }
                });
                expect( collection._getParentModels().length ).to.equal( 2 );
            });
        });

        describe('__add()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection([
                    {
                        id: 1
                    },
                    {
                        id: 3
                    },
                    {
                        id: 4
                    },
                    {
                        id: 5
                    }
                ], {
                    model: Backbone.Model
                });
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should update total for the subsets collection paging state', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                fullCollection.add({
                    id: 2
                });
                expect( collection.pagingState.get( "total" ) ).to.equal( 5 );
            });

            it('should not add model to subset if updateOnAdd flag is false', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                collection.updateOnAdd = false;
                stub = sinon.stub( collection, "add" );
                collection.__add( {
                    id : 2
                }, collection );
                expect( stub.called ).to.be.false;
            });

            it('should not add model to subset if model index is not within paging state', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "add" );
                collection.__add( {
                    id : 5
                }, collection );
                expect( stub.called ).to.be.false;
            });

            it('should add model to subset if model index is within paging state', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "add" );
                collection.__add( fullCollection.at( 0 ), collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fullCollection.at( 0 ), { at : 0 } ) ).to.be.true;
                collection.pagingState.set( "currentPage" , 2 );
                collection.__add( fullCollection.at( 3 ), collection );
                expect( stub.callCount ).to.equal( 2 );
                expect( stub.calledWith( fullCollection.at( 3 ), { at : 1 } ) ).to.be.true;
            });

            it('should remove the last model from the subset if the subset length is bigger than the perPage paging state', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "remove" );
                fullCollection.add( { id : 2 }, { at : 1 } );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fullCollection.at( 2 ) ) ).to.be.true;
            });
        });

        describe('__remove()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection([
                    {
                        id: 1
                    },
                    {
                        id: 2
                    },
                    {
                        id: 3
                    },
                    {
                        id: 4
                    },
                    {
                        id: 5
                    }
                ], {
                    model: Backbone.Model
                });
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should update total for the subsets collection paging state', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                fullCollection.remove( fullCollection.at( 3 ) );
                expect( collection.pagingState.get( "total" ) ).to.equal( 4 );
            });

            it('should not add model to subset if updateOnRemove flag is false', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                collection.updateOnRemove = false;
                stub = sinon.stub( collection, "remove" );
                collection.__remove( fullCollection.at( 0 ), collection );
                expect( stub.called ).to.be.false;
            });

            it('should call remove for a model that is contained within the subset collection', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "remove" );
                collection.__remove( fullCollection.at( 3 ), collection );
                expect( stub.called ).to.be.false;
                collection.__remove( fullCollection.at( 0 ), collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fullCollection.at( 0 ) ) ).to.be.true;
            });

            it('should add a model to replace the remove model if there is a next page of models', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "add" );
                fullCollection.remove( fullCollection.at( 0 ) );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fullCollection.at( 1 ) ) ).to.be.true;
            });

            it('should reset to last page if no models are left in the subset collection', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "lastPage" );
                collection.pagingState.set( "currentPage", 3 );
                fullCollection.remove( fullCollection.at( 4 ) );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should reset to last page if the current page no longer exists after a model outside the subset is removed', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "lastPage" );
                collection.pagingState.set( "currentPage", 3 );
                fullCollection.remove( fullCollection.at( 3 ) );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should reset the models in the subset if a removed model on a lower page should change the data within the subset', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection,
                    pagingState: {
                        currentPage: 2
                    }
                });
                stub = sinon.stub( collection, "reset" );
                fullCollection.remove( fullCollection.at( 0 ) );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( collection._getParentModels() ) ).to.be.true;
            });
        });

        describe('__reset()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should set the paging state total to the length of the parent collection', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                collection.__reset();
                expect( collection.pagingState.get( "total" ) ).to.equal( 5 );
            });

            it('should call reset function with result of parent models', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( PagingCollection.prototype, "reset" );
                collection.__reset();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( collection._getParentModels() ) ).to.be.true;
            });
        });

        describe('__sort()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should call reset function with result of parent models', function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( PagingCollection.prototype, "reset" );
                collection.__reset();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( collection._getParentModels() ) ).to.be.true;
            });
        });


        describe('_setState()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should set to state argument as the collection pagingState', function() {
                collection._setState( { currentPage : 5, perPage : 25 } );
                expect( collection.pagingState.get( "currentPage" ) ).to.be.equal( 5 );
                expect( collection.pagingState.get( "perPage" ) ).to.be.equal( 25 );
            });
        });

        describe('howManyPerPage()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "goTo" ).returns( [ { "hello": "world" }, { "hello": "earth" } ] );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it("should set the per page state to the value passed in", function () {
                collection.howManyPerPage( 10 );
                expect( collection.pagingState.get( "perPage" ) ).to.equal( 10 );
                collection.howManyPerPage( 25 );
                expect( collection.pagingState.get( "perPage" ) ).to.equal( 25 );
                collection.howManyPerPage( 50 );
                expect( collection.pagingState.get( "perPage" ) ).to.equal( 50 );
            });

            it("should throw an error if perPage argument isn't a number", function () {
                expect( function() { collection.howManyPerPage( "25" ); } ).to.throw( /Per page must be a number/ );
                expect( function() { collection.howManyPerPage( undefined ); } ).to.throw( /Per page must be a number/ );
                expect( function() { collection.howManyPerPage( null ); } ).to.throw( /Per page must be a number/ );
                expect( function() { collection.howManyPerPage( true ); } ).to.throw( /Per page must be a number/ );
                expect( function() { collection.howManyPerPage( 2.5 ); } ).to.throw( /Per page must be a number/ );
            });

            it("should call goTo with current page state", function () {
                collection.howManyPerPage( 25 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( 1 ) ).to.be.true;
            });

            it("should trigger an event with perPage value", function ( done ) {
                collection.pagingState.on( "change:perPage", function( model ) {
                    expect( model.get( "perPage" ) ).to.equal( 5 );
                    done();
                });
                collection.howManyPerPage( 5 );
            });
        });

        describe('hasPrevious()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it("should have previous if current page is bigger than one", function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                collection.pagingState.set( "currentPage", 2 );
                expect( collection.hasPrevious() ).to.be.true;
                collection.pagingState.set( "currentPage", 50 );
                expect( collection.hasPrevious() ).to.be.true;
            });

            it("should not have previous if current page is one or lower", function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                collection.pagingState.set( "currentPage", 1 );
                expect( collection.hasPrevious() ).to.be.false;
                collection.pagingState.set( "currentPage", 0 );
                expect( collection.hasPrevious() ).to.be.false;
                collection.pagingState.set( "currentPage", -1 );
                expect( collection.hasPrevious() ).to.be.false;
                collection.pagingState.set( "currentPage", -10 );
                expect( collection.hasPrevious() ).to.be.false;
            });
        });

        describe('hasNext()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it("should not have next if current page is bigger than max page value", function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                collection.pagingState.set( "currentPage", 3 );
                expect( collection.hasNext() ).to.be.false;
                collection.pagingState.set( "currentPage", 4 );
                expect( collection.hasNext() ).to.be.false;
                collection.pagingState.set( "currentPage", 50 );
                expect( collection.hasNext() ).to.be.false;
            });

            it("should have next if current page is less than max page value", function() {
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                collection.pagingState.set( "currentPage", 1 );
                expect( collection.hasNext() ).to.be.true;
                collection.pagingState.set( "currentPage", 2 );
                expect( collection.hasNext() ).to.be.true;
            });
        });

        describe('firstPage()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "goTo" );
            });

            afterEach(function() {
                stub.restore();
            });

            it("should call goTo with 'first' as argument", function () {
                collection.firstPage();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "first" ) ).to.be.true;
            });
        });

        describe('lastPage()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "goTo" );
            });

            after(function() {
                stub.restore();
            });

            it("should call goTo with 'last' as argument", function () {
                collection.lastPage();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "last" ) ).to.be.true;
            });
        });

        describe('previousPage()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "goTo" );
            });

            after(function() {
                stub.restore();
            });

            it("should call goTo with 'previous' as argument", function () {
                collection.previousPage();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "previous" ) ).to.be.true;
            });
        });

        describe('nextPage()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "goTo" );
            });

            after(function() {
                stub.restore();
            });

            it("should call goTo with 'next' as argument", function () {
                collection.nextPage();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "next" ) ).to.be.true;
            });
        });

        describe('getMaxPages()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
            });

            it("should return the max number of pages for the collection based on the total state and per page state", function () {
                expect( collection.getMaxPages() ).to.equal( 3 );
                fullCollection.add( [ { id: 6 }, { id: 7 } ] );
                expect( collection.getMaxPages() ).to.equal( 4 );
                fullCollection.add( { id: 8 } );
                expect( collection.getMaxPages() ).to.equal( 4 );
                fullCollection.add( { id: 9 } );
                expect( collection.getMaxPages() ).to.equal( 5 );
                collection.pagingState.set( "perPage", 3 );
                expect( collection.getMaxPages() ).to.equal( 3 );
            });
        });

        describe('goTo()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection(
                    [
                        {
                            id: 1
                        },
                        {
                            id: 2
                        },
                        {
                            id: 3
                        },
                        {
                            id: 4
                        },
                        {
                            id: 5
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Create Paging Collection definition
                PagingCollection = Backbone.Collection.extend({
                    pagingState: {
                        perPage: 2
                    }
                });
                PaginationSubsetMixin.call( PagingCollection.prototype );
                collection = new PagingCollection( null, {
                    parent: fullCollection
                });
            });

            afterEach(function() {
                stub.restore();
            });

            it("should set the current page to the beginning if no page argument is given and return first two models", function () {
                collection.pagingState.set( "currentPage", 2 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo();
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 1 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 0 ), fullCollection.at( 1 ) ] ) ).to.be.true;
            });

            it("should set the current page to one if the page argument is 'first' and return first two models", function () {
                collection.pagingState.set( "currentPage", 2 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo( "first" );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 1 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 0 ), fullCollection.at( 1 ) ] ) ).to.be.true;
            });

            it("should set the current page to the last page if the page argument is 'last' and return last pages models", function () {
                collection.pagingState.set( "currentPage", 1 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo( "last" );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 3 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 4 ) ] ) ).to.be.true;
                // Add 2 models to collection to add an extra page
                fullCollection.add( [ { id : 6 }, { id : 7 } ] );
                collection.pagingState.set( "currentPage", 1 );
                data = collection.goTo( "last" );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 4 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 2 );
                expect( stub.calledWith( [ fullCollection.at( 6 ) ] ) ).to.be.true;
            });

            it("should set the current page to one if the page argument is 'previous' and return first two models when collection doesn't have previous models", function () {
                collection.pagingState.set( "currentPage", 1 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo( "previous" );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 1 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 0 ), fullCollection.at( 1 ) ] ) ).to.be.true;
            });

            it("should set the current page to the current page minus one if the page argument is 'previous' and return models for the previous page when has previous models", function () {
                collection.pagingState.set( "currentPage", 2 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo( "previous" );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 1 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 0 ), fullCollection.at( 1 ) ] ) ).to.be.true;
            });

            it("should set the current page to the current page if page argument is 'next' and return last pages models when collection doesn't have next pages", function () {
                collection.pagingState.set( "currentPage", 3 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo( "next" );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 3 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 4 ) ] ) ).to.be.true;
            });

            it("should set the current page to the current page plus one if the page argument is 'next' and return models for the next page when has next models", function () {
                collection.pagingState.set( "currentPage", 1 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo( "next" );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 2 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 2 ), fullCollection.at( 3 ) ] ) ).to.be.true;
            });

            it("should set the current page to one if the page argument is a non number and isn't a defined page type", function () {
                collection.pagingState.set( "currentPage", 2 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo( "blah" );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 1 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 0 ), fullCollection.at( 1 ) ] ) ).to.be.true;
            });

            it("should set the current page to one if the page argument is a negative number", function () {
                collection.pagingState.set( "currentPage", 2 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo( -1 );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 1 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 0 ), fullCollection.at( 1 ) ] ) ).to.be.true;
            });

            it("should set the current page to max page if the page argument is a number bigger than max page", function () {
                collection.pagingState.set( "currentPage", 1 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo( 10 );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 3 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 4 ) ] ) ).to.be.true;
            });

            it("should set the current page to nearest int if the page argument is a float number", function () {
                collection.pagingState.set( "currentPage", 1 );
                stub = sinon.stub( collection, "reset" );
                collection.goTo( 1.5 );
                expect( collection.pagingState.get( "currentPage" ) ).to.equal( 2 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 2 ), fullCollection.at( 3 ) ] ) ).to.be.true;
            });

            it("should trigger an event with perPage value", function ( done ) {
                collection.pagingState.on( "change:currentPage", function( model ) {
                    expect( model.get( "currentPage" ) ).to.equal( 3 );
                    done();
                });
                collection.goTo( 3 );
            });
        });
    });
}));
