(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'sinon',
                'routers/route-title/RouteTitle'
            ],
            function( Backbone, sinon, RouteTitleMixin ) {
                factory( Backbone, root.expect, sinon, RouteTitleMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        /* This is a Client side mixin only */
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.sinon, root.ExoSuit.Mixins.RouteTitleMixin );
    }
}( this, function( Backbone, expect, sinon, RouteTitleMixin ) {
    describe('Route Title Router Mixin ', function () {
        var router, Router, stub, oldMethodStub, oldTitle;

        describe('execute()', function () {
            beforeEach(function() {
                // Create Router definition
                Router = Backbone.Router.extend({
                    routes: {
                        "index": "homepage",
                        "pageone": "anotherPage"
                    },
                    routeConfig: {
                        "homepage": {
                            title: "Homepage Title"
                        },
                        "anotherPage": {
                            title: function() {
                                return "Title Returned From Function";
                            }
                        }
                    },
                    defaultTitle: "Default Title"
                });
                oldMethodStub = sinon.stub( Router.prototype, "execute" );
                RouteTitleMixin.call( Router.prototype );
                stub = sinon.stub( Router.prototype, "setTitle" );
            });

            afterEach(function() {
                // Clean up any stubs
                stub.restore();
                oldMethodStub.restore();
            });

            it('should get and set the document title from the routeConfig[ route value name ] title property', function() {
                // Create view
                var router = new Router();
                router.execute( function() {}, [], "homepage" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "Homepage Title" ) ).to.be.true;
            });

            it('should get and set the document title to the default title if no routeConfig is defined for route value name', function() {
                // Create view
                var router = new Router();
                router.execute( function() {}, [], "doesntexist" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "Default Title" ) ).to.be.true;
            });

            it('should get the title to set from the return value of the routeConfig function', function() {
                // Create view
                var router = new Router();
                router.execute( function() {}, [], "anotherPage" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "Title Returned From Function" ) ).to.be.true;
            });

            it('should not call setTitle if old execute function returns false', function() {
                oldMethodStub.returns( false );
                // Create view
                var router = new Router();
                router.execute( function() {}, [], "homepage" );
                expect( stub.called ).to.be.false;
            });
        });

        describe('setTitle()', function () {
            beforeEach(function() {
                oldTitle = document.title;
            })

            afterEach(function() {
                document.title = oldTitle;
            });

            it('should set the document title to the prefix plus the passed in string plus the suffix', function() {
                // Create Router definition
                Router = Backbone.Router.extend({
                    titlePrefix: "Prefix - ",
                    titleSuffix: " - Suffix"
                });
                RouteTitleMixin.call( Router.prototype );
                // Create view
                var router = new Router();
                router.setTitle( "My Title" );
                expect( document.title ).to.equal( "Prefix - My Title - Suffix" );
                router.titlePrefix = "";
                router.setTitle( "My New Title" );
                expect( document.title ).to.equal( "My New Title - Suffix" );
                router.titlePrefix = "Prefix - ";
                router.titleSuffix = "";
                router.setTitle( "My Old Title" );
                expect( document.title ).to.equal( "Prefix - My Old Title" );
            });

            it('should not override the setTitle function if one is already on the prototype', function() {
                // Create Router definition
                Router = Backbone.Router.extend({
                    setTitle: function( title ) {
                        document.title = "Can't Change This Title"
                    }
                });
                RouteTitleMixin.call( Router.prototype );
                // Create view
                var router = new Router();
                router.setTitle( "My Title" );
                expect( document.title ).to.equal( "Can't Change This Title" );
            });
        });
    });
}));
