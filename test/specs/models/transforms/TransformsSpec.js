(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'sinon',
                'models/transforms/Transforms'
            ],
            function( Backbone, sinon, TransformMixin ) {
                factory( Backbone, root.expect, sinon, TransformMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var sinon = require( 'sinon' );
        var Backbone = require( 'backbone' );
        var TransformMixin = require( '../../../../src/models/transforms/Transforms' );
        factory( Backbone, expect, sinon, TransformMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.sinon, root.ExoSuit.Mixins.TransformMixin );
    }
}( this, function( Backbone, expect, sinon, TransformMixin ) {
    describe('Transform Model Mixin ', function () {
        var model, TransformModel, oldMethodStub, stub;

        describe('_transformData()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                TransformModel = Backbone.Model.extend({
                    transformations: {
                        "test": {
                            deserialize: function( value ) {
                                return value ? String( value ) : null;
                            },
                            serialize: function( value ) {
                                return value ? String( value ) + " world" : null;
                            }
                        }
                    }
                });
                TransformMixin.call( TransformModel.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should return data as is if serialize is not a boolean', function() {
                TransformModel.prototype.transforms = {
                    key1: "string",
                    key2: "number",
                    key3: "boolean",
                    key4: "test"
                };
                // Create model
                model = new TransformModel();
                var data = model._transformData({
                    key1: 20,
                    key2: "450",
                    key3: "1",
                    key4: "hello"
                });
                expect( data ).to.deep.equal({
                    key1: 20,
                    key2: "450",
                    key3: "1",
                    key4: "hello"
                });
                data = model._transformData({
                    key1: 20,
                    key2: "450",
                    key3: "1",
                    key4: "hello"
                }, 1);
                expect( data ).to.deep.equal({
                    key1: 20,
                    key2: "450",
                    key3: "1",
                    key4: "hello"
                });
                data = model._transformData({
                    key1: 20,
                    key2: "450",
                    key3: "1",
                    key4: "hello"
                }, "true");
                expect( data ).to.deep.equal({
                    key1: 20,
                    key2: "450",
                    key3: "1",
                    key4: "hello"
                });
            });

            it('should deserialize transform attributes if transforms are defined on the model and false is passed as serialize argument', function() {
                TransformModel.prototype.transforms = {
                    key1: "string",
                    key2: "number",
                    key3: "boolean",
                    key4: "test"
                };
                // Create model
                model = new TransformModel();
                var data = model._transformData({
                    key1: 20,
                    key2: "450",
                    key3: "1",
                    key4: "hello"
                }, false);
                expect( data ).to.deep.equal({
                    key1: "20",
                    key2: 450,
                    key3: true,
                    key4: "hello"
                });
            });

            it('should serialize transform attributes if transforms are defined on the model and true is passed as serialize argument', function() {
                TransformModel.prototype.transforms = {
                    key1: "string",
                    key2: "number",
                    key3: "boolean",
                    key4: "test"
                };
                // Create model
                model = new TransformModel();
                var data = model._transformData({
                    key1: 20,
                    key2: "450",
                    key3: "1",
                    key4: "hello"
                }, true);
                expect( data ).to.deep.equal({
                    key1: "20",
                    key2: 450,
                    key3: true,
                    key4: "hello world"
                });
            });

            it('should transform nested attributes if transforms are defined on the model', function() {
                TransformModel.prototype.transforms = {
                    "key1.prop": "test"
                };
                // Create model
                model = new TransformModel();
                var data = model._transformData({
                    key1: {
                        prop: 20
                    }
                }, false );
                expect( data ).to.deep.equal({
                    key1: {
                        prop: "20"
                    }
                });
                data = model._transformData({
                    key1: {
                        prop: 20
                    }
                }, true );
                expect( data ).to.deep.equal({
                    key1: {
                        prop: "20 world"
                    }
                });
            });
        });

        describe('parse()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                TransformModel = Backbone.Model.extend({
                    transformations: {
                        "test": {
                            deserialize: function( value ) {
                                return value ? String( value ) : null;
                            },
                            serialize: function( value ) {
                                return value ? String( value ) + ".suffix" : null;
                            }
                        }
                    }
                });
                oldMethodStub = sinon.stub( TransformModel.prototype, "parse" );
                TransformMixin.call( TransformModel.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should pass arguments to super parse untouched if no transforms are defined', function() {
                // Create model
                model = new TransformModel();
                model.parse(
                    {
                        key1: "value1",
                        key2: "value2",
                        key3: "value3"
                    },
                    {
                        test: true
                    }
                );
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                expect( oldMethodStub.calledWith(
                    {
                        key1: "value1",
                        key2: "value2",
                        key3: "value3"
                    },
                    {
                        test: true
                    }
                ) ).to.be.true;
            });

            it('should call _transformData if transforms are defined on the model', function() {
                // Create model
                model = new TransformModel();
                stub = sinon.stub( model, "_transformData" );
                model.parse({
                    key1: 20,
                    key2: "450",
                    key3: "1"
                });
                expect( stub.called ).to.be.false;
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                TransformModel.prototype.transforms = {
                    key1: "string",
                    key2: "number",
                    key3: "boolean"
                };
                model = new TransformModel();
                stub = sinon.stub( model, "_transformData" );
                model.parse({
                    key1: 20,
                    key2: "450",
                    key3: "1"
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( {
                    key1: 20,
                    key2: "450",
                    key3: "1"
                }, false ) ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 2 );
            });
        });

        describe('toJSON()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                TransformModel = Backbone.Model.extend();
                oldMethodStub = sinon.stub( TransformModel.prototype, "toJSON" );
                TransformMixin.call( TransformModel.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should call super toJSON method', function() {
                // Create model
                model = new TransformModel();
                model.toJSON();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should call _transformData if transforms are defined on the model', function() {
                // Create model
                model = new TransformModel();
                stub = sinon.stub( model, "_transformData" );
                model.toJSON();
                expect( stub.called ).to.be.false;
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                TransformModel.prototype.transforms = {
                    key1: "string",
                    key2: "number",
                    key3: "boolean"
                };
                model = new TransformModel();
                stub = sinon.stub( model, "_transformData" );
                model.toJSON();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( oldMethodStub.callCount ).to.equal( 2 );
            });
        });

        describe('sync()', function () {
            beforeEach(function() {
                // Create Exclude Model definition
                TransformModel = Backbone.Model.extend();
                oldMethodStub = sinon.stub( TransformModel.prototype, "sync" );
                TransformMixin.call( TransformModel.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should call super sync untouched if options,patch isnt true', function() {
                // Create model
                model = new TransformModel();
                model.sync( "update", model, {} );
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                expect( oldMethodStub.calledWith( "update", model, {} ) ).to.be.true;
            });

            it('should transform attributes if method equals patch and transforms are defined on the model', function() {
                TransformModel.prototype.transforms = {
                    key1: "string",
                    key2: "number",
                    key3: "boolean"
                };
                // Create model
                model = new TransformModel();
                stub = sinon.stub( model, "_transformData" );
                model.sync( "patch", model, {
                    attrs: {
                        key1: 20,
                        key2: "450",
                        key3: "1"
                    }
                } );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( {
                    key1: 20,
                    key2: "450",
                    key3: "1"
                }, true ) ).to.be.true;
            });
        });
    });
}));
