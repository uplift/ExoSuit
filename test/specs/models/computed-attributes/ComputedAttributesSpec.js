(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'underscore',
                'sinon',
                'models/computed-attributes/ComputedAttributes'
            ],
            function( Backbone, _, sinon, ComputedAttributesMixin ) {
                factory( Backbone, _, root.expect, sinon, ComputedAttributesMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var sinon = require( 'sinon' );
        var Backbone = require( 'backbone' );
        var _ = require( 'underscore' );
        var ComputedAttributesMixin = require( '../../../../src/models/computed-attributes/ComputedAttributes' );
        factory( Backbone, _, expect, sinon, ComputedAttributesMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root._, root.expect, root.sinon, root.ExoSuit.Mixins.ComputedAttributesMixin );
    }
}( this, function( Backbone, _, expect, sinon, ComputedAttributesMixin ) {
    describe('Computed Attributes Model Mixin ', function () {
        var model, ComputedAttrsModel, stub, oldMethodStub;

        describe('initialize()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                ComputedAttrsModel = Backbone.Model.extend();
                oldMethodStub = sinon.stub( ComputedAttrsModel.prototype, "initialize" );
                ComputedAttributesMixin.call( ComputedAttrsModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should call super initialize method', function() {
                // Create model
                model = new ComputedAttrsModel();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should call setupComputedEvents', function() {
                stub = sinon.stub( ComputedAttrsModel.prototype, "setupComputedEvents" );
                // Create model
                model = new ComputedAttrsModel();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });
        });

        describe('setupComputedEvents()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                ComputedAttrsModel = Backbone.Model.extend({
                    computed: {
                        "propOne": {
                            deps: [ "test" ],
                            get: function() {}
                        },
                        "propTwo": {
                            deps: [ "test" ],
                            get: function() {}
                        }
                    }
                });
                ComputedAttributesMixin.call( ComputedAttrsModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should set up listener for each computed prop', function() {
                // Create model
                model = new ComputedAttrsModel({
                    test: 10
                });
                var temp = sinon.stub( model, "setupDepEvents" );
                stub = sinon.stub( model, "on" );
                model.setupComputedEvents();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 2 );
                temp.restore();
            });

            it('should call setupDepEvents with the prop deps', function() {
                // Create model
                model = new ComputedAttrsModel({
                    test: 10
                });
                stub = sinon.stub( model, "setupDepEvents" );
                model.setupComputedEvents();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 2 );
            });

            it('should call setComputed if model attributes isnt empty', function() {
                // Create model
                model = new ComputedAttrsModel({
                    test: 10
                });
                stub = sinon.stub( model, "setComputed" );
                model.setupComputedEvents();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 2 );
            });
        });

        describe('getDepValues()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                ComputedAttrsModel = Backbone.Model.extend();
                ComputedAttributesMixin.call( ComputedAttrsModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should return model values for the deps passed as an hash object', function() {
                // Create model
                model = new ComputedAttrsModel({
                    test: 10,
                    hello: "world",
                    bool: true
                });
                var depValues = model.getDepValues( [ 'hello', 'bool' ] );
                expect( depValues ).to.deep.equal({
                    hello: "world",
                    bool: true
                });
            });
        });

        describe('updateDeps()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                ComputedAttrsModel = Backbone.Model.extend({
                    computed: {
                        "total": {
                            deps: [ 'score', 'goals' ],
                            get: function() {},
                            set: function( value, fields ) {
                                fields.goals = 1;
                            }
                        },
                        "avg": {
                            deps: [ 'goals', 'mins' ],
                            get: function() {}
                        }
                    }
                });
                ComputedAttributesMixin.call( ComputedAttrsModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should not call set if silentUpdateDeps is passed in the options argument', function() {
                // Create model
                model = new ComputedAttrsModel({
                    score: 3,
                    goals: 4
                });
                stub = sinon.stub( model, "set" );
                model.updateDeps( "total", 10, { silentUpdateDeps: true } );
                expect( stub.called ).to.be.false;
            });

            it('should not call set if computed property doesnt have a set function', function() {
                // Create model
                model = new ComputedAttrsModel({
                    score: 3,
                    goals: 4
                });
                stub = sinon.stub( model, "set" );
                model.updateDeps( "avg", 3 );
                expect( stub.called ).to.be.false;
            });

            it('should call getDepValues with the computed property dependency list', function() {
                // Create model
                model = new ComputedAttrsModel({
                    score: 3,
                    goals: 4
                });
                var temp = sinon.stub( model.computed.total, "set" );
                stub = sinon.stub( model, "getDepValues" );
                model.updateDeps( "total", 5 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ 'score', 'goals' ] ) ).to.be.true;
                temp.restore();
            });

            it('should call the computed property set function passing the changed value and the dependency fields value object', function() {
                // Create model
                model = new ComputedAttrsModel({
                    score: 3,
                    goals: 4
                });
                stub = sinon.stub( model.computed.total, "set" );
                model.updateDeps( "total", 5 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( 5, model.getDepValues( model.computed.total.deps ) ) ).to.be.true;
            });

            it('should call set with the dependency fields value object with any changes caused by the computed property set value', function() {
                // Create model
                model = new ComputedAttrsModel({
                    score: 3,
                    goals: 4
                });
                stub = sinon.stub( model, "set" );
                var fields = model.getDepValues( model.computed.total.deps );
                fields.goals = 1;
                model.updateDeps( "total", 5 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( fields ) ).to.be.true;
            });
        });

        describe('setupDepEvents()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                ComputedAttrsModel = Backbone.Model.extend();
                ComputedAttributesMixin.call( ComputedAttrsModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should add a listener for all dependency properties', function() {
                // Create model
                model = new ComputedAttrsModel();
                stub = sinon.stub( model, "on" );
                model.setupDepEvents( [ 'prop' ] );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "change:prop", model.setComputed ) ).to.be.true;
                stub.reset();
                model.setupDepEvents( [ 'propOne', 'propTwo', 'propThree' ] );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 3 );
            });
        });

        describe('setComputed()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                ComputedAttrsModel = Backbone.Model.extend({
                    computed: {
                        "total": {
                            deps: [ 'score', 'goals' ],
                            get: function( fields ) {
                                return 2;
                            },
                            set: function() {}
                        },
                        "avg": {
                            deps: [ 'goals', 'mins' ],
                            set: function() {}
                        }
                    }
                });
                ComputedAttributesMixin.call( ComputedAttrsModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should not do anything if the computed property doesnt have a get method', function() {
                // Create model
                model = new ComputedAttrsModel({
                    score: 10,
                    goals: 2,
                    mins: 50
                });
                stub = sinon.stub( model, "set" );
                model.setComputed( "avg" );
                expect( stub.called ).to.be.false;
            });

            it('should call getDepValues with the computed property dependency list', function() {
                // Create model
                model = new ComputedAttrsModel({
                    score: 3,
                    goals: 4
                });
                var temp = sinon.stub( model.computed.total, "set" );
                stub = sinon.stub( model, "getDepValues" );
                model.setComputed( "total" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ 'score', 'goals' ] ) ).to.be.true;
                temp.restore();
            });

            it('should call the computed property get function passing the dependency fields value object', function() {
                // Create model
                model = new ComputedAttrsModel({
                    score: 3,
                    goals: 4
                });
                stub = sinon.stub( model.computed.total, "get" );
                model.setComputed( "total" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( model.getDepValues( model.computed.total.deps ) ) ).to.be.true;
            });

            it('should call set the value of the computed property passing in silentUpdateDeps to cyclic loops', function() {
                // Create model
                model = new ComputedAttrsModel({
                    score: 3,
                    goals: 4
                });
                stub = sinon.stub( model, "set" );
                model.setComputed( "total" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "total", 2, { silentUpdateDeps: true } ) ).to.be.true;
            });
        });

        describe('toJSON()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                ComputedAttrsModel = Backbone.Model.extend({
                    computed: {
                        "total": {
                            deps: [ 'score', 'goals' ],
                            get: function( field) {}
                        },
                        "avg": {
                            deps: [ 'goals', 'mins' ],
                            get: function() {}
                        }
                    }
                });
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should call super toJSON method', function() {
                oldMethodStub = sinon.stub( ComputedAttrsModel.prototype, "toJSON" );
                ComputedAttributesMixin.call( ComputedAttrsModel.prototype );
                // Create model
                model = new ComputedAttrsModel({
                    score: 3,
                    goals: 1,
                    mins: 69
                });
                model.toJSON();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should remove all computed properties from the output', function() {
                ComputedAttributesMixin.call( ComputedAttrsModel.prototype );
                // Create model
                model = new ComputedAttrsModel({
                    score: 3,
                    goals: 1,
                    mins: 69
                });
                var data = model.toJSON();
                expect( _.keys( model.attributes ) ).to.deep.equal( [ 'score', 'goals', 'mins', 'total', 'avg' ] );
                expect( _.keys( data ) ).to.deep.equal( [ 'score', 'goals', 'mins' ] );
            });
        });
    });
}));
