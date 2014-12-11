(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'collections/sort-on-change/SortOnChange'
            ],
            function( Backbone, SortOnChangeMixin ) {
                factory( Backbone, root.sinon, root.expect, SortOnChangeMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var sinon = require( 'sinon' );
        var SortOnChangeMixin = require( '../../../../src/collections/sort-on-change/SortOnChange' );
        factory( Backbone, sinon, expect, SortOnChangeMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.sinon, root.expect, root.ExoSuit.Mixins.SortOnChangeMixin );
    }
}( this, function( Backbone, sinon, expect, SortOnChangeMixin ) {
    describe('Sort On Change Collection Mixin', function () {
        var collection, SortOnChangeCollection, oldMethodStub, stub;

        describe('_onModelEvent()', function () {
            afterEach(function() {
                oldMethodStub.restore();
            });

            it('should call the super _onModelEvent method', function() {
                // Create Capped Collection definition
                SortOnChangeCollection = Backbone.Collection.extend();
                oldMethodStub = sinon.stub( SortOnChangeCollection.prototype, "_onModelEvent" );
                SortOnChangeMixin.call( SortOnChangeCollection.prototype );

                var model = new Backbone.Model(),
                    options = { test: true };

                collection = new SortOnChangeCollection( null, {
                    model: Backbone.Model
                });
                collection._onModelEvent( "add", model, collection, options );
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                expect( oldMethodStub.calledWith( "add", model, collection, options ) ).to.be.true;
            });

            it('should call sort if comparator is a string and change event for specified attribute', function() {
                // Create Capped Collection definition
                SortOnChangeCollection = Backbone.Collection.extend({
                    comparator: "name"
                });
                SortOnChangeMixin.call( SortOnChangeCollection.prototype );

                var model = new Backbone.Model(),
                    options = {};

                collection = new SortOnChangeCollection(
                    [
                        {
                            name: "Bob"
                        },
                        {
                            name: "Frank"
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Sort is called on initialize so create stub here to have count start at zero
                stub = sinon.stub( SortOnChangeCollection.prototype, "sort" );
                collection._onModelEvent( "add", model, collection, options );
                expect( stub.called ).to.be.false;
                collection._onModelEvent( "change", model, collection, options );
                expect( stub.called ).to.be.false;
                collection._onModelEvent( "change:name", model, collection, options );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should call sort if comparator is a function and change event', function() {
                // Create Capped Collection definition
                SortOnChangeCollection = Backbone.Collection.extend({
                    comparator: function() {}
                });
                SortOnChangeMixin.call( SortOnChangeCollection.prototype );

                var model = new Backbone.Model(),
                    options = {};

                collection = new SortOnChangeCollection(
                    [
                        {
                            name: "Bob"
                        },
                        {
                            name: "Frank"
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Sort is called on initialize so create stub here to have count start at zero
                stub = sinon.stub( SortOnChangeCollection.prototype, "sort" );
                collection._onModelEvent( "add", model, collection, options );
                expect( stub.called ).to.be.false;
                collection._onModelEvent( "change:name", model, collection, options );
                expect( stub.called ).to.be.false;
                collection._onModelEvent( "change", model, collection, options );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should not call sort if comparator is not set', function() {
                // Create Capped Collection definition
                SortOnChangeCollection = Backbone.Collection.extend();
                SortOnChangeMixin.call( SortOnChangeCollection.prototype );

                var model = new Backbone.Model(),
                    options = {};

                collection = new SortOnChangeCollection(
                    [
                        {
                            name: "Bob"
                        },
                        {
                            name: "Frank"
                        }
                    ],
                    {
                        model: Backbone.Model
                    }
                );
                // Sort is called on initialize so create stub here to have count start at zero
                stub = sinon.stub( SortOnChangeCollection.prototype, "sort" );
                collection._onModelEvent( "add", model, collection, options );
                expect( stub.called ).to.be.false;
                collection._onModelEvent( "change:name", model, collection, options );
                expect( stub.called ).to.be.false;
                collection._onModelEvent( "change", model, collection, options );
                expect( stub.called ).to.be.false;
            });
        });
    });
}));
