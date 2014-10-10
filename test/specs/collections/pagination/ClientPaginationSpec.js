(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'sinon',
                'collections/pagination/ClientPagination'
            ],
            function( Backbone, sinon, ClientPaginationMixin ) {
                factory( Backbone, sinon, root.expect, ClientPaginationMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var sinon = require( 'sinon' );
        var ClientPaginationMixin = require( '../../../../src/collections/pagination/ClientPagination' );
        factory( Backbone, sinon, expect, ClientPaginationMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.sinon, root.expect, root.ExoSuit.Mixins.ClientPaginationMixin );
    }
}( this, function( Backbone, sinon, expect, ClientPaginationMixin ) {
    describe('Client Pagination Collection Mixin', function () {
        var collection, PaginatonCollection, stub;

        before(function() {
            // Create Pagination Collection definition
            PaginatonCollection = Backbone.Collection.extend({
                initialize: function() {
                    this.oldInitProp = true;
                }
            });
            ClientPaginationMixin.call( PaginatonCollection.prototype );
        });

        describe('initialize()', function () {
            beforeEach(function () {
                stub = sinon.stub( PaginatonCollection.prototype, "_setState" );
                collection = new PaginatonCollection( null, {
                    model: Backbone.Model,
                    pagingState: {
                        currentPage : 0,
                        perPage     : 5
                    }
                });
            });

            afterEach(function() {
                stub.restore();
            });

            it('should call _setState method passing any pagingState options in the options hash', function() {
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( { currentPage : 0, perPage : 5 } ) ).to.be.true;
            });

            it('should call old initialize method set before mixin applied', function() {
                expect( collection.oldInitProp ).to.be.defined;
                expect( collection.oldInitProp ).to.be.true;
            });
        });

        describe('_setState()', function () {
            beforeEach(function () {
                collection = new PaginatonCollection( null, {
                    model: Backbone.Model
                });
            });

            it('should set to state argument as the collection pagingState', function() {
                collection._setState( { currentPage : 5, perPage : 25 } );
                expect( collection.pagingState.currentPage ).to.be.equal( 5 );
                expect( collection.pagingState.perPage ).to.be.equal( 25 );
            });
        });

        describe('howManyPerPage()', function () {
            beforeEach(function () {
                collection = new PaginatonCollection( null, {
                    model: Backbone.Model,
                    pagingState: {
                        currentPage : 0
                    }
                });
                stub = sinon.stub( collection, "goTo" );
            });

            after(function() {
                stub.restore();
            });

            it("should set the per page state to the value passed in", function () {
                collection.howManyPerPage( 10 );
                expect( collection.pagingState.perPage ).to.equal( 10 );
                collection.howManyPerPage( 25 );
                expect( collection.pagingState.perPage ).to.equal( 25 );
                collection.howManyPerPage( 50 );
                expect( collection.pagingState.perPage ).to.equal( 50 );
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
                expect( stub.calledWith( 0 ) ).to.be.true;
            });
        });

        describe('hasPrevious()', function () {
            beforeEach(function () {
                collection = new PaginatonCollection( null, {
                    model: Backbone.Model
                });
            });

            it("should have previous if current page is bigger than zero", function() {
                collection.pagingState.currentPage = 1;
                expect( collection.hasPrevious() ).to.be.true;
                collection.pagingState.currentPage = 50;
                expect( collection.hasPrevious() ).to.be.true;
            });

            it("should not have previous if current page is zero or lower", function() {
                collection.pagingState.currentPage = 0;
                expect( collection.hasPrevious() ).to.be.false;
                collection.pagingState.currentPage = -1;
                expect( collection.hasPrevious() ).to.be.false;
                collection.pagingState.currentPage = -10;
                expect( collection.hasPrevious() ).to.be.false;
            });
        });

        describe('hasNext()', function () {
            beforeEach(function () {
                collection = new PaginatonCollection( null, {
                    model: Backbone.Model,
                    pagingState: {
                        currentPage : 0,
                        perPage     : 2
                    }
                });
            });

            it("should not have next if total is smaller or equal to current page plus per page value", function() {
                // Add model
                collection.add( { "hello" : "world" } );
                expect( collection.hasNext() ).to.be.false;
                // Add another model - now 2 models added for following tests
                collection.add( { "goodbye" : "wave" } );
                expect( collection.hasNext() ).to.be.false;
            });

            it("should have next if total is bigger than current page plus per page value", function() {
                collection.add( [ { "hello" : "world" }, { "goodbye" : "wave" }, { "testing" : "123" } ] );
                expect( collection.hasNext() ).to.be.true;
            });
        });

        describe('firstPage()', function () {
            beforeEach(function () {
                collection = new PaginatonCollection( null, {
                    model: Backbone.Model
                });
                stub = sinon.stub( collection, "goTo" );
            });

            after(function() {
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
                collection = new PaginatonCollection( null, {
                    model: Backbone.Model
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
                collection = new PaginatonCollection( null, {
                    model: Backbone.Model
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
                collection = new PaginatonCollection( null, {
                    model: Backbone.Model
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

        describe('goTo()', function () {
            beforeEach(function () {
                collection = new PaginatonCollection(
                    [
                        {
                            "hello": "world"
                        },
                        {
                            "hello": "earth"
                        },
                        {
                            "hello": "planet"
                        },
                        {
                            "hello": "solar system"
                        },
                        {
                            "hello": "galaxy"
                        },
                        {
                            "hello": "universe"
                        }
                    ],
                    {
                        model: Backbone.Model,
                        pagingState: {
                            perPage: 2
                        }
                    }
                );
            });

            it("should set the current page to the beginning if no page argument is given and return first two models", function () {
                collection.pagingState.currentPage = 1;
                var data = collection.goTo();
                expect( collection.pagingState.currentPage ).to.equal( 0 );
                expect( data ).to.deep.equal( [ { "hello": "world" }, { "hello": "earth" } ] );
            });

            it("should set the current page to zero if the page argument is 'first' and return first two models", function () {
                collection.pagingState.currentPage = 1;
                var data = collection.goTo( "first" );
                expect( collection.pagingState.currentPage ).to.equal( 0 );
                expect( data ).to.deep.equal( [ { "hello": "world" }, { "hello": "earth" } ] );
            });

            it("should set the current page to the last page if the page argument is 'last' and return last pages models", function () {
                collection.pagingState.currentPage = 0;
                var data = collection.goTo( "last" );
                expect( collection.pagingState.currentPage ).to.equal( 2 );
                expect( data ).to.deep.equal( [ { "hello": "galaxy" }, { "hello": "universe" } ] );
                // Add model to collection to add an extra page
                collection.add( [ { "hello" : "star" } ] );
                collection.pagingState.currentPage = 0;
                data = collection.goTo( "last" );
                expect( collection.pagingState.currentPage ).to.equal( 3 );
                expect( data ).to.deep.equal( [ { "hello": "star" } ] );
            });

            it("should set the current page to zero if the page argument is 'previous' and return first two models when collection doesn't have previous models", function () {
                collection.pagingState.currentPage = 0;
                var data = collection.goTo( "previous" );
                expect( collection.pagingState.currentPage ).to.equal( 0 );
                expect( data ).to.deep.equal( [ { "hello": "world" }, { "hello": "earth" } ] );
            });

            it("should set the current page to the current page minus one if the page argument is 'previous' and return models for the previous page when has previous models", function () {
                collection.pagingState.currentPage = 2;
                var data = collection.goTo( "previous" );
                expect( collection.pagingState.currentPage ).to.equal( 1 );
                expect( data ).to.deep.equal( [ { "hello": "planet" }, { "hello": "solar system" } ] );
            });

            it("should set the current page to the current page if page argument is 'next' and return last pages models when collection doesn't have next pages", function () {
                collection.pagingState.currentPage = 2;
                var data = collection.goTo( "next" );
                expect( collection.pagingState.currentPage ).to.equal( 2 );
                expect( data ).to.deep.equal( [ { "hello": "galaxy" }, { "hello": "universe" } ] );
            });

            it("should set the current page to the current page plus one if the page argument is 'next' and return models for the next page when has next models", function () {
                collection.pagingState.currentPage = 0;
                var data = collection.goTo( "next" );
                expect( collection.pagingState.currentPage ).to.equal( 1 );
                expect( data ).to.deep.equal( [ { "hello": "planet" }, { "hello": "solar system" } ] );
            });

            it("should set the current page to zero if the page argument is a non number and isn't a defined page type", function () {
                collection.pagingState.currentPage = 1;
                var data = collection.goTo( "blah" );
                expect( collection.pagingState.currentPage ).to.equal( 0 );
                expect( data ).to.deep.equal( [ { "hello": "world" }, { "hello": "earth" } ] );
            });

            it("should set the current page to zero if the page argument is a negative number", function () {
                collection.pagingState.currentPage = 1;
                var data = collection.goTo( -1 );
                expect( collection.pagingState.currentPage ).to.equal( 0 );
                expect( data ).to.deep.equal( [ { "hello": "world" }, { "hello": "earth" } ] );
            });

            it("should set the current page to max page if the page argument is a number bigger than max page", function () {
                collection.pagingState.currentPage = 0;
                var data = collection.goTo( 3 );
                expect( collection.pagingState.currentPage ).to.equal( 2 );
                expect( data ).to.deep.equal( [ { "hello": "galaxy" }, { "hello": "universe" } ] );
            });

            it("should set the current page to nearest int if the page argument is a float number", function () {
                collection.pagingState.currentPage = 0;
                var data = collection.goTo( 1.5 );
                expect( collection.pagingState.currentPage ).to.equal( 2 )
                expect( data ).to.deep.equal( [ { "hello": "galaxy" }, { "hello": "universe" } ] );
            });
        });
    });
}));
