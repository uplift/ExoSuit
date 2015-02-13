(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'sinon',
                'ExoSuit'
            ],
            function( Backbone, sinon, ExoSuit ) {
                factory( Backbone, root.expect, sinon, ExoSuit );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var sinon = require( 'sinon' );
        var ExoSuit = require( '../../src/ExoSuit' );
        factory( Backbone, expect, sinon, ExoSuit );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.sinon, root.ExoSuit );
    }
}( this, function( Backbone, expect, sinon, ExoSuit ) {
    describe('ExoSuit Mixin ', function () {
        var Module, MixinModule, oldMethodSpy;

        describe('MixinExtend()', function () {
            beforeEach(function() {
                oldMethodSpy = sinon.spy( Backbone.Model, "extend" );
                MixinModule = Backbone.Model.extend();
                oldMethodSpy.reset();
                MixinModule.extend = ExoSuit.MixinExtend;
            });

            afterEach(function() {
                oldMethodSpy.restore();
            });

            it('should call old extend function', function() {
                Module = MixinModule.extend({
                    mixins: [ function() {}, function() {} ],
                    url: "/test/some/path"
                });
                expect( oldMethodSpy.called ).to.be.true;
                expect( oldMethodSpy.callCount ).to.equal( 1 );
                expect( oldMethodSpy.calledWith( {
                    url: "/test/some/path"
                } ) ).to.be.true;
            });

            it('should run mixin functions', function() {
                var dummyMixin = function() {
                    this.newProp = "test";
                };
                Module = MixinModule.extend({
                    mixins: [ dummyMixin ],
                    url: "/test/some/path"
                });
                expect( Module.prototype.newProp ).to.equal( "test" );
            });

            it('should run multiple mixin functions with last defined mixin overriding any set properties', function() {
                var dummyMixinOne = function() {
                    this.newProp = "hello";
                };
                var dummyMixinTwo = function() {
                    this.newProp = "world";
                };
                Module = MixinModule.extend({
                    mixins: [ dummyMixinOne, dummyMixinTwo ],
                    url: "/test/some/path"
                });
                expect( Module.prototype.newProp ).to.equal( "world" );
            });
        });

        describe('ExoSuit.Collection()', function () {
            it('should be an instance of Backbone.Collection', function() {
                var collection = new ExoSuit.Collection();
                expect( collection instanceof Backbone.Collection ).to.be.true;
            });

            it('should have mixin extend method as the class extend method', function() {
                expect( ExoSuit.Collection.extend ).to.equal( ExoSuit.MixinExtend );
            });
        });

        describe('ExoSuit.Model()', function () {
            it('should be an instance of Backbone.Model', function() {
                var model = new ExoSuit.Model();
                expect( model instanceof Backbone.Model ).to.be.true;
            });

            it('should have mixin extend method as the class extend method', function() {
                expect( ExoSuit.Model.extend ).to.equal( ExoSuit.MixinExtend );
            });
        });

        describe('ExoSuit.View()', function () {
            it('should be an instance of Backbone.View', function() {
                var view = new ExoSuit.View();
                expect( view instanceof Backbone.View ).to.be.true;
            });

            it('should have mixin extend method as the class extend method', function() {
                expect( ExoSuit.View.extend ).to.equal( ExoSuit.MixinExtend );
            });
        });

        describe('ExoSuit.Router()', function () {
            it('should be an instance of Backbone.Router', function() {
                var router = new ExoSuit.Router();
                expect( router instanceof Backbone.Router ).to.be.true;
            });

            it('should have mixin extend method as the class extend method', function() {
                expect( ExoSuit.Router.extend ).to.equal( ExoSuit.MixinExtend );
            });
        });
    });
}));
