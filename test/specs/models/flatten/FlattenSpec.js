(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'sinon',
                'models/flatten/Flatten'
            ],
            function( Backbone, sinon, FlattenMixin ) {
                factory( Backbone, root.expect, sinon, FlattenMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var sinon = require( 'sinon' );
        var Backbone = require( 'backbone' );
        var FlattenMixin = require( '../../../../src/models/flatten/Flatten' );
        factory( Backbone, expect, sinon, FlattenMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.sinon, root.ExoSuit.Mixins.FlattenMixin );
    }
}( this, function( Backbone, expect, sinon, FlattenMixin ) {
    describe('Flatten Model Mixin ', function () {
        var model, FlattenModel, stub;

        describe('flatten()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                FlattenModel = Backbone.Model.extend();
                FlattenMixin.call( FlattenModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should call _flatten with model attributes when no attrs argument is supplied', function() {
                // Create model
                model = new FlattenModel();
                stub = sinon.stub( model, "_flatten" );
                model.set({
                    key1: "value1",
                    key2: "value2",
                    key3: "value3"
                });
                model.flatten();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( {
                    key1: "value1",
                    key2: "value2",
                    key3: "value3"
                } ) ).to.be.true;
            });

            it('should call _flatten with attrs argument', function() {
                // Create model
                model = new FlattenModel();
                stub = sinon.stub( model, "_flatten" );
                model.set({
                    key1: "value1",
                    key2: "value2",
                    key3: "value3"
                });
                model.flatten({
                    key2: "value1",
                    key5: "value2"
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( {
                    key2: "value1",
                    key5: "value2"
                } ) ).to.be.true;
            });
        });

        describe('_flatten()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                FlattenModel = Backbone.Model.extend();
                FlattenMixin.call( FlattenModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should return single depth object untouched', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._flatten({
                    key2: "value1",
                    key5: "value2"
                });
                expect( flat ).to.deep.equal( {
                    key2: "value1",
                    key5: "value2"
                } );
            });

            it('should return nested objects as a single depth object with the key being the path to the property separated by .(period)', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._flatten({
                    key1: {
                        "nested1": "value1",
                        "nested2": {
                            "nested3": "value3"
                        }
                    },
                    key2: "value2"
                });
                expect( flat ).to.deep.equal( {
                    "key1.nested1": "value1",
                    "key1.nested2.nested3": "value3",
                    "key2": "value2"
                } );
            });

            it('should return nested arrays as a single depth object with the key being the path to the property separated by .INDEX.', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._flatten({
                    key1: {
                        "nested1": [ "value1", "value2" ]
                    },
                    key2: [
                        {
                            "nested2": "value3",
                            "nested3": "value4"
                        },
                        "value5",
                        {
                            "nested4": "value6"
                        }
                    ]
                });
                expect( flat ).to.deep.equal( {
                    "key1.nested1.0": "value1",
                    "key1.nested1.1": "value2",
                    "key2.0.nested2": "value3",
                    "key2.0.nested3": "value4",
                    "key2.1": "value5",
                    "key2.2.nested4": "value6"
                } );
            });

            it('should return nested Backbone models as a single depth object by calling its toJSON and iterating over the model structure', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._flatten({
                    key1:  new Backbone.Model({
                        "nested1": {
                            "nested2": "value1",
                            "nested3": "value2"
                        },
                        "nested4": "value3",
                        "nested5":[
                            {
                                "nested6": "value4"
                            }
                        ]
                    })
                });
                expect( flat ).to.deep.equal( {
                    "key1.nested1.nested2": "value1",
                    "key1.nested1.nested3": "value2",
                    "key1.nested4": "value3",
                    "key1.nested5.0.nested6": "value4"
                } );
            });

            it('should return nested Backbone collections as a single depth object by calling its toJSON and iterating over the collection structure', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._flatten({
                    key1:  new Backbone.Collection([
                        {
                            "nested1": {
                                "nested2": "value1",
                                "nested3": "value2"
                            }
                        },
                        {
                            "nested4": "value3"
                        },
                        {
                            "nested5":[
                                {
                                    "nested6": "value4"
                                }
                            ]
                        }
                    ])
                });
                expect( flat ).to.deep.equal( {
                    "key1.0.nested1.nested2": "value1",
                    "key1.0.nested1.nested3": "value2",
                    "key1.1.nested4": "value3",
                    "key1.2.nested5.0.nested6": "value4"
                } );
            });

            it('should return single depth object attached to the scope argument if set', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._flatten({
                    key1: {
                        "nested1": [ "value1", "value2" ]
                    },
                    key2: [
                        {
                            "nested2": "value3",
                            "nested3": "value4"
                        },
                        "value5",
                        {
                            "nested4": "value6"
                        }
                    ]
                }, { "scope.test" : "scope value" } );
                expect( flat ).to.deep.equal( {
                    "scope.test" : "scope value",
                    "key1.nested1.0": "value1",
                    "key1.nested1.1": "value2",
                    "key2.0.nested2": "value3",
                    "key2.0.nested3": "value4",
                    "key2.1": "value5",
                    "key2.2.nested4": "value6"
                } );
            });

            it('should return single depth object with all the keys prefixed with the prefixed argument if set', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._flatten({
                    key1: {
                        "nested1": [ "value1", "value2" ]
                    },
                    key2: [
                        {
                            "nested2": "value3",
                            "nested3": "value4"
                        },
                        "value5",
                        {
                            "nested4": "value6"
                        }
                    ]
                }, null, "prefixed." );
                expect( flat ).to.deep.equal( {
                    "prefixed.key1.nested1.0": "value1",
                    "prefixed.key1.nested1.1": "value2",
                    "prefixed.key2.0.nested2": "value3",
                    "prefixed.key2.0.nested3": "value4",
                    "prefixed.key2.1": "value5",
                    "prefixed.key2.2.nested4": "value6"
                } );
            });
        });

        describe('unflatten()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                FlattenModel = Backbone.Model.extend();
                FlattenMixin.call( FlattenModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should call _unflatten with attrs argument', function() {
                // Create model
                model = new FlattenModel();
                stub = sinon.stub( model, "_unflatten" );
                model.set({
                    key1: "value1",
                    key2: "value2",
                    key3: "value3"
                });
                model.unflatten({
                    key2: "value1",
                    key5: "value2"
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( {
                    key2: "value1",
                    key5: "value2"
                } ) ).to.be.true;
            });
        });

        describe('_unflatten()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                FlattenModel = Backbone.Model.extend();
                FlattenMixin.call( FlattenModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should return single depth object untouched', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._unflatten({
                    key2: "value1",
                    key5: "value2"
                });
                expect( flat ).to.deep.equal( {
                    key2: "value1",
                    key5: "value2"
                } );
            });

            it('should return nested objects keys back to an object', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._unflatten({
                    "key1.nested1": "value1",
                    "key1.nested2.nested3": "value3",
                    "key2": "value2"
                });
                expect( flat ).to.deep.equal( {
                    key1: {
                        "nested1": "value1",
                        "nested2": {
                            "nested3": "value3"
                        }
                    },
                    key2: "value2"
                } );
            });

            it('should return arrays keys back to an array', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._unflatten({
                    "key1.nested1.0": "value1",
                    "key1.nested1.1": "value2",
                    "key2.0.nested2": "value3",
                    "key2.0.nested3": "value4",
                    "key2.1": "value5",
                    "key2.2.nested4": "value6"
                });
                expect( flat ).to.deep.equal( {
                    key1: {
                        "nested1": [ "value1", "value2" ]
                    },
                    key2: [
                        {
                            "nested2": "value3",
                            "nested3": "value4"
                        },
                        "value5",
                        {
                            "nested4": "value6"
                        }
                    ]
                } );
            });

            it('should remove any undefined values within sparse arrays created during the unflattening', function() {
                // Create model
                model = new FlattenModel();
                var flat = model._unflatten({
                    "key1.0": "value1",
                    "key1.2": "value2",
                    "key1.4.nested4": "value6"
                });
                expect( flat ).to.deep.equal( {
                    key1: [
                        "value1",
                        "value2",
                        {
                            "nested4": "value6"
                        }
                    ]
                } );
                expect( flat.key1.length ).to.equal( 3 );
            });
        });
    });
}));
