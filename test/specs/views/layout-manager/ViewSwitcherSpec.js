(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'sinon',
                'views/layout-manager/ViewSwitcher'
            ],
            function( Backbone, sinon, ViewSwitcherMixin ) {
                factory( Backbone, root.expect, sinon, ViewSwitcherMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var fs = require( 'fs' );
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var $ = require( 'jquery' )( require( 'jsdom' ).jsdom( fs.readFileSync( './test/specs/fixtures/main.html' ) ).parentWindow );
        Backbone.$ = $;
        var sinon = require( 'sinon' );
        var ViewSwitcherMixin = require( '../../../../src/views/layout-manager/ViewSwitcher' );
        factory( Backbone, expect, sinon, ViewSwitcherMixin );
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.sinon, root.ExoSuit.Mixins.ViewSwitcherMixin );
    }
}( this, function( Backbone, expect, sinon, ViewSwitcherMixin ) {
    describe('View Switcher View Mixin', function () {
        var view, SwitcherView, stub, oldMethodStub;

        describe('initialize()', function () {
            beforeEach(function() {
                // Create Binding View definition
                SwitcherView = Backbone.View.extend();
                oldMethodStub = sinon.stub( SwitcherView.prototype, "initialize" );
                ViewSwitcherMixin.call( SwitcherView.prototype );
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
                view = new SwitcherView();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should define a property _views of an empty object', function() {
                // Create view
                view = new SwitcherView();
                expect( view._views ).to.deep.equal( {} );
            });

            it('should add any defined views on the views property', function() {
                var views = {
                    "view1": new Backbone.View(),
                    "view2": new Backbone.View(),
                    "view3": new Backbone.View()
                };
                SwitcherView.prototype.views = views;
                stub = sinon.stub( SwitcherView.prototype, "addView" );
                // Create view
                view = new SwitcherView();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( views ) ).to.be.true;
            });

            it('should add any defined views on the options argument', function() {
                var views = {
                    "view1": new Backbone.View(),
                    "view2": new Backbone.View(),
                    "view3": new Backbone.View()
                };
                stub = sinon.stub( SwitcherView.prototype, "addView" );
                // Create view
                view = new SwitcherView({
                    views: views
                });
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( views ) ).to.be.true;
            });
        });

        describe('render()', function () {
            beforeEach(function() {
                // Create Binding View definition
                SwitcherView = Backbone.View.extend();
                oldMethodStub = sinon.stub( SwitcherView.prototype, "render" );
                ViewSwitcherMixin.call( SwitcherView.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call old render function', function() {
                // Create view
                view = new SwitcherView();
                view.render();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should call switchView if an initial view is added', function() {
                var stubbedGetView = sinon.stub( SwitcherView.prototype, "getView" ).returns( false );
                stub = sinon.stub( SwitcherView.prototype, "switchView" );
                // Create view
                view = new SwitcherView();
                view.render();
                expect( stub.called ).to.be.false;
                stubbedGetView.returns( true );
                view.render();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "initial" ) ).to.be.true;
                stubbedGetView.restore();
            });

            it('should return this', function() {
                // Create view
                view = new SwitcherView();
                var rendered = view.render();
                expect( rendered ).to.deep.equal( view );
            });
        });

        describe('switchView()', function () {
            beforeEach(function() {
                // Create Binding View definition
                SwitcherView = Backbone.View.extend({
                    initialize: function() {
                        this.render();
                    }
                });
                ViewSwitcherMixin.call( SwitcherView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should remove current view dom', function() {
                var views = {
                    "initial": "view1",
                    "view1": new Backbone.View(),
                    "view2": new Backbone.View(),
                    "view3": new Backbone.View()
                };
                // Create view
                view = new SwitcherView({
                    views: views
                });
                stub = sinon.stub( view.currentView.$el, "remove" );
                view.switchView( "view2" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should not remove current view dom if new id is same as current id', function() {
                var views = {
                    "initial": "view1",
                    "view1": new Backbone.View(),
                    "view2": new Backbone.View(),
                    "view3": new Backbone.View()
                };
                // Create view
                view = new SwitcherView({
                    views: views
                });
                stub = sinon.stub( view.currentView.$el, "remove" );
                view.switchView( "initial" );
                expect( stub.called ).to.be.false;
                view.switchView( "view1" );
                expect( stub.called ).to.be.false;
            });

            it('should set the current view to the new view', function() {
                var views = {
                    "initial": "view1",
                    "view1": new Backbone.View(),
                    "view2": new Backbone.View(),
                    "view3": new Backbone.View()
                };
                // Create view
                view = new SwitcherView({
                    views: views
                });
                view.switchView( "view2" );
                expect( view.currentView ).to.equal( view._views.view2 );
            });

            it('should call render on the new view', function() {
                var views = {
                    "initial": "view1",
                    "view1": new Backbone.View(),
                    "view2": new Backbone.View(),
                    "view3": new Backbone.View()
                };
                // Create view
                view = new SwitcherView({
                    views: views
                });
                stub = sinon.stub( view._views.view2, "render" );
                view.switchView( "view2" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should call delegateEvents on the new view', function() {
                var views = {
                    "initial": "view1",
                    "view1": new Backbone.View(),
                    "view2": new Backbone.View(),
                    "view3": new Backbone.View()
                };
                // Create view
                view = new SwitcherView({
                    views: views
                });
                stub = sinon.stub( view._views.view2, "delegateEvents" );
                view.switchView( "view2" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should put the contents of the new view into the parent $el', function() {
                var views = {
                    "initial": "view1",
                    "view1": new Backbone.View(),
                    "view2": new Backbone.View(),
                    "view3": new Backbone.View()
                };
                // Create view
                view = new SwitcherView({
                    views: views
                });
                stub = sinon.stub( view.$el, "html" );
                view.switchView( "view2" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.currentView.$el ) ).to.be.true;
            });
        });

        describe('getView()', function () {
            beforeEach(function() {
                // Create Binding View definition
                SwitcherView = Backbone.View.extend();
                ViewSwitcherMixin.call( SwitcherView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should return undefined if no view exists', function() {
                // Create view
                view = new SwitcherView();
                var subView = view.getView( "initial" );
                expect( subView ).to.be.undefined;
            });

            it('should return view module if view definition exists and is not a string', function() {
                var sub = new Backbone.View();
                SwitcherView.prototype.views = {
                    "view1": sub
                };
                // Create view
                view = new SwitcherView();
                var subView = view.getView( "view1" );
                expect( subView ).to.deep.equal( sub );
            });

            it('should return view module of view definition value if view definition exists and is a string', function() {
                var sub = new Backbone.View();
                // Create view
                view = new SwitcherView({
                    views: {
                        "initial": "view2",
                        "view2": sub
                    }
                });
                var subView = view.getView( "initial" );
                expect( subView ).to.deep.equal( sub );
            });
        });

        describe('addView()', function () {
            beforeEach(function() {
                // Create Binding View definition
                SwitcherView = Backbone.View.extend();
                ViewSwitcherMixin.call( SwitcherView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should not add any views if id argument is undefined', function() {
                var views = {
                    view1: new Backbone.View()
                };
                // Create view
                view = new SwitcherView({
                    views: views
                });
                view.addView();
                expect( view._views ).to.deep.equal( views );
            });

            it('should add a view if id argument is a valid view id', function() {
                var subview =  new Backbone.View();
                // Create view
                view = new SwitcherView();
                view.addView( "view1", subview );
                expect( view._views ).to.deep.equal( { view1: subview } );
            });

            it('should call addProxyEvent for a view definition that isnt a string', function() {
                var subview = new Backbone.View();
                // Create view
                view = new SwitcherView();
                stub = sinon.stub( view, "addProxyEvent" );
                view.addView( "initial", "view1" );
                expect( stub.called ).to.be.false;
                view.addView( "view1", subview );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( subview ) ).to.be.true;
            });

            it('should add multiple views if id argument is a hash of valid view definitions', function() {
                var views = {
                    "view1": new Backbone.View(),
                    "view2": new Backbone.View(),
                    "view3": new Backbone.View()
                };
                // Create view
                view = new SwitcherView();
                view.addView( views );
                expect( view._views ).to.deep.equal( views );
            });
        });

        describe('addProxyEvent()', function () {
            beforeEach(function() {
                // Create Binding View definition
                SwitcherView = Backbone.View.extend();
                ViewSwitcherMixin.call( SwitcherView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call listenTo with view argument given', function() {
                var subview = new Backbone.View();
                stub = sinon.stub( SwitcherView.prototype, "listenTo" );
                // Create view
                view = new SwitcherView();
                view.addProxyEvent();
                expect( stub.called ).to.be.false;
                view.addProxyEvent( subview );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( subview, "all" ) ).to.be.true;
            });

            it('should trigger events on sub view through container view', function( done ) {
                var subview = new Backbone.View();
                // Create view
                view = new SwitcherView();
                view.addProxyEvent( subview );
                Backbone.Events.listenTo( view, "change", function( msg ) {
                    expect( msg ).to.equal( "test" );
                    done();
                });
                subview.trigger( "change", "test" );
            });
        });

        describe('removeView()', function () {
            beforeEach(function() {
                // Create Binding View definition
                SwitcherView = Backbone.View.extend();
                ViewSwitcherMixin.call( SwitcherView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should not remove any views if id argument is undefined or is a non valid view id', function() {
                var views = {
                    view1: new Backbone.View()
                };
                // Create view
                view = new SwitcherView({
                    views: views
                });
                view.removeView();
                expect( view._views ).to.deep.equal( views );
                view.removeView( "test" );
                expect( view._views ).to.deep.equal( views );
            });

            it('should remove a view if id argument is a valid view id', function() {
                var views = {
                    view1: new Backbone.View()
                };
                // Create view
                view = new SwitcherView({
                    views: views
                });
                view.removeView( "view1" );
                expect( view._views ).to.deep.equal( {} );
            });

            it('should call removeProxyEvent for a view definition that isnt a string', function() {
                var subview = new Backbone.View();
                var views = {
                    initial: "view1",
                    view1: subview
                };
                stub = sinon.stub( SwitcherView.prototype, "removeProxyEvent" );
                // Create view
                view = new SwitcherView({
                    views: views
                });
                view.removeView( "initial" );
                expect( stub.called ).to.be.false;
                view.removeView( "view1" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( subview ) ).to.be.true;
            });

            it('should remove the subview for a view definition that isnt a string', function() {
                var subview = new Backbone.View();
                var views = {
                    initial: "view1",
                    view1: subview
                };
                stub = sinon.stub( subview, "remove" );
                // Create view
                view = new SwitcherView({
                    views: views
                });
                view.removeView( "initial" );
                expect( stub.called ).to.be.false;
                view.removeView( "view1" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should remove multiple views if id argument is an array of valid view ids', function() {
                var views = {
                    view1: new Backbone.View(),
                    view2: new Backbone.View(),
                    view3: new Backbone.View()
                };
                // Create view
                view = new SwitcherView({
                    views: views
                });
                view.removeView( [ "view1", "view2", "view3" ] );
                expect( view._views ).to.deep.equal( {} );
            });
        });

        describe('removeProxyEvent()', function () {
            beforeEach(function() {
                // Create Binding View definition
                SwitcherView = Backbone.View.extend();
                ViewSwitcherMixin.call( SwitcherView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call stopListening with view argument given', function() {
                var subview = new Backbone.View();
                stub = sinon.stub( SwitcherView.prototype, "stopListening" );
                // Create view
                view = new SwitcherView();
                view.removeProxyEvent();
                expect( stub.called ).to.be.false;
                view.removeProxyEvent( subview );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( subview, "all" ) ).to.be.true;
            });
        });

        describe('remove()', function () {
            beforeEach(function() {
                // Create Binding View definition
                SwitcherView = Backbone.View.extend();
                oldMethodStub = sinon.stub( SwitcherView.prototype, "remove" );
                ViewSwitcherMixin.call( SwitcherView.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call old remove function', function() {
                // Create view
                view = new SwitcherView();
                view.remove();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should call removeView with _views object', function() {
                var views = {
                    "view1": new Backbone.View(),
                    "view2": new Backbone.View(),
                    "view3": new Backbone.View()
                };
                SwitcherView.prototype.views = views;
                stub = sinon.stub( SwitcherView.prototype, "removeView" );
                // Create view
                view = new SwitcherView();
                view.remove();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( [ 'view1', 'view2', 'view3' ] ) ).to.be.true;
            });
        });
    });
}));
