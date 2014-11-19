(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'collections/capped/CappedCollection'
            ],
            function( Backbone, CappedCollectionMixin ) {
                factory( Backbone, root.sinon, root.expect, CappedCollectionMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var sinon = require( 'sinon' );
        var CappedCollectionMixin = require( '../../../../src/collections/capped/CappedCollection' );
        factory( Backbone, sinon, expect, CappedCollectionMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.sinon, root.expect, root.ExoSuit.Mixins.CappedCollectionMixin );
    }
}( this, function( Backbone, sinon, expect, CappedCollectionMixin ) {
    describe('Capped Collection Mixin', function () {
        var collection, CappedCollection, oldMethodStub, stub;

        describe('initialize()', function () {
            beforeEach(function () {
                // Create Capped Collection definition
                CappedCollection = Backbone.Collection.extend({
                    limit: 4
                });
                oldMethodStub = sinon.stub( CappedCollection.prototype, "initialize" );
                CappedCollectionMixin.call( CappedCollection.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
            });

            it('should call the super initialize method', function() {
                collection = new CappedCollection( null, {
                    model: Backbone.Model
                });
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                expect( oldMethodStub.calledWith( null, { model: Backbone.Model } ) ).to.be.true;
            });

            it('should set the limit of the collection to the limit ', function() {
                collection = new CappedCollection( null, {
                    model: Backbone.Model,
                    limit: 10
                });
                expect( collection.limit ).to.equal( 10 );
            });
        });

        describe('add()', function () {
            beforeEach(function () {
                // Create Capped Collection definition
                CappedCollection = Backbone.Collection.extend({
                    limit: 4
                });
                CappedCollectionMixin.call( CappedCollection.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                if ( oldMethodStub ) {
                    oldMethodStub.restore();
                }
            });

            it('should call super add method', function() {
                // Create Capped Collection definition
                CappedCollection = Backbone.Collection.extend({
                    limit: 4
                });
                oldMethodStub = sinon.stub( CappedCollection.prototype, "add" );
                CappedCollectionMixin.call( CappedCollection.prototype );
                var models = [ { "name" : "Anne" }, { "name" : "Bob" }, { "name" : "Claire" }, { "name" : "David" } ];
                collection = new CappedCollection( null, {
                    model: Backbone.Model
                });
                collection.add( models );
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                expect( oldMethodStub.calledWith( models ) ).to.be.true;
            });

            it('should return added models if number of models is less or equal to the limit', function() {
                var models = [ { "name" : "Anne"  }, { "name" : "Bob"  }, { "name" : "Claire"  } ],
                    added;

                collection = new CappedCollection( null, {
                    model: Backbone.Model
                });
                added = collection.add( models );
                expect( collection.length ).to.equal( 3 );
                expect( added.length ).to.equal( 3 );
                expect( collection.models ).to.deep.equal( added );
                collection.reset();
                models = [ { "name" : "Anne" }, { "name" : "Bob" }, { "name" : "Claire" }, { "name" : "David" } ];
                added = collection.add( models );
                expect( collection.length ).to.equal( 4 );
                expect( added.length ).to.equal( 4 );
                expect( collection.models ).to.deep.equal( added );
            });

            it('should call super remove method if number of models added is bigger than collection limit', function() {
                var models = [ { "name" : "Anne" }, { "name" : "Bob" }, { "name" : "Claire" }, { "name" : "David" }, { "name" : "Eve" } ];

                collection = new CappedCollection( null, {
                    model: Backbone.Model
                });
                stub = sinon.stub( collection, "remove" );
                collection.add( models );
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should remove any extra models over the limit of the collection', function() {
                var models = [ { "name" : "Anne" }, { "name" : "Bob" }, { "name" : "Claire" }, { "name" : "David" }, { "name" : "Eve" } ],
                    added;

                collection = new CappedCollection( null, {
                    model: Backbone.Model
                });
                added = collection.add( models );
                expect( collection.length ).to.equal( 4 );
                expect( collection.models ).to.deep.equal( added );
            });

            it('should return only the added models when number of added models is less than limit but total after addition is above the limit', function() {
                var models = [ { "name" : "Anne" }, { "name" : "Bob" }, { "name" : "Claire" }, { "name" : "David" } ],
                    newModels = [ { "name" : "Eve" }, { "name" : "Frank" } ],
                    added;

                collection = new CappedCollection( models, {
                    model: Backbone.Model
                });
                expect( collection.length ).to.equal( 4 );
                added = collection.add( newModels );
                expect( collection.length ).to.equal( 4 );
                expect( added.length ).to.equal( 2 );
                expect( added[ 0 ].toJSON() ).to.deep.equal( newModels[ 0 ] );
                expect( added[ 1 ].toJSON() ).to.deep.equal( newModels[ 1 ] );
            });

            it('should add models in collection constructor', function() {
                var models = [ { "name" : "Anne"  }, { "name" : "Bob"  }, { "name" : "Claire"  } ],
                    added;

                collection = new CappedCollection( models, {
                    model: Backbone.Model
                });
                expect( collection.length ).to.equal( 3 );
                expect( collection.toJSON() ).to.deep.equal( models );

                models = [ { "name" : "Anne"  }, { "name" : "Bob"  }, { "name" : "Claire"  }, { "name" : "David" } ];
                collection = new CappedCollection( models, {
                    model: Backbone.Model
                });
                expect( collection.length ).to.equal( 4 );
                expect( collection.toJSON() ).to.deep.equal( models );

                models = [ { "name" : "Anne"  }, { "name" : "Bob"  }, { "name" : "Claire"  }, { "name" : "David" }, { "name" : "Eve" } ];
                collection = new CappedCollection( models, {
                    model: Backbone.Model
                });
                expect( collection.length ).to.equal( 4 );
                expect( collection.toJSON() ).to.deep.equal( [ { "name" : "Bob"  }, { "name" : "Claire"  }, { "name" : "David" }, { "name" : "Eve" } ] );
            });
        });
    });
}));
