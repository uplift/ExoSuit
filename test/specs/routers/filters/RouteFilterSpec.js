(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'sinon',
                'routers/filters/RouteFilter'
            ],
            function( Backbone, sinon, RouteFilterMixin ) {
                factory( Backbone, root.expect, sinon, RouteFilterMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var expect = require( 'chai' ).expect;
        var sinon = require( 'sinon' );
        var Backbone = require( 'backbone' );
        var RouteFilterMixin = require( '../../../../src/routers/filters/RouteFilter' );
        factory( Backbone, expect, sinon, RouteFilterMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.sinon, root.ExoSuit.Mixins.RouteFilterMixin );
    }
}( this, function( Backbone, expect, sinon, RouteFilterMixin ) {
    describe('Route Filter Router Mixin ', function () {
        var router, Router, stub;

        describe('_runRouteFilters()', function () {
            beforeEach(function() {
                // Create Router definition
                Router = Backbone.Router.extend();
                RouteFilterMixin.call( Router.prototype );
            });

            it('should loop round sync filters and execute each of them if none return false', function() {
                var fn1 = sinon.spy( function( args ) { return true; } );
                var fn2 = sinon.spy( function( args ) { return true; } );
                var fn3 = sinon.spy( function( args ) { return true; } );
                // Create view
                var router = new Router();
                router._runRouteFilters( [ fn1, fn2, fn3 ], [ null ] );
                expect( fn1.called ).to.be.true;
                expect( fn1.callCount ).to.equal( 1 );
                expect( fn2.called ).to.be.true;
                expect( fn2.callCount ).to.equal( 1 );
                expect( fn3.called ).to.be.true;
                expect( fn3.callCount ).to.equal( 1 );
            });

            it('should stop the execution of sync filters when one returns false', function() {
                var fn1 = sinon.spy( function( args ) { return true; } );
                var fn2 = sinon.spy( function( args ) { return false; } );
                var fn3 = sinon.spy( function( args ) { return true; } );
                // Create view
                var router = new Router();
                router._runRouteFilters( [ fn1, fn2, fn3 ], [ null ] );
                expect( fn1.called ).to.be.true;
                expect( fn1.callCount ).to.equal( 1 );
                expect( fn2.called ).to.be.true;
                expect( fn2.callCount ).to.equal( 1 );
                expect( fn3.called ).to.be.false;
            });

            it('should loop round async filters and execute each of them if none pass false to next function', function() {
                var fn1 = sinon.spy( function( args, next ) { next( true ); } );
                var fn2 = sinon.spy( function( args, next ) { next( true ); } );
                var fn3 = sinon.spy( function( args, next ) { next( true ); } );
                // Create view
                var router = new Router();
                router._runRouteFilters( [ fn1, fn2, fn3 ], [ null ] );
                expect( fn1.called ).to.be.true;
                expect( fn1.callCount ).to.equal( 1 );
                expect( fn2.called ).to.be.true;
                expect( fn2.callCount ).to.equal( 1 );
                expect( fn3.called ).to.be.true;
                expect( fn3.callCount ).to.equal( 1 );
            });

            it('should stop the execution of async filters when one passes false to next function', function() {
                var fn1 = sinon.spy( function( args, next ) { next( true ); } );
                var fn2 = sinon.spy( function( args, next ) { next( false ); } );
                var fn3 = sinon.spy( function( args, next ) { next( true ); } );
                // Create view
                var router = new Router();
                router._runRouteFilters( [ fn1, fn2, fn3 ], [ null ] );
                expect( fn1.called ).to.be.true;
                expect( fn1.callCount ).to.equal( 1 );
                expect( fn2.called ).to.be.true;
                expect( fn2.callCount ).to.equal( 1 );
                expect( fn3.called ).to.be.false;
            });

            it('should loop round async and sync filters and execute each of them if none pass or return false', function() {
                var fn1 = sinon.spy( function( args ) { return true; } );
                var fn2 = sinon.spy( function( args, next ) { next( true ); } );
                var fn3 = sinon.spy( function( args, next ) { next( true ); } );
                // Create view
                var router = new Router();
                router._runRouteFilters( [ fn1, fn2, fn3 ], [ null ] );
                expect( fn1.called ).to.be.true;
                expect( fn1.callCount ).to.equal( 1 );
                expect( fn2.called ).to.be.true;
                expect( fn2.callCount ).to.equal( 1 );
                expect( fn3.called ).to.be.true;
                expect( fn3.callCount ).to.equal( 1 );
            });

            it('should stop the execution of async and sync filters when an async filter passes false to next function', function() {
                var fn1 = sinon.spy( function( args ) { return true; } );
                var fn2 = sinon.spy( function( args, next ) { next( false ); } );
                var fn3 = sinon.spy( function( args, next ) { next( true ); } );
                // Create view
                var router = new Router();
                router._runRouteFilters( [ fn1, fn2, fn3 ], [ null ] );
                expect( fn1.called ).to.be.true;
                expect( fn1.callCount ).to.equal( 1 );
                expect( fn2.called ).to.be.true;
                expect( fn2.callCount ).to.equal( 1 );
                expect( fn3.called ).to.be.false;
            });

            it('should stop the execution of async and sync filters when an sync filter returns false', function() {
                var fn1 = sinon.spy( function( args, next ) { next( true ); } );
                var fn2 = sinon.spy( function( args ) { return false; } );
                var fn3 = sinon.spy( function( args, next ) { next( true ); } );
                // Create view
                var router = new Router();
                router._runRouteFilters( [ fn1, fn2, fn3 ], [ null ] );
                expect( fn1.called ).to.be.true;
                expect( fn1.callCount ).to.equal( 1 );
                expect( fn2.called ).to.be.true;
                expect( fn2.callCount ).to.equal( 1 );
                expect( fn3.called ).to.be.false;
            });
        });

        describe('execute()', function () {
            beforeEach(function() {
                // Create Router definition
                Router = Backbone.Router.extend({
                    routeConfig: {
                        homepage: {}
                    }
                });
                RouteFilterMixin.call( Router.prototype );
            });

            afterEach(function() {
                // Clean up any stubs
                stub.restore();
            });

            it('should add global leave function to filters array if set', function() {
                // Create view
                var router = new Router();
                router.leave = sinon.spy();
                stub = sinon.stub( router, "_runRouteFilters" );
                router.execute( null, null, "unknown" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ router.leave ] ) ).to.be.true;
            });

            it('should add global before function to filters array if set', function() {
                // Create view
                var router = new Router();
                router.before = sinon.spy();
                stub = sinon.stub( router, "_runRouteFilters" );
                router.execute( null, null, "unknown" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ router.before ] ) ).to.be.true;
            });

            it('should add routeConfig before function to filters array if set', function() {
                // Create view
                var router = new Router();
                router.routeConfig.homepage.before = sinon.spy();
                stub = sinon.stub( router, "_runRouteFilters" );
                router.execute( null, null, "homepage" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ router.routeConfig.homepage.before ] ) ).to.be.true;
            });

            it('should wrap callback as an async callback if callback has 2 arguments', function() {
                var callback = function( params, done ) {};
                // Create view
                var router = new Router();
                stub = sinon.stub( router, "_wrapCallbackAsAsync" );
                tempStub = sinon.stub( router, "_runRouteFilters" );
                router.execute( callback, null, "homepage" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( callback, "homepage" ) ).to.be.true;
                tempStub.restore();
            });

            it('should wrap callback as an sync callback if callback has 1 argument', function() {
                var callback = function( params ) {};
                // Create view
                var router = new Router();
                stub = sinon.stub( router, "_wrapCallbackAsSync" );
                tempStub = sinon.stub( router, "_runRouteFilters" );
                router.execute( callback, null, "homepage" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( callback, "homepage" ) ).to.be.true;
                tempStub.restore();
            });

           it('should add routeConfig after function to filters array if set', function() {
                // Create view
                var router = new Router();
                router.routeConfig.homepage.after = sinon.spy();
                stub = sinon.stub( router, "_runRouteFilters" );
                router.execute( null, null, "homepage" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ router.routeConfig.homepage.after ] ) ).to.be.true;
            });

            it('should add global after function to filters array if set', function() {
                // Create view
                var router = new Router();
                router.after = sinon.spy();
                stub = sinon.stub( router, "_runRouteFilters" );
                router.execute( null, null, "unknown" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ router.after ] ) ).to.be.true;
            });
        });

        describe('_wrapCallbackAsAsync()', function () {
            beforeEach(function() {
                // Create Router definition
                Router = Backbone.Router.extend();
                RouteFilterMixin.call( Router.prototype );
            });

            it('should wrap callback and call done/next function when function is executed', function( done ) {
                // Create view
                var router = new Router();
                var callback = function( args, next ) {
                    next( true );
                };
                stub = sinon.spy( callback );
                var wrappedCallback = router._wrapCallbackAsAsync( stub, "test" );
                wrappedCallback( null, function( result ) {
                    expect( stub.called ).to.be.true;
                    expect( stub.callCount ).to.equal( 1 );
                    expect( result ).to.be.true;
                    done();
                });
            });
        });

        describe('_wrapCallbackAsSync()', function () {
            beforeEach(function() {
                // Create Router definition
                Router = Backbone.Router.extend();
                RouteFilterMixin.call( Router.prototype );
            });

            it('should wrap callback and return result when function is executed', function() {
                // Create view
                var router = new Router();
                stub = sinon.stub().returns( true );
                var wrappedCallback = router._wrapCallbackAsSync( stub, "test" );
                var result = wrappedCallback();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( result ).to.be.true;
            });
        });
    });
}));
