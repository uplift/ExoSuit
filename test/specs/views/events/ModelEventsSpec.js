(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'views/events/ModelEvents'
            ],
            function( Backbone, ModelEventsMixin ) {
                factory( Backbone, root.expect, ModelEventsMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        // Uses jquery which needs window object so don't run these tests in node
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.ExoSuit.Mixins.ModelEventsMixin );
    }
}( this, function( Backbone, expect, ModelEventsMixin ) {
    describe('Model Events View Mixin', function () {
        var view, ModelEventsView, stub, oldMethodStub;

        describe('initialize()', function () {
            beforeEach(function() {
                // Create Binding View definition
                ModelEventsView = Backbone.View.extend();
                oldMethodStub = sinon.stub( ModelEventsView.prototype, "initialize" );
                ModelEventsMixin.call( ModelEventsView.prototype );
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
                view = new ModelEventsView();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should set modelEvents if modelEvents is defined in options argument', function() {
                var events = {
                    "change": function() {}
                };
                // Create view
                view = new ModelEventsView({
                    modelEvents: events
                });
                expect( view.modelEvents ).to.deep.equal( events );
            });
        });

        describe('delegateEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                ModelEventsView = Backbone.View.extend();
                oldMethodStub = sinon.stub( ModelEventsView.prototype, "delegateEvents" );
                ModelEventsMixin.call( ModelEventsView.prototype );
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
                view = new ModelEventsView();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should call bindModelEvents function', function() {
                stub = sinon.stub( ModelEventsView.prototype, "bindModelEvents" );
                // Create view
                view = new ModelEventsView();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });
        });

        describe('undelegateEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                ModelEventsView = Backbone.View.extend();
                oldMethodStub = sinon.stub( ModelEventsView.prototype, "undelegateEvents" );
                ModelEventsMixin.call( ModelEventsView.prototype );
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
                view = new ModelEventsView();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should call unbindModelEvents function', function() {
                stub = sinon.stub( ModelEventsView.prototype, "unbindModelEvents" );
                // Create view
                view = new ModelEventsView();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });
        });

        describe('bindModelEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                ModelEventsView = Backbone.View.extend();
                ModelEventsMixin.call( ModelEventsView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should not set up any model event listeners if no model is set on the view', function() {
                stub = sinon.stub( ModelEventsView.prototype, "listenTo" );
                // Create view
                view = new ModelEventsView({
                    modelEvents: {
                        "change": function() {}
                    }
                });
                expect( stub.called ).to.be.false;
            });

            it('should not set up any model event listeners if no model events are set on the view', function() {
                stub = sinon.stub( ModelEventsView.prototype, "listenTo" );
                // Create view
                view = new ModelEventsView({
                    model: new Backbone.Model()
                });
                expect( stub.called ).to.be.false;
            });

            it('should add listener if model and modelEvents are defined', function() {
                stub = sinon.stub( ModelEventsView.prototype, "listenTo" );
                // Create view
                view = new ModelEventsView({
                    el: "#test",
                    model: new Backbone.Model(),
                    modelEvents: {
                        "change": function() {}
                    }
                });
                expect( stub.called ).to.be.true;
            });

            it('should loop over the modelEvents and add an event listener for each one', function() {
                stub = sinon.stub( ModelEventsView.prototype, "listenTo" );
                // Create view
                view = new ModelEventsView({
                    model: new Backbone.Model(),
                    modelEvents: {
                        "change": function() {},
                        "change:attr": function() {},
                        "another-event": function() {},
                        "destroy": function() {}
                    }
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 4 );
            });

            it('should set listener callback as the modelEvent function if modelEvent value is a function', function() {
                var func = function( value ) {
                    console.log( value );
                };
                stub = sinon.stub( ModelEventsView.prototype, "listenTo" );
                // Create view
                view = new ModelEventsView({
                    model: new Backbone.Model(),
                    modelEvents: {
                        "change": func
                    }
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.model, "change", func ) ).to.be.true;
            });

            it('should not set listener callback if modelEvent value is a string but no function is defined on the view with that name', function() {
                stub = sinon.stub( ModelEventsView.prototype, "listenTo" );
                // Create view
                view = new ModelEventsView({
                    model: new Backbone.Model(),
                    modelEvents: {
                        "change": "test"
                    }
                });
                expect( stub.called ).to.be.false;
            });

            it('should set listener callback if modelEvent value is a string with a function defined on the view with that name', function() {
                var func = function( value ) {
                    console.log( value );
                };
                stub = sinon.stub( ModelEventsView.prototype, "listenTo" );
                ModelEventsView.prototype.test = func;
                // Create view
                view = new ModelEventsView({
                    model: new Backbone.Model(),
                    modelEvents: {
                        "change": "test"
                    }
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.model, "change", func ) ).to.be.true;
            });
        });

        describe('unbindModelEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                ModelEventsView = Backbone.View.extend();
                ModelEventsMixin.call( ModelEventsView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            // Below test unbindModelEvents which is called through undelegateEvents which is called by delegateEvents when view is initialized
            it('should not remove any model event listeners if no model is set on the view', function() {
                stub = sinon.stub( ModelEventsView.prototype, "stopListening" );
                // Create view
                view = new ModelEventsView({
                    modelEvents: {
                        "change": function() {}
                    }
                });
                expect( stub.called ).to.be.false;
            });

            it('should not remove any model event listeners if no model events are set on the view', function() {
                stub = sinon.stub( ModelEventsView.prototype, "stopListening" );
                // Create view
                view = new ModelEventsView({
                    model: new Backbone.Model()
                });
                expect( stub.called ).to.be.false;
            });

            it('should remove listener if model and modelEvents are defined', function() {
                stub = sinon.stub( ModelEventsView.prototype, "stopListening" );
                // Create view
                view = new ModelEventsView({
                    el: "#test",
                    model: new Backbone.Model(),
                    modelEvents: {
                        "change": function() {}
                    }
                });
                expect( stub.called ).to.be.true;
            });

            it('should loop over the modelEvents and remove an event listener for each one', function() {
                stub = sinon.stub( ModelEventsView.prototype, "stopListening" );
                // Create view
                view = new ModelEventsView({
                    model: new Backbone.Model(),
                    modelEvents: {
                        "change": function() {},
                        "change:attr": function() {},
                        "another-event": function() {},
                        "destroy": function() {}
                    }
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 4 );
            });

            it('should remove listener callback as the modelEvent function if modelEvent value is a function', function() {
                var func = function( value ) {
                    console.log( value );
                };
                stub = sinon.stub( ModelEventsView.prototype, "stopListening" );
                // Create view
                view = new ModelEventsView({
                    model: new Backbone.Model(),
                    modelEvents: {
                        "change": func
                    }
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.model, "change", func ) ).to.be.true;
            });

            it('should not remove listener callback if modelEvent value is a string but no function is defined on the view with that name', function() {
                stub = sinon.stub( ModelEventsView.prototype, "stopListening" );
                // Create view
                view = new ModelEventsView({
                    model: new Backbone.Model(),
                    modelEvents: {
                        "change": "test"
                    }
                });
                expect( stub.called ).to.be.false;
            });

            it('should remove listener callback if modelEvent value is a string with a function defined on the view with that name', function() {
                var func = function( value ) {
                    console.log( value );
                };
                stub = sinon.stub( ModelEventsView.prototype, "stopListening" );
                ModelEventsView.prototype.test = func;
                // Create view
                view = new ModelEventsView({
                    model: new Backbone.Model(),
                    modelEvents: {
                        "change": "test"
                    }
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.model, "change", func ) ).to.be.true;
            });
        });
    });
}));
