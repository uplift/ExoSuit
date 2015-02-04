(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'sinon',
                'routers/analytics/Google'
            ],
            function( Backbone, sinon, GoogleAnalyticsRouteMixin ) {
                factory( Backbone, root.expect, sinon, GoogleAnalyticsRouteMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        /* This is a Client side mixin only */
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.sinon, root.ExoSuit.Mixins.GoogleAnalyticsRouteMixin );
    }
}( this, function( Backbone, expect, sinon, GoogleAnalyticsRouteMixin ) {
    describe('Google Analytics Router Mixin ', function () {
        var router, Router, oldMethodStub, urlStub, gaStub;

        describe('execute()', function () {
            beforeEach(function() {
                // Create Router definition
                Router = Backbone.Router.extend({
                    routes: {
                        "pageone": "page"
                    }
                });
                oldMethodStub = sinon.stub( Router.prototype, "execute" );
                GoogleAnalyticsRouteMixin.call( Router.prototype );
            });

            afterEach(function() {
                // Clean up any stubs
                urlStub.restore();
                oldMethodStub.restore();
                gaStub.restore();
                if ( window._gaq ) {
                    window._gaq = undefined;
                }
                if ( window.GoogleAnalyticsObject ) {
                    window.GoogleAnalyticsObject = undefined;
                }
            });

            it('should call legacy google analytics code when _gaq is defined', function() {
                window._gaq = [];
                gaStub = sinon.stub( window._gaq, "push" );
                urlStub = sinon.stub( Backbone.history, "getFragment" ).returns( "pageone" );
                // Create view
                var router = new Router();
                router.execute( function() {}, [], "page" );
                expect( gaStub.called ).to.be.true;
                expect( gaStub.callCount ).to.equal( 1 );
                expect( gaStub.calledWith( [ '_trackPageview', "/pageone" ] ) ).to.be.true;
            });

            it('should prepend a / before the url if one doesnt exist', function() {
                window._gaq = [];
                gaStub = sinon.stub( window._gaq, "push" );
                urlStub = sinon.stub( Backbone.history, "getFragment" ).returns( "pageone" );
                // Create view
                var router = new Router();
                router.execute( function() {}, [], "page" );
                expect( gaStub.called ).to.be.true;
                expect( gaStub.callCount ).to.equal( 1 );
                expect( gaStub.calledWith( [ '_trackPageview', "/pageone" ] ) ).to.be.true;
                urlStub = urlStub.returns( "pageone" );
                router.execute( function() {}, [], "page" );
                expect( gaStub.called ).to.be.true;
                expect( gaStub.callCount ).to.equal( 2 );
                expect( gaStub.calledWith( [ '_trackPageview', "/pageone" ] ) ).to.be.true;
            });

            it('should call new google analytics code when GoogleAnalyticsObject is defined', function() {
                window.GoogleAnalyticsObject = "ga";
                window.ga = function() {};
                gaStub = sinon.stub( window, "ga" );
                urlStub = sinon.stub( Backbone.history, "getFragment" ).returns( "pageone" );
                // Create view
                var router = new Router();
                router.execute( function() {}, [], "page" );
                expect( gaStub.called ).to.be.true;
                expect( gaStub.callCount ).to.equal( 1 );
                expect( gaStub.calledWith( 'send', 'pageview', "/pageone" ) ).to.be.true;
            });

            it('should not call google analytics code when super execute method returns false', function() {
                oldMethodStub.returns( false );
                window.GoogleAnalyticsObject = "ga";
                window.ga = function() {};
                gaStub = sinon.stub( window, "ga" );
                urlStub = sinon.stub( Backbone.history, "getFragment" ).returns( "pageone" );
                // Create view
                var router = new Router();
                router.execute( function() {}, [], "page" );
                expect( gaStub.called ).to.be.false;
                expect( gaStub.callCount ).to.equal( 0 );
            });
        });
    });
}));
