(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'sinon',
                'views/events/CollectionEvents'
            ],
            function( Backbone, sinon, CollectionEventsMixin ) {
                factory( Backbone, root.expect, sinon, CollectionEventsMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var fs = require( 'fs' );
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var $ = require( 'jquery' )( require( 'jsdom' ).jsdom( fs.readFileSync( './test/specs/fixtures/main.html' ) ).parentWindow );
        Backbone.$ = $;
        var sinon = require( 'sinon' );
        var CollectionEventsMixin = require( '../../../../src/views/events/CollectionEvents' );
        factory( Backbone, expect, sinon, CollectionEventsMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.sinon, root.ExoSuit.Mixins.CollectionEventsMixin );
    }
}( this, function( Backbone, expect, sinon, CollectionEventsMixin ) {
    describe('Collection Events View Mixin', function () {
        var view, CollectionEventsView, stub, oldMethodStub;

        describe('initialize()', function () {
            beforeEach(function() {
                // Create Binding View definition
                CollectionEventsView = Backbone.View.extend();
                oldMethodStub = sinon.stub( CollectionEventsView.prototype, "initialize" );
                CollectionEventsMixin.call( CollectionEventsView.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call old initialize function', function() {
                // Create view
                view = new CollectionEventsView();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should set collectionEvents if collectionEvents is defined in options argument', function() {
                var events = {
                    "add": function() {}
                };
                // Create view
                view = new CollectionEventsView({
                    collectionEvents: events
                });
                expect( view.collectionEvents ).to.deep.equal( events );
            });
        });

        describe('delegateEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                CollectionEventsView = Backbone.View.extend();
                oldMethodStub = sinon.stub( CollectionEventsView.prototype, "delegateEvents" );
                CollectionEventsMixin.call( CollectionEventsView.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call old delegate function', function() {
                // Create view
                view = new CollectionEventsView();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should call bindCollectionEvents function', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "bindCollectionEvents" );
                // Create view
                view = new CollectionEventsView();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });
        });

        describe('undelegateEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                CollectionEventsView = Backbone.View.extend();
                oldMethodStub = sinon.stub( CollectionEventsView.prototype, "undelegateEvents" );
                CollectionEventsMixin.call( CollectionEventsView.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call old undelegateEvents function', function() {
                // Create view
                view = new CollectionEventsView();
                expect( oldMethodStub.called ).to.be.true;
                // Backbone 1.2.0 now calls undelegateEvents twice when initializing view
                expect( oldMethodStub.callCount ).to.equal( 2 );
            });

            it('should call unbindCollectionEvents function', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "unbindCollectionEvents" );
                // Create view
                view = new CollectionEventsView();
                expect( stub.called ).to.be.true;
                // Backbone 1.2.0 now calls undelegateEvents twice when initializing view
                expect( stub.callCount ).to.equal( 2 );
            });
        });

        describe('bindCollectionEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                CollectionEventsView = Backbone.View.extend();
                CollectionEventsMixin.call( CollectionEventsView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should not set up any collection event listeners if no collection is set on the view', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "listenTo" );
                // Create view
                view = new CollectionEventsView({
                    collectionEvents: {
                        "add": function() {}
                    }
                });
                expect( stub.called ).to.be.false;
            });

            it('should not set up any collection event listeners if no collection events are set on the view', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "listenTo" );
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection()
                });
                expect( stub.called ).to.be.false;
            });

            it('should add listener if collection and collectionEvents are defined', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "listenTo" );
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection(),
                    collectionEvents: {
                        "add": function() {}
                    }
                });
                expect( stub.called ).to.be.true;
            });

            it('should loop over the collectionEvents and add an event listener for each one', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "listenTo" );
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection(),
                    collectionEvents: {
                        "add": function() {},
                        "change": function() {},
                        "remove": function() {},
                        "sort": function() {}
                    }
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 4 );
            });

            it('should set listener callback as the collectionEvent function if collectionEvent value is a function', function() {
                var func = function( value ) {
                    console.log( value );
                };
                stub = sinon.stub( CollectionEventsView.prototype, "listenTo" );
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection(),
                    collectionEvents: {
                        "add": func
                    }
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.collection, "add", func ) ).to.be.true;
            });

            it('should not set listener callback if collectionEvent value is a string but no function is defined on the view with that name', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "listenTo" );
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection(),
                    collectionEvents: {
                        "add": "test"
                    }
                });
                expect( stub.called ).to.be.false;
            });

            it('should set listener callback if collectionEvent value is a string with a function defined on the view with that name', function() {
                var func = function( value ) {
                    console.log( value );
                };
                stub = sinon.stub( CollectionEventsView.prototype, "listenTo" );
                CollectionEventsView.prototype.test = func;
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection(),
                    collectionEvents: {
                        "add": "test"
                    }
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.collection, "add", func ) ).to.be.true;
            });
        });

        describe('unbindCollectionEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                CollectionEventsView = Backbone.View.extend();
                CollectionEventsMixin.call( CollectionEventsView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should not remove any collection event listeners if no collection is set on the view', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "stopListening" );
                // Create view
                view = new CollectionEventsView({
                    collectionEvents: {
                        "add": function() {}
                    }
                });
                view.unbindCollectionEvents();
                expect( stub.called ).to.be.false;
            });

            it('should not remove any collection event listeners if no collection events are set on the view', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "stopListening" );
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection()
                });
                view.unbindCollectionEvents();
                expect( stub.called ).to.be.false;
            });

            it('should remove listener if collection and collectionEvents are defined', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "stopListening" );
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection(),
                    collectionEvents: {
                        "add": function() {}
                    }
                });
                view.unbindCollectionEvents();
                expect( stub.called ).to.be.true;
            });

            it('should loop over the collectionEvents and remove an event listener for each one', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "stopListening" );
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection(),
                    collectionEvents: {
                        "add": function() {},
                        "change": function() {},
                        "remove": function() {},
                        "sort": function() {}
                    }
                });
                view.unbindCollectionEvents();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 4 );
            });

            it('should remove listener callback as the collectionEvent function if collectionEvent value is a function', function() {
                var func = function( value ) {
                    console.log( value );
                };
                stub = sinon.stub( CollectionEventsView.prototype, "stopListening" );
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection(),
                    collectionEvents: {
                        "add": func
                    }
                });
                view.unbindCollectionEvents();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.collection, "add", func ) ).to.be.true;
            });

            it('should not remove listener callback if collectionEvent value is a string but no function is defined on the view with that name', function() {
                stub = sinon.stub( CollectionEventsView.prototype, "stopListening" );
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection(),
                    collectionEvents: {
                        "add": "test"
                    }
                });
                view.unbindCollectionEvents();
                expect( stub.called ).to.be.false;
            });

            it('should remove listener callback if collectionEvent value is a string with a function defined on the view with that name', function() {
                var func = function( value ) {
                    console.log( value );
                };
                stub = sinon.stub( CollectionEventsView.prototype, "stopListening" );
                CollectionEventsView.prototype.test = func;
                // Create view
                view = new CollectionEventsView({
                    collection: new Backbone.Collection(),
                    collectionEvents: {
                        "add": "test"
                    }
                });
                view.unbindCollectionEvents();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.collection, "add", func ) ).to.be.true;
            });
        });
    });
}));
