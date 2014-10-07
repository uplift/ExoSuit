(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'models/exclude-from-json/ExcludeFromJson'
            ],
            function( Backbone, ExcludeFromJSONMixin ) {
                factory( Backbone, root.expect, ExcludeFromJSONMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var ExcludeFromJSONMixin = require( '../../../../src/models/exclude-from-json/ExcludeFromJson' );
        factory( Backbone, expect, ExcludeFromJSONMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.ExoSuit.Mixins.ExcludeFromJSONMixin );
    }
}( this, function( Backbone, expect, ExcludeFromJSONMixin ) {
    describe('Exclude From JSON Model Mixin ', function () {
        var model, ExcludeModel;

        before(function() {
            // Create Exclude Model definition
            ExcludeModel = Backbone.Model.extend();
            ExcludeFromJSONMixin.call( ExcludeModel.prototype );
        });

        describe('toJSON()', function () {
            it('should return json whole if no excludeFromJSON property is set', function() {
                // Create model
                model = new ExcludeModel();
                model.set({
                    key1: "value1",
                    key2: "value2",
                    key3: "value3"
                });
                var json = model.toJSON();
                expect( json ).to.be.an( 'object' );
                expect( json ).to.deep.equal({
                    key1: "value1",
                    key2: "value2",
                    key3: "value3"
                });
            });

            it('should return json with excludeFromJSON keys removed', function() {
                // Create model
                ExcludeModel.prototype.excludeFromJSON = [ 'key2' ];
                model = new ExcludeModel();
                model.set({
                    key1: "value1",
                    key2: "value2",
                    key3: "value3"
                });
                var json = model.toJSON();
                expect( json ).to.be.an( 'object' );
                expect( json ).to.deep.equal({
                    key1: "value1",
                    key3: "value3"
                });
            });

            it('should ignore any properties from excludeFromJSON that arent in the model json', function() {
                // Create model
                ExcludeModel.prototype.excludeFromJSON = [ 'key2', 'key4' ];
                model = new ExcludeModel();
                model.set({
                    key1: "value1",
                    key2: "value2",
                    key3: "value3"
                });
                var json = model.toJSON();
                expect( json ).to.be.an( 'object' );
                expect( json ).to.deep.equal({
                    key1: "value1",
                    key3: "value3"
                });
            });

            it('should exclude nested json keys with dot notation structure of nested object', function() {
                // Create model
                ExcludeModel.prototype.excludeFromJSON = [ 'key2.0.arrayChild' ];
                model = new ExcludeModel();
                model.set({
                    key1: {
                        childKey: "value1"
                    },
                    key2: [ { arrayChild: "value2" }, 'hello' ],
                    key3: "value3"
                });
                var json = model.toJSON();
                expect( json ).to.be.an( 'object' );
                expect( json ).to.deep.equal({
                    key1: {
                        childKey: "value1"
                    },
                    key2: [ 'hello' ],
                    key3: "value3"
                });
            });

            it('should remove parent when all child properties of object are removed', function() {
                // Create model
                ExcludeModel.prototype.excludeFromJSON = [ 'key1.childKey', 'key2.0', 'key2.1' ];
                model = new ExcludeModel();
                model.set({
                    key1: {
                        childKey: "value1"
                    },
                    key2: [ 'world', 'hello' ],
                    key3: "value3"
                });
                var json = model.toJSON();
                expect( json ).to.be.an( 'object' );
                expect( json ).to.deep.equal({
                    key3: "value3"
                });
            });

            it('should remove all parents when all child properties of object are removed', function() {
                // Create model
                ExcludeModel.prototype.excludeFromJSON = [ 'key1.0.arrayChild', 'key1.1' ];
                model = new ExcludeModel();
                model.set({
                    key1: [ { arrayChild: "value1" }, { secondChild: "value1" } ],
                    key2: "value2"
                });
                var json = model.toJSON();
                expect( json ).to.be.an( 'object' );
                expect( json ).to.deep.equal({
                    key2: "value2"
                });
            });

            it('should remove all child properties of object when parent is removed', function() {
                // Create model
                ExcludeModel.prototype.excludeFromJSON = [ 'key1', 'key2.0', 'key2.1' ];
                model = new ExcludeModel();
                model.set({
                    key1: {
                        childKey: "value1"
                    },
                    key2: [ { arrayChild: "value2" }, 'hello' ],
                    key3: "value3"
                });
                var json = model.toJSON();
                expect( json ).to.be.an( 'object' );
                expect( json ).to.deep.equal({
                    key3: "value3"
                });
            });
        });
    });
}));
