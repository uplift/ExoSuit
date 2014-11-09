(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'routers/parse/ParseQueryString'
            ],
            function( Backbone, ParseQueryStringMixin ) {
                factory( Backbone, root.expect, root.sinon, ParseQueryStringMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var sinon = require( 'sinon' );
        var Backbone = require( 'backbone' );
        var ParseQueryStringMixin = require( '../../../../src/routers/parse/ParseQueryString' );
        factory( Backbone, expect, sinon, ParseQueryStringMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.sinon, root.ExoSuit.Mixins.ParseQueryStringMixin );
    }
}( this, function( Backbone, expect, sinon, ParseQueryStringMixin ) {
    describe('Parse Query String Router Mixin ', function () {
        var router, Router, stub, oldMethodStub;

        describe('_parseQueryString()', function () {
            beforeEach(function() {
                // Create Router definition
                Router = Backbone.Router.extend();
                ParseQueryStringMixin.call( Router.prototype );
            });

            it('should parse a single querystring', function() {
                // Create router
                var router = new Router();
                expect( router._parseQueryString( "testing=123" ) ).to.deep.equal( { "testing" : "123" } );
            });

            it('should parse mutiple querystrings', function() {
                // Create router
                var router = new Router();
                expect( router._parseQueryString( "testing=123&hello=world" ) ).to.deep.equal( { "testing" : "123", "hello" : "world" } );
            });

            it('should parse querystrings with multiples of the same key', function() {
                // Create router
                var router = new Router();
                expect( router._parseQueryString( "hello=world&hello=planet" ) ).to.deep.equal( { "hello" : [ "world", "planet" ] } );
                expect( router._parseQueryString( "hello=world&hello=planet&hello=galaxy" ) ).to.deep.equal( { "hello" : [ "world", "planet", "galaxy" ] } );
                expect( router._parseQueryString( "hello=world&testing=123&hello=planet" ) ).to.deep.equal( { "hello" : [ "world", "planet" ], "testing" : "123" } );
            });

            it('should parse querystrings without values as null values', function() {
                // Create router
                var router = new Router();
                expect( router._parseQueryString( "testing" ) ).to.deep.equal( { "testing" : null } );
                expect( router._parseQueryString( "testing&hello" ) ).to.deep.equal( { "testing" : null, "hello" :  null } );
                expect( router._parseQueryString( "testing=123&hello" ) ).to.deep.equal( { "testing" : "123", "hello" :  null } );
                expect( router._parseQueryString( "testing=123&hello&goodbye=test" ) ).to.deep.equal( { "testing" : "123", "hello" :  null, "goodbye" : "test" } );
            });

            it('should return empty object for non string inputs', function() {
                // Create router
                var router = new Router();
                expect( router._parseQueryString() ).to.deep.equal( {} );
                expect( router._parseQueryString( true ) ).to.deep.equal( {} );
                expect( router._parseQueryString( 123 ) ).to.deep.equal( {} );
                expect( router._parseQueryString( { "hello" : "world" } ) ).to.deep.equal( {} );
                expect( router._parseQueryString( [ "hello=world" ] ) ).to.deep.equal( {} );
            });

            it('should handle encoded values by decoding them', function() {
                // Create router
                var router = new Router();
                expect( router._parseQueryString( "testing%20123=hello%20world" ) ).to.deep.equal( { "testing 123" : "hello world" } );
            });

            it('should handle + characters by replacing them with a space', function() {
                // Create router
                var router = new Router();
                expect( router._parseQueryString( "testing+123=hello+world" ) ).to.deep.equal( { "testing 123" : "hello world" } );
            });
        });

        describe('execute()', function () {
            beforeEach(function() {
                // Create Router definition
                Router = Backbone.Router.extend();
                oldMethodStub = sinon.stub( Router.prototype, "execute" );
                ParseQueryStringMixin.call( Router.prototype );
            });

            afterEach(function() {
                // Clean up any stubs
                stub.restore();
                oldMethodStub.restore();
            });

            it('should call _parseQueryString method with querystring args', function() {
                var callback = sinon.stub(),
                    args = [ "hello=world" ];

                // Stub function that is used internally
                stub = sinon.stub( Router.prototype, "_parseQueryString" );
                // Create view
                var router = new Router();
                router.execute( callback, args, "test" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "hello=world" ) ).to.be.true;
            });

            it('should call old execute method when execute is called', function() {
                var callback = sinon.stub(),
                    args = [ "hello=world" ],
                    params = { "hello" : "world" };

                // Stub function that is used internally
                stub = sinon.stub( Router.prototype, "_parseQueryString" ).returns( params );
                // Create view
                var router = new Router();
                router.execute( callback, args, "test" );
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                expect( oldMethodStub.calledWith( callback, [ params ], "test" ) ).to.be.true;
            });
        });
    });
}));
