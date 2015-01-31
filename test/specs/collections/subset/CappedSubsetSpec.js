(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'collections/subset/CappedSubset'
            ],
            function( Backbone, CappedSubsetMixin ) {
                factory( Backbone, root.sinon, root.expect, CappedSubsetMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var sinon = require( 'sinon' );
        var CappedSubsetMixin = require( '../../../../src/collections/subset/CappedSubset' );
        factory( Backbone, sinon, expect, CappedSubsetMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.sinon, root.expect, root.ExoSuit.Mixins.CappedSubsetMixin );
    }
}( this, function( Backbone, sinon, expect, CappedSubsetMixin ) {
    describe('Capped Subset Collection Mixin', function () {
        var collection, model, fullCollection, CappedCollection, oldMethodStub, stub, stub2;

        describe('initialize()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection( null, {
                    model: Backbone.Model
                });
                // Create Capped Collection definition
                CappedCollection = Backbone.Collection.extend();
                oldMethodStub = sinon.stub( CappedCollection.prototype, "initialize" );
                CappedSubsetMixin.call( CappedCollection.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if( stub ) {
                    stub.restore();
                }
            });

            it('should call the super initialize method', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should throw error if no parent collection is given', function() {
                expect( function() { new CappedCollection() } ).to.throw( 'Parent collection is required to use subset collection' );
            });

            it('should set the parent of the collection to the parent collection', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                expect( collection.parent ).to.equal( fullCollection );
            });

            it('should set the model of the collection to the parent collection model', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                expect( collection.parent.model ).to.equal( fullCollection.model );
            });

            it('should call resize method if limit is passed in as a option that is different to module limit', function() {
                stub = sinon.stub( CappedCollection.prototype, "resize" );
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                expect( stub.called ).to.be.false;
                collection = new CappedCollection( null, {
                    parent: fullCollection,
                    limit: 4
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( 4, { silent : true } ) ).to.be.true;
            });

            it('should call reorder method if order is passed in as a option that is different to module order', function() {
                stub = sinon.stub( CappedCollection.prototype, "reorder" );
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                expect( stub.called ).to.be.false;
                collection = new CappedCollection( null, {
                    parent: fullCollection,
                    order: "first"
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "first", { silent : true } ) ).to.be.true;
            });

            it('should set up listeners to the parent collection', function() {
                stub = sinon.stub( CappedCollection.prototype, "listenTo" );
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( collection.parent, {
                    add: collection.__add,
                    remove: collection.__remove,
                    reset: collection.__reset,
                    sort: collection.__reset
                } ) ).to.be.true;
            });

            it('should call __reset method', function() {
                stub = sinon.stub( CappedCollection.prototype, "__reset" );
                collection = new CappedCollection( null, {
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
                    }
                ], {
                    model: Backbone.Model
                });
                // Create Capped Collection definition
                CappedCollection = Backbone.Collection.extend({
                    limit: 3
                });
                CappedSubsetMixin.call( CappedCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should return undefined if no parent is set', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                collection.parent = null;
                expect( collection._getParentModels() ).to.be.undefined;
            });

            it('should get all parent models if parent length is smaller than limit', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                expect( collection._getParentModels().length ).to.equal( 2 );
            });

            it('should get the last 3 (limit) models if parent length is greater or equal to limit', function() {
                fullCollection.add( { id: 3 } );
                collection = new CappedCollection( null, { parent: fullCollection });
                expect( collection._getParentModels().length ).to.equal( 3 );
                fullCollection.add( { id: 4 } );
                expect( collection._getParentModels().length ).to.equal( 3 );
            });

        });

        describe('__add()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection([
                    {
                        id: 1
                    },
                    {
                        id: 2
                    }
                ], {
                    model: Backbone.Model
                });
                // Create Capped Collection definition
                CappedCollection = Backbone.Collection.extend({
                    limit: 3
                });
                CappedSubsetMixin.call( CappedCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
                if( stub2 ) {
                    stub2.restore();
                }
            });

            it('should add model to capped subset if parent length is smaller than the subset limit', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( CappedCollection.prototype, "add" );
                collection.__add( {
                    id : 3
                }, collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( {
                    id : 3
                } ) ).to.be.true;
            });

            it('should add model and remove model to replace it if parent collection length is more than limit', function() {
                fullCollection.add( [
                    {
                        id: 3
                    },
                    {
                        id: 4
                    }
                ] );
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "add" );
                stub2 = sinon.stub( collection, "remove" );
                fullCollection.add( {
                    id : 5
                } );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fullCollection.at( 4 ) ) ).to.be.true;
                expect( stub2.called ).to.be.true;
                expect( stub2.callCount ).to.equal( 1 );
                expect( stub2.calledWith( fullCollection.at( 1 ) ) ).to.be.true;
                fullCollection.reset([
                    {
                        id: 1
                    },
                    {
                        id: 2
                    },
                    {
                        id: 3
                    }
                ]);
                collection = new CappedCollection( null, {
                    parent: fullCollection,
                    order: "first"
                });
                stub = sinon.stub( collection, "add" );
                stub2 = sinon.stub( collection, "remove" );
                fullCollection.add(
                    {
                        id: 4
                    },
                    {
                        at: 2
                    }
                );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fullCollection.at( 2 ) ) ).to.be.true;
                expect( stub2.called ).to.be.true;
                expect( stub2.callCount ).to.equal( 1 );
                expect( stub2.calledWith( fullCollection.at( 3 ) ) ).to.be.true;
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
                // Create Capped Collection definition
                CappedCollection = Backbone.Collection.extend({
                    limit: 3
                });
                CappedSubsetMixin.call( CappedCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should call remove for a model that is contained within the subset collection', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( CappedCollection.prototype, "remove" );
                collection.__remove( fullCollection.at( 0 ), collection );
                expect( stub.called ).to.be.false;
                collection.__remove( fullCollection.at( 3 ), collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fullCollection.at( 3 ) ) ).to.be.true;
            });

            it('should add a model to replace the removed model if parent collection has more models than subset limit', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( CappedCollection.prototype, "add" );
                collection.__remove( fullCollection.at( 3 ), collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should add a model to replace the removed model from parent collection depending on the order of the capped subset', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "add" );
                fullCollection.remove( fullCollection.at( 3 ) );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fullCollection.at( 1 ) ) ).to.be.true;
                stub.restore();
                collection = new CappedCollection( null, {
                    parent: fullCollection,
                    order: "first",
                    limit: 2
                });
                stub = sinon.stub( collection, "add" );
                fullCollection.remove( fullCollection.at( 0 ) );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fullCollection.at( 1 ) ) ).to.be.true;
            });
        });

        describe('__reset()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection([
                    {
                        id: 1
                    },
                    {
                        id: 2
                    }
                ], {
                    model: Backbone.Model
                });
                // Create Capped Collection definition
                CappedCollection = Backbone.Collection.extend({
                    limit: 3
                });
                CappedSubsetMixin.call( CappedCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should call reset function with result of parent models', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( CappedCollection.prototype, "reset" );
                collection.__reset();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( collection._getParentModels() ) ).to.be.true;
            });
        });

        describe('resize()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection([
                    {
                        id: 1
                    },
                    {
                        id: 2
                    }
                ], {
                    model: Backbone.Model
                });
                // Create Capped Collection definition
                CappedCollection = Backbone.Collection.extend({
                    limit: 3
                });
                CappedSubsetMixin.call( CappedCollection.prototype );
            });

            afterEach(function() {
                if( stub&& stub.restore ) {
                    stub.restore();
                }
            });

            it('should throw error if size isnt an integer', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                expect( function() { collection.resize( "hello" ) } ).to.throw( 'Size must be a number' );
                expect( function() { collection.resize( true ) } ).to.throw( 'Size must be a number' );
                expect( function() { collection.resize( 2.5 ) } ).to.throw( 'Size must be a number' );
                expect( function() { collection.resize( [] ) } ).to.throw( 'Size must be a number' );
                expect( function() { collection.resize( {} ) } ).to.throw( 'Size must be a number' );
            });

            it('should set the subset collection limit to the size argument', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                collection.resize( 10 );
                expect( collection.limit ).to.equal( 10 );
                collection.resize( 50 );
                expect( collection.limit ).to.equal( 50 );
                collection.resize( 200 );
                expect( collection.limit ).to.equal( 200 );
            });

            it('should add any new models to the subset collection if size is bigger than previous limit', function() {
                fullCollection.add([
                    {
                        id: 3
                    },
                    {
                        id: 4
                    },
                    {
                        id: 5
                    }
                ]);
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "add" );
                collection.resize( 5 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 0 ), fullCollection.at( 1 ) ] ) ).to.be.true;
                collection = new CappedCollection( null, {
                    parent: fullCollection,
                    order: "first"
                });
                stub = sinon.stub( collection, "add" );
                collection.resize( 4 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ fullCollection.at( 3 ) ] ) ).to.be.true;
            });

            it('should remove any models that are not in the capped subset if size is lower than previous limit', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                expect( collection.limit ).to.equal( 3 );
                expect( collection.length ).to.equal( 2 );
                collection.resize( 1 );
                expect( collection.limit ).to.equal( 1 );
                expect( collection.length ).to.equal( 1 );
                expect( collection.at( 0 ).id ).to.equal( 2 );
                expect( collection.at( 1 ) ).to.be.undefined;
            });

            it('should trigger resize event if silent isnt set to true in the options argument', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub();
                collection.listenTo( collection, "resize", stub );
                collection.resize( 10, {
                    silent : true
                });
                expect( stub.called ).to.be.false;
                collection.resize( 5, {
                    silent : false
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( 5, collection, {
                    silent : false
                } ) ).to.be.true;
                collection.resize( 3 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 2 );
                expect( stub.calledWith( 3, collection ) ).to.be.true;
            });
        });

        describe('reorder()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection([
                    {
                        id: 1
                    },
                    {
                        id: 2
                    }
                ], {
                    model: Backbone.Model
                });
                // Create Capped Collection definition
                CappedCollection = Backbone.Collection.extend({
                    limit: 3
                });
                CappedSubsetMixin.call( CappedCollection.prototype );
            });

            afterEach(function() {
                if( stub && stub.restore ) {
                    stub.restore();
                }
            });

            it('should toggle collection order', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                expect( collection.order ).to.equal( "last" );
                collection.reorder();
                expect( collection.order ).to.equal( "first" );
                collection.reorder();
                expect( collection.order ).to.equal( "last" );
                collection.reorder();
                expect( collection.order ).to.equal( "first" );
            });

            it('should call reset function with result of parent models', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "reset" );
                collection.reorder();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( collection._getParentModels() ) ).to.be.true;
            });

            it('should trigger reorder event if silent isnt set to true in the options argument', function() {
                collection = new CappedCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub();
                collection.listenTo( collection, "reorder", stub );
                collection.reorder({
                    silent : true
                });
                expect( stub.called ).to.be.false;
                collection.reorder({
                    silent : false
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( collection.order, collection, {
                    silent : false
                } ) ).to.be.true;
                collection.reorder();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 2 );
                expect( stub.calledWith( collection.order, collection ) ).to.be.true;
            });
        });
    });
}));
