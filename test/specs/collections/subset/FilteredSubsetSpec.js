(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'collections/subset/FilteredSubset'
            ],
            function( Backbone, FilteredSubsetMixin ) {
                factory( Backbone, root.sinon, root.expect, FilteredSubsetMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var sinon = require( 'sinon' );
        var FilteredSubsetMixin = require( '../../../../src/collections/subset/FilteredSubset' );
        factory( Backbone, sinon, expect, FilteredSubsetMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.sinon, root.expect, root.ExoSuit.Mixins.FilteredSubsetMixin );
    }
}( this, function( Backbone, sinon, expect, FilteredSubsetMixin ) {
    describe('Filtered Subset Collection Mixin', function () {
        var collection, model, fullCollection, FilteredCollection, oldMethodStub, stub;

        describe('initialize()', function () {
            beforeEach(function () {
                fullCollection = new Backbone.Collection( null, {
                    model: Backbone.Model
                });
                // Create Filtered Collection definition
                FilteredCollection = Backbone.Collection.extend();
                oldMethodStub = sinon.stub( FilteredCollection.prototype, "initialize" );
                FilteredSubsetMixin.call( FilteredCollection.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if( stub ) {
                    stub.restore();
                }
            });

            it('should call the super initialize method', function() {
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should throw error if no parent collection is given', function() {
                expect( function() { new FilteredCollection() } ).to.throw( 'Parent collection is required to use subset collection' );
            });

            it('should set the parent of the collection to the parent collection', function() {
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                expect( collection.parent ).to.equal( fullCollection );
            });

            it('should set the model of the collection to the parent collection model', function() {
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                expect( collection.parent.model ).to.equal( fullCollection.model );
            });

            it('should set filter function of the collection if a filter function is in the options argument', function() {
                var filterFn = function( model ) { return !!model; };
                collection = new FilteredCollection( null, {
                    parent: fullCollection,
                    filter: filterFn
                });
                expect( collection.filter ).to.equal( filterFn );
            });

            it('should set up listeners to the parent collection', function() {
                stub = sinon.stub( FilteredCollection.prototype, "listenTo" );
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( collection.parent, {
                    add: collection.__add,
                    remove: collection.__remove,
                    reset: collection.__reset,
                    change: collection.__change
                } ) ).to.be.true;
            });

            it('should call __reset method', function() {
                stub = sinon.stub( FilteredCollection.prototype, "__reset" );
                collection = new FilteredCollection( null, {
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
                // Create Filtered Collection definition
                FilteredCollection = Backbone.Collection.extend();
                FilteredSubsetMixin.call( FilteredCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should return undefined if no parent is set', function() {
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                collection.parent = null;
                expect( collection._getParentModels() ).to.be.undefined;
            });

            it('should get all parent models with default filter', function() {
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                expect( collection._getParentModels().length ).to.equal( 5 );
            });

            it('should get only model filtered by passed in filter', function() {
                collection = new FilteredCollection( null, {
                    parent: fullCollection,
                    filter: function( model ) {
                        return model.id > 3;
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
                // Create Filtered Collection definition
                FilteredCollection = Backbone.Collection.extend({
                    filter: function( model ) {
                        return model.id > 3;
                    }
                });
                FilteredSubsetMixin.call( FilteredCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should add model to filtered subset if model passes filter function', function() {
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( FilteredCollection.prototype, "add" );
                collection.__add( {
                    id : 2
                }, collection );
                expect( stub.called ).to.be.false;
                collection.__add( {
                    id : 6
                }, collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( {
                    id : 6
                } ) ).to.be.true;
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
                // Create Filtered Collection definition
                FilteredCollection = Backbone.Collection.extend({
                    filter: function( model ) {
                        return model.id > 3;
                    }
                });
                FilteredSubsetMixin.call( FilteredCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should call remove for a model that is contained within the subset collection', function() {
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( FilteredCollection.prototype, "remove" );
                collection.__remove( fullCollection.at( 0 ), collection );
                expect( stub.called ).to.be.false;
                collection.__remove( fullCollection.at( 3 ), collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fullCollection.at( 3 ) ) ).to.be.true;
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
                // Create Filtered Collection definition
                FilteredCollection = Backbone.Collection.extend({
                    filter: function( model ) {
                        return model.id > 3;
                    }
                });
                FilteredSubsetMixin.call( FilteredCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should call reset function with result of parent models', function() {
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( FilteredCollection.prototype, "reset" );
                collection.__reset();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( collection._getParentModels() ) ).to.be.true;
            });
        });

        describe('__change()', function () {
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
                // Create Filtered Collection definition
                FilteredCollection = Backbone.Collection.extend({
                    filter: function( model ) {
                        return model.id > 3;
                    }
                });
                FilteredSubsetMixin.call( FilteredCollection.prototype );
            });

            afterEach(function() {
                if( stub ) {
                    stub.restore();
                }
            });

            it('should remove any model that is within the filtered subset that doesnt pass the filter function when the model data changes', function() {
                var model;
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "remove" );
                model = fullCollection.at( 2 );
                model.set( { id : 6 } );
                expect( stub.called ).to.be.false;
                model = fullCollection.at( 3 );
                model.set( { id : 2 } );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( model ) ).to.be.true;
            });

            it('should add any model that is not within the filtered subset that does pass the filter function when the model data changes', function() {
                var model;
                collection = new FilteredCollection( null, {
                    parent: fullCollection
                });
                stub = sinon.stub( collection, "add" );
                model = fullCollection.at( 0 );
                model.set( { id : 2 } );
                expect( stub.called ).to.be.false;
                model.set( { id : 6 } );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( model ) ).to.be.true;
            });
        });
    });
}));
