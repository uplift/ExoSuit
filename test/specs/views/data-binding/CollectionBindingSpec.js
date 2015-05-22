(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'jquery',
                'sinon',
                'views/data-binding/CollectionBinding'
            ],
            function( Backbone, $, sinon, CollectionBindingMixin ) {
                factory( Backbone, $, root.expect, sinon, CollectionBindingMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        /*var fs = require( 'fs' );
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var window = require( 'jsdom' ).jsdom( fs.readFileSync( './test/specs/fixtures/main.html' ) ).parentWindow;
        var $ = require( 'jquery' )( window );
        Backbone.$ = $;
        var sinon = require( 'sinon' );
        var CollectionBindingMixin = require( '../../../../src/views/data-binding/CollectionBinding' );
        factory( Backbone, $, expect, sinon, CollectionBindingMixin );*/
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.jQuery, root.expect, root.sinon, root.ExoSuit.Mixins.CollectionBindingMixin );
    }
}( this, function( Backbone, $, expect, sinon, CollectionBindingMixin ) {
    describe('Collection Binding View Mixin', function () {
        var view, BindingView, stub, oldMethodStub, mock;

        before(function() {
            // If karma, add fixtures html
            if ( typeof __html__ !== "undefined" ) {
                document.body.innerHTML = __html__['test/specs/fixtures/main.html'];
            }
            // Create fixture DOM placeholder
            this.fixture = $( "<div id='binding-area'></div>" );
            // Add fixture to DOM
            this.fixture.appendTo( "#fixtures" );
        });

        after(function() {
            // Empty any DOM created as part of this test suite
            $( "#fixtures" ).empty();
        });

        describe('render()', function () {
            afterEach(function() {
                oldMethodStub.restore();
                stub.restore();
                view.remove();
            });

            it('should not override render if overrideRender property isnt set', function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection : new Backbone.Collection(),
                    modelView: new Backbone.View(),
                    initialize : function() {
                        this.render();
                    }
                });
                oldMethodStub = sinon.stub( BindingView.prototype, "render" );
                CollectionBindingMixin.call( BindingView.prototype );
                stub = sinon.stub( BindingView.prototype, "addBulkSubViews" );
                // Create view
                view = new BindingView();
                expect( oldMethodStub.called ).to.be.true;
                expect( stub.called ).to.be.false;
            });

            it('should override render if overrideRender property is set to true', function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    overrideRender: true,
                    collection : new Backbone.Collection(),
                    modelView: new Backbone.View(),
                    initialize : function() {
                        this.render();
                    }
                });
                oldMethodStub = sinon.stub( BindingView.prototype, "render" );
                CollectionBindingMixin.call( BindingView.prototype );
                stub = sinon.stub( BindingView.prototype, "addBulkSubViews" );
                // Create view
                view = new BindingView();
                expect( oldMethodStub.called ).to.be.true;
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should not call addSubViews if collection isnt defined', function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    overrideRender: true,
                    modelView: new Backbone.View(),
                    initialize : function() {
                        this.render();
                    }
                });
                oldMethodStub = sinon.stub( BindingView.prototype, "render" );
                CollectionBindingMixin.call( BindingView.prototype );
                stub = sinon.stub( BindingView.prototype, "addBulkSubViews" );
                // Create view
                view = new BindingView();
                expect( oldMethodStub.called ).to.be.true;
                expect( stub.called ).to.be.false;
            });

            it('should not call addSubViews if modelView isnt defined', function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    overrideRender: true,
                    collection: new Backbone.Collection,
                    initialize : function() {
                        this.render();
                    }
                });
                oldMethodStub = sinon.stub( BindingView.prototype, "render" );
                CollectionBindingMixin.call( BindingView.prototype );
                stub = sinon.stub( BindingView.prototype, "addBulkSubViews" );
                // Create view
                view = new BindingView();
                expect( oldMethodStub.called ).to.be.true;
                expect( stub.called ).to.be.false;
            });
        });

        describe('delegateEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                oldMethodStub = sinon.stub( BindingView.prototype, "delegateEvents" );
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call old delegate function', function() {
                // Create view
                view = new BindingView();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should call _bindCollectionToView function', function() {
                stub = sinon.stub( BindingView.prototype, "_bindCollectionToView" );
                // Create view
                view = new BindingView();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });
        });

        describe('_bindCollectionToView()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should not set up any collection event listeners if no collection is set on the view', function() {
                stub = sinon.stub( BindingView.prototype, "listenTo" );
                // Create view
                view = new BindingView();
                expect( stub.called ).to.be.false;
            });

            it('should set up any collection event listeners if collection is set on the view', function() {
                BindingView.prototype.collection = new Backbone.Collection();
                stub = sinon.stub( BindingView.prototype, "listenTo" );
                // Create view
                view = new BindingView();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.collection, {
                    "add": view._add,
                    "remove": view._remove,
                    "reset": view._reset,
                    "sort": view._sort
                }, view ) ).to.be.true;
            });
        });

        describe('_add()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection: new Backbone.Collection()
                });
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should not add a subview if no modelView is defined', function() {
                stub = sinon.stub( BindingView.prototype, "addSubView" );
                // Create view
                view = new BindingView();
                view._add( new Backbone.Model(), view.collection, {} );
                expect( stub.called ).to.be.false;
            });

            it('should add a subview if modelView is defined', function() {
                var model = new Backbone.Model();
                BindingView.prototype.modelView = new Backbone.View();
                stub = sinon.stub( BindingView.prototype, "addSubView" );
                // Create view
                view = new BindingView();
                view._add( model, view.collection, { at : 2 } );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( model, 2 ) ).to.be.true;
            });
        });

        describe('_remove()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection: new Backbone.Collection()
                });
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call removeSubView with model CID', function() {
                var model = new Backbone.Model();
                BindingView.prototype.modelView = new Backbone.View();
                stub = sinon.stub( BindingView.prototype, "removeSubView" );
                // Create view
                view = new BindingView();
                view._remove( model, view.collection, {} );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( model.cid ) ).to.be.true;
            });
        });

        describe('_reset()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection: new Backbone.Collection( [ { id: 1 }, { id: 2 }, { id: 3 } ] )
                });
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call removeAllSubViews to remove current collection model views', function() {
                stub = sinon.stub( BindingView.prototype, "removeAllSubViews" );
                // Create view
                view = new BindingView();
                view._reset( view.collection, {} );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should not call addBulkSubViews if no modelView is defined', function() {
                stub = sinon.stub( BindingView.prototype, "addBulkSubViews" );
                // Create view
                view = new BindingView();
                view._reset( view.collection, {} );
                expect( stub.called ).to.be.false;
            });

            it('should call addBulkSubViews if modelView is defined', function() {
                BindingView.prototype.modelView = new Backbone.View();
                stub = sinon.stub( BindingView.prototype, "addBulkSubViews" );
                // Create view
                view = new BindingView();
                view._reset( view.collection, {} );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.collection.models ) ).to.be.true;
            });
        });

        describe('_sort()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    el: "#binding-el",
                    collection: new Backbone.Collection( [ { id: 1 }, { id: 2 }, { id: 3 } ] ),
                    modelView: Backbone.View,
                    overrideRender: true,
                    initialize: function() {
                        this.render();
                    }
                });
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should detach the view', function() {
                // Create view
                view = new BindingView();
                stub = sinon.stub( view.$el, "detach" );
                view._sort( view.collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should loop over models in collection and get model sub view', function() {
                // Create view
                view = new BindingView();
                stub = sinon.stub( view, "getSubView" ).returns( new Backbone.View() );
                view._sort( view.collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 3 );
            });

            it('should insert before next element if next element exists', function() {
                // Create view
                view = new BindingView();
                temp = sinon.stub( view.$el, "next" ).returns( [ view.subviews[ view.collection.at( 1 ).cid ] ] );
                stub = sinon.stub( view.$el, "insertBefore" );
                view._sort( view.collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                temp.restore();
            });

            it('should append to parent element if no next element', function() {
                // Create view
                view = new BindingView();
                temp = sinon.stub( view.$el, "next" ).returns( [] );
                temp2 = sinon.stub( view.$el, "parent" ).returns( [ view.subviews[ view.collection.at( 1 ).cid ] ] );
                stub = sinon.stub( view.$el, "appendTo" );
                view._sort( view.collection );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                temp.restore();
                temp2.restore();
            });
        });

        describe('addBulkSubViews()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection: new Backbone.Collection( [ { id: 1 }, { id: 2 }, { id: 3 } ] )
                });
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call addSubView for each model in the collection', function() {
                stub = sinon.stub( BindingView.prototype, "addSubView" );
                // Create view
                view = new BindingView();
                view.addBulkSubViews( view.collection.models );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 3 );
            });
        });

        describe('addSubView()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection: new Backbone.Collection( [ { id: 1 }, { id: 2 }, { id: 3 } ] ),
                    modelView: Backbone.View
                });
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should add sub view to module subviews hash by calling createSubView passing model in options argument', function() {
                var model = new Backbone.Model();
                // Create view
                view = new BindingView();
                stub = sinon.stub( view, "createSubView" ).returns( new Backbone.View() );
                view.addSubView( model );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( model ) ).to.be.true;
            });

            it('should call render of the new view', function() {
                var model = new Backbone.Model();
                // FIXME: Strangely in karma urlStub is already wrapped and not restored in afterEach???
                if ( stub ) {
                    stub.restore();
                }
                stub = sinon.stub( Backbone.View.prototype, "render" );
                var subview = new Backbone.View();
                var temp = sinon.stub( view, "createSubView" ).returns( subview );
                // Create view
                view = new BindingView();
                view.addSubView( model );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                temp.restore();
            });

            it('should append subview to container view is no index is given', function() {
                var model = new Backbone.Model();
                var subview = new Backbone.View();
                var temp = sinon.stub( view, "createSubView" ).returns( subview );
                // Create view
                view = new BindingView();
                stub = sinon.stub( view.$el, "append" );
                view.addSubView( model );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                temp.restore();
            });

            it('should prepend to container view if index is 0 and model is zero indexed in the collection', function() {
                var subview = new Backbone.View();
                var temp = sinon.stub( view, "createSubView" ).returns( subview );
                // Create view
                view = new BindingView();
                stub = sinon.stub( view.$el, "prepend" );
                view.addSubView( view.collection.at( 0 ), 0 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                temp.restore();
            });

            it('should get subview at index before the index argument', function() {
                var model = new Backbone.Model();
                var subview = new Backbone.View({
                    el: "#test"
                });
                var temp = sinon.stub( view, "createSubView" ).returns( subview );
                var temp2 = sinon.stub( view.$el, "after" );
                // Create view
                view = new BindingView();
                stub = sinon.stub( view, "getSubView" ).returns( new Backbone.View() );
                view.addSubView( model, 1 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.collection.at( 0 ).cid ) ).to.be.true;
                temp.restore();
                temp2.restore();
            });

            it('should put new view after the previous subview if index is given', function() {
                var model = new Backbone.Model();
                var subview = new Backbone.View();
                var prevView = new Backbone.View();
                stub = sinon.stub( prevView.$el, "after" );
                var temp = sinon.stub( view, "createSubView" ).returns( subview );
                // Create view
                view = new BindingView();
                view.subviews[ view.collection.at( 1 ).cid ] = prevView;
                view.addSubView( model, 2 );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                temp.restore();
            });
        });

        describe('createSubView()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection: new Backbone.Collection( [ { id: 1 }, { id: 2 }, { id: 3 } ] ),
                    modelView: Backbone.View
                });
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should add sub view to module subviews hash', function() {
                var model = new Backbone.Model();
                // Create view
                view = new BindingView();
                stub = sinon.stub( view, "modelView" ).returns( new Backbone.View() );
                view.createSubView( model );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( { model: model } ) ).to.be.true;
            });
        });

        describe('removeSubView()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection: new Backbone.Collection( [ { id: 1 }, { id: 2 }, { id: 3 } ] )
                });
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call getSubView with model CID', function() {
                stub = sinon.stub( BindingView.prototype, "getSubView" );
                // Create view
                view = new BindingView();
                view.removeSubView( "c1021" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( "c1021" ) ).to.true;
            });

            it('should call the return sub views remove function', function() {
                var tempView = new Backbone.View();
                stub = sinon.stub( tempView, "remove" );
                var temp = sinon.stub( BindingView.prototype, "getSubView" ).returns( tempView );
                // Create view
                view = new BindingView();
                view.removeSubView( "c1021" );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                temp.restore();
            });

            it('should remove the view from the list of subviews', function() {
                var tempView = new Backbone.View();
                // Create view
                view = new BindingView();
                view.subviews = {
                    "c1021": tempView
                };
                view.removeSubView( "c1021" );
                expect( view.subviews ).to.deep.equal( {} );
            });
        });

        describe('removeAllSubViews()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection: new Backbone.Collection( [ { id: 1 }, { id: 2 }, { id: 3 } ] )
                });
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should loop over subviews and pass each one to removeSubView', function() {
                stub = sinon.stub( BindingView.prototype, "removeSubView" );
                var view1 = new Backbone.View(),
                    view2 = new Backbone.View(),
                    view3 = new Backbone.View();
                // Create view
                view = new BindingView();
                view.subviews = {
                    "sub1": view1,
                    "sub2": view2,
                    "sub3": view3
                };
                view.removeAllSubViews();
                expect( stub.called ).to.be,true;
                expect( stub.callCount ).to.equal( 3 );
            });
        });

        describe('getSubView()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection: new Backbone.Collection( [ { id: 1 }, { id: 2 }, { id: 3 } ] )
                });
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should return the correct view module for the key passed in', function() {
                var view1 = new Backbone.View(),
                    view2 = new Backbone.View(),
                    view3 = new Backbone.View();
                // Create view
                view = new BindingView();
                view.subviews = {
                    "sub1": view1,
                    "sub2": view2,
                    "sub3": view3
                };
                var subview = view.getSubView( "sub1" );
                expect( subview ).to.deep.equal( view1 );
                subview = view.getSubView( "sub3" );
                expect( subview ).to.deep.equal( view3 );
            });
        });

        describe('remove()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    collection: new Backbone.Collection( [ { id: 1 }, { id: 2 }, { id: 3 } ] )
                });
                oldMethodStub = sinon.stub( BindingView.prototype, "remove" );
                CollectionBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call super remove', function() {
                // Create view
                view = new BindingView();
                view.remove();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should call removeAllSubViews', function() {
                stub = sinon.stub( BindingView.prototype, "removeAllSubViews" );
                // Create view
                view = new BindingView();
                view.remove();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });
        });
    });
}));
