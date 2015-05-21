(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'jquery',
                'sinon',
                'views/data-binding/ModelBinding'
            ],
            function( Backbone, $, sinon, ModelBindingMixin ) {
                factory( root.document, Backbone, $, root.expect, sinon, ModelBindingMixin );
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
        var ModelBindingMixin = require( '../../../../src/views/data-binding/ModelBinding' );
        factory( window.document, Backbone, $, expect, sinon, ModelBindingMixin );*/
    // Finally, as a browser global.
    } else {
        factory( root.document, root.Backbone, root.jQuery, root.expect, root.sinon, root.ExoSuit.Mixins.ModelBindingMixin );
    }
}( this, function( document, Backbone, $, expect, sinon, ModelBindingMixin ) {
    describe('Model Binding View Mixin ', function () {
        var view, BindingView, stub, stubTwo, stubThree, oldMethodStub;

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
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should not override render if overrideRender property isnt set', function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    model : new Backbone.Model(),
                    initialize : function() {
                        this.render();
                    }
                });
                oldMethodStub = sinon.stub( BindingView.prototype, "render" );
                ModelBindingMixin.call( BindingView.prototype );
                stub = sinon.stub( BindingView.prototype, "onDataChange" );
                // Create view
                view = new BindingView();
                expect( oldMethodStub.called ).to.be.true;
                expect( stub.called ).to.be.false;
            });

            it('should override render if overrideRender property is set to true', function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend({
                    model : new Backbone.Model(),
                    overrideRender : true,
                    initialize : function() {
                        this.render();
                    }
                });
                oldMethodStub = sinon.stub( BindingView.prototype, "render" );
                ModelBindingMixin.call( BindingView.prototype );
                stub = sinon.stub( BindingView.prototype, "onDataChange" );
                // Create view
                view = new BindingView();
                expect( oldMethodStub.called ).to.be.true;
                expect( stub.called ).to.be.true;
            });
        });

        describe('delegateEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                oldMethodStub = sinon.stub( BindingView.prototype, "delegateEvents" );
                ModelBindingMixin.call( BindingView.prototype );
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

            it('should call _bindModelToView function', function() {
                stub = sinon.stub( BindingView.prototype, "_bindModelToView" );
                // Create view
                view = new BindingView();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should call _bindViewToModel function', function() {
                stub = sinon.stub( BindingView.prototype, "_bindViewToModel" );
                // Create view
                view = new BindingView();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });
        });

        describe('undelegateEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                oldMethodStub = sinon.stub( BindingView.prototype, "undelegateEvents" );
                ModelBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call old undelegateEvents function', function() {
                // Create view
                view = new BindingView();
                expect( oldMethodStub.called ).to.be.true;
                // Backbone 1.2.0 now calls undelegateEvents twice when initializing view
                expect( oldMethodStub.callCount ).to.equal( 2 );
            });

            it('should call _unbindViewFromModel function', function() {
                stub = sinon.stub( BindingView.prototype, "_unbindViewFromModel" );
                // Create view
                view = new BindingView();
                expect( stub.called ).to.be.true;
                // Backbone 1.2.0 now calls undelegateEvents twice when initializing view
                expect( stub.callCount ).to.equal( 2 );
            });
        });

        describe('_bindModelToView()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                ModelBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should not set up any model event listeners if no model is set on the view', function() {
                stub = sinon.stub( BindingView.prototype, "listenTo" );
                // Create view
                view = new BindingView();
                expect( stub.called ).to.be.false;
            });

            it('should not set up any model event listeners if excludeBindModelToView is set to true', function() {
                stub = sinon.stub( BindingView.prototype, "listenTo" );
                BindingView.prototype.excludeBindModelToView = true;
                // Create view
                view = new BindingView({
                    model: new Backbone.Model()
                });
                expect( stub.called ).to.be.false;
            });

            it('should call onDataChange with changed attributes', function() {
                var data = {
                    "propOne" : true,
                    "propTwo" : "hello world"
                };

                stub = sinon.stub( BindingView.prototype, "onDataChange" );
                // Create view
                view = new BindingView({
                    model: new Backbone.Model()
                });
                view.model.set( data );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( data ) ).to.be.true;
            });
        });

        describe('getBindingSelector()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                ModelBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should get default data-bind and name selector if no binding is setup', function() {
                var selector;
                view = new BindingView();
                selector = view.getBindingSelector( "test" );
                expect( selector ).to.equal( "[data-bind='test'], [name='test']" );
            });

            it('should get the selector from bindings object if string', function() {
                var selector;
                BindingView.prototype.bindings = {
                    test: "#test"
                };
                view = new BindingView();
                selector = view.getBindingSelector( "test" );
                expect( selector ).to.equal( "#test" );
            });

            it('should join the selectors from bindings object if array', function() {
                var selector;
                BindingView.prototype.bindings = {
                    test: [ "#test", "#anotherTest" ]
                };
                view = new BindingView();
                selector = view.getBindingSelector( "test" );
                expect( selector ).to.equal( "#test,#anotherTest" );
            });

            it('should get the selectors from bindings object if object and has bindTo property', function() {
                var selector;
                BindingView.prototype.bindings = {
                    boom: "#bang",
                    test: {
                        bindTo : [ "#test", "#anotherTest" ]
                    }
                };
                view = new BindingView();
                selector = view.getBindingSelector( "test" );
                expect( selector ).to.equal( "#test,#anotherTest" );
                selector = view.getBindingSelector( "boom" );
                expect( selector ).to.equal( "#bang" );
            });
        });

        describe('_getBindingOptions()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                ModelBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should return bindings options as is if bindings is an object and has no overrides', function() {
                var options = {
                    html : true
                };
                BindingView.prototype.bindings = {
                    test : options
                };
                view = new BindingView();
                expect( view._getBindingOptions( "test", document.createElement( "div" ) ) ).to.equal( options );
            });

            it('should merge the default options with any overrides for the element provided', function() {
                var options = {
                    html : true
                };
                BindingView.prototype.bindings = {
                    test : {
                        bindTo: "#test",
                        html : false,
                        overrides : {
                            "#test" : options
                        }
                    }
                };
                view = new BindingView();
                expect( view._getBindingOptions( "test", $( "<div id='test'></div>" ) ) ).to.deep.equal( { bindTo: "#test", html : true, overrides : { "#test" : options } } );
            });
        });

        describe('onDataChange()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                ModelBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                if ( stubTwo ) {
                    stubTwo.restore();
                }
                if ( stubThree ) {
                    stubThree.restore();
                }
                view.remove();
            });

            it('should set view with value when data is passed', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                stub = sinon.stub( view, "setViewData" );
                stubTwo = sinon.stub( view, "getBindingSelector" ).returns( "[data-bind='mypropertyone'], [name='mypropertyone']" );
                view.$el.html( "<input id='input-one' type='text' data-bind='mypropertyone' value='hello'>" );
                view.onDataChange( { "mypropertyone" : "hello" } );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( view.$( document.getElementById( "input-one" ) ), "hello", "mypropertyone" ) ).to.true;
                view.onDataChange( { "mypropertyone" : "world" } );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 2 );
                expect( stub.calledWith( view.$( document.getElementById( "input-one" ) ), "world", "mypropertyone" ) ).to.true;
            });

            it('should not set view with value if _isDirty is false', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                stub = sinon.stub( view, "setViewData" );
                stubTwo = sinon.stub( view, "_isDirty" ).returns( false );
                stubThree = sinon.stub( view, "getBindingSelector" ).returns( "[data-bind='mypropertyone'], [name='mypropertyone']" );
                view.onDataChange( { "mypropertyone" : "world" } );
                expect( stub.called ).to.false;
            });

            it('should set model value on element if _isDirty is true', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                stub = sinon.stub( view, "setViewData" );
                stubTwo = sinon.stub( view, "_isDirty" ).returns( true );
                view.$el.html( "<input id='input-one' type='text' data-bind='mypropertyone' value='hello'>" );
                view.onDataChange( { "mypropertyone" : "world" } );
                expect( stub.called ).to.true;
                expect( stub.calledWith( view.$( document.getElementById( "input-one" ) ), "world", "mypropertyone" ) ).to.true;
            });

            it('should run the bindings function on the view object if this.bindings has a function instead of data-bind or name attributes', function() {
                var changedValue;
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                stub = sinon.stub( view, "getBindingSelector" ).returns( function( change, value, changes ) {
                    expect( change ).to.equal( "newproperty" );
                    changedValue = value
                } );
                view.onDataChange( { "newproperty" : "hello world" } );
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( changedValue ).to.equal( "hello world" );
                view.onDataChange( { "newproperty" : "testing 123" } );
                expect( stub.callCount ).to.equal( 2 );
                expect( changedValue ).to.equal( "testing 123" );
                view.onDataChange( { "newproperty" : "goodbye" } );
                expect( stub.callCount ).to.equal( 3 );
                expect( changedValue ).to.equal( "goodbye" );
            });
        });

        describe('_isDirty()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                ModelBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should return false if value is the same as dirty value', function() {
                var el;
                view = new BindingView();
                view.$el.html( "<input id='input-one' type='text'>" );
                el = view.$( "#input-one" );
                view._dirty = {
                    "myproperty": {
                        el: el,
                        value: "hello"
                    }
                };
                expect( view._isDirty( "myproperty", "hello", el ) ).to.be.false;
            });

            it('should return true if value is different to the dirty value and element is the same as the dirty element', function() {
                var el;
                view = new BindingView();
                view.$el.html( "<input id='input-one' type='text'>" );
                el = view.$( "#input-one" );
                view._dirty = {
                    "myproperty": {
                        el: el,
                        value: "hello"
                    }
                };
                expect( view._isDirty( "myproperty", "world", el ) ).to.be.true;
            });

            it('should return true if value is different to the dirty value and element is different to the dirty element', function() {
                var el;
                view = new BindingView();
                view.$el.html( "<input id='input-one' type='text'><div id='el-one'></div>" );
                el = view.$( "#input-one" );
                view._dirty = {
                    "myproperty": {
                        el: el,
                        value: "hello"
                    }
                };
                expect( view._isDirty( "myproperty", "world", view.$( "#el-one" ) ) ).to.be.true;
            });
        });

        describe('setViewData()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                ModelBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should set value on correct form field element', function() {
                var el;

                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='text' data-bind='mypropertyone'>" );
                el = view.$( "[data-bind=mypropertyone]" );
                expect( view.$( "#input-one" ).val() ).to.equal( "" );
                view.setViewData( el, "hello", "mypropertyone" );
                expect( view.$( "#input-one" ).val() ).to.equal( "hello" );
                view.setViewData( el, "world", "mypropertyone" );
                expect( view.$( "#input-one" ).val() ).to.equal( "world" );

                view.$el.html( "<input id='input-two' type='text' name='mypropertytwo'>" );
                el = view.$( "[name=mypropertytwo]" );
                expect( view.$( "#input-two" ).val() ).to.equal( "" );
                view.setViewData( el, "hiya", "mypropertytwo" );
                expect( view.$( "#input-two" ).val() ).to.equal( "hiya" );
                view.setViewData( el, "testing", "mypropertytwo" );
                expect( view.$( "#input-two" ).val() ).to.equal( "testing" );

                view.$el.html( "<textarea id='input-three' name='mypropertythree'></textarea>" );
                el = view.$( "[name=mypropertythree]" );
                expect( view.$( "#input-three" ).val() ).to.equal( "" );
                view.setViewData( el, "echo", "mypropertythree" );
                expect( view.$( "#input-three" ).val() ).to.equal( "echo" );
                view.setViewData( el, "sudo", "mypropertythree" );
                expect( view.$( "#input-three" ).val() ).to.equal( "sudo" );

                view.$el.html( "<select id='input-four' name='mypropertyfour'><option value=''></option><option value='1'>One</option><option value='2'>Two</option></select>" );
                el = view.$( "[name=mypropertyfour]" );
                expect( view.$( "#input-four" ).val() ).to.equal( "" );
                view.setViewData( el, "1", "mypropertyfour" );
                expect( view.$( "#input-four" ).val() ).to.equal( "1" );
                view.setViewData( el, "2", "mypropertyfour" );
                expect( view.$( "#input-four" ).val() ).to.equal( "2" );
            });

            it('should check/uncheck model value on checkbox field', function() {
                var el;

                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='checkbox' data-bind='mypropertyone'>" );
                el = view.$( "[data-bind=mypropertyone]" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                view.setViewData( el, true, "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.true;
                view.setViewData( el, false, "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                view.setViewData( el, "hello", "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.true;
                view.setViewData( el, "", "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                view.setViewData( el, 1, "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.true;
                view.setViewData( el, 0, "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                view.setViewData( el, null, "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                view.setViewData( el, undefined, "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;

                view.$el.html( "<input id='input-two' type='checkbox' name='mypropertytwo'>" );
                el = view.$( "[name=mypropertytwo]" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                view.setViewData( el, true, "mypropertytwo" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.true;
                view.setViewData( el, false, "mypropertytwo" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                view.setViewData( el, "hello", "mypropertytwo" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.true;
                view.setViewData( el, "", "mypropertytwo" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                view.setViewData( el, 1, "mypropertytwo" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.true;
                view.setViewData( el, 0, "mypropertytwo" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                view.setViewData( el, null, "mypropertytwo" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                view.setViewData( el, undefined, "mypropertytwo" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
            });

            it('should check/uncheck model value on radio field with a radio group', function() {
                var radio1, radio2, radio3;

                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='radio' data-bind='mypropertyone' name='groupone' value='one'><input id='input-two' type='radio' data-bind='mypropertyone' name='groupone' value='two'><input id='input-three' type='radio' data-bind='mypropertyone' name='groupone' value='three'>" );
                radio1 = view.$( "#input-one" );
                radio2 = view.$( "#input-two" );
                radio3 = view.$( "#input-three" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-three" ).is( ":checked" ) ).to.be.false;
                view.setViewData( radio1, "one", "mypropertyone" );
                view.setViewData( radio2, "one", "mypropertyone" );
                view.setViewData( radio3, "one", "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.true;
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-three" ).is( ":checked" ) ).to.be.false;
                view.setViewData( radio1, "three", "mypropertyone" );
                view.setViewData( radio2, "three", "mypropertyone" );
                view.setViewData( radio3, "three", "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-three" ).is( ":checked" ) ).to.be.true;
                view.setViewData( radio1, "unknown", "mypropertyone" );
                view.setViewData( radio2, "unknown", "mypropertyone" );
                view.setViewData( radio3, "unknown", "mypropertyone" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-three" ).is( ":checked" ) ).to.be.false;
            });

            it('should display the model value as text on the element if not a form element', function() {
                var el;

                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<div id='el-one' data-bind='mypropertyone'></div>" );
                el = view.$( "[data-bind=mypropertyone]" );
                expect( view.$( "#el-one" ).text() ).to.equal( "" );
                view.setViewData( el, "hello", "mypropertyone" );
                expect( view.$( "#el-one" ).text() ).to.equal( "hello" );
                view.setViewData( el, "hello world", "mypropertyone" );
                expect( view.$( "#el-one" ).text() ).to.equal( "hello world" );
            });

            it('should display the model value as html on the element if not a form element and options has property of html set to true', function() {
                var el;

                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                stub = sinon.stub( view, "_getBindingOptions" ).returns( { html : true } );
                view.$el.html( "<div id='el-one' data-bind='mypropertyone'></div>" );
                el = view.$( "[data-bind=mypropertyone]" );
                expect( view.$( "#el-one" ).html() ).to.equal( "" );
                view.setViewData( el, "<strong>hello</strong>", "mypropertyone" );
                expect( view.$( "#el-one" ).html() ).to.equal( "<strong>hello</strong>" );
                view.setViewData( el, "<em>hello world</em>", "mypropertyone" );
                expect( view.$( "#el-one" ).html() ).to.equal( "<em>hello world</em>" );
            });

            it('should convert the model value if binding options has a convert function', function() {
                var el;

                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                stub = sinon.stub( view, "_getBindingOptions" ).returns( { convert : function( value ) {
                    return "Converted: " + value;
                } } );
                view.$el.html( "<div id='el-one' data-bind='mypropertyone'></div>" );
                el = view.$( "[data-bind=mypropertyone]" );
                expect( view.$( "#el-one" ).html() ).to.equal( "" );
                view.setViewData( el, "hello world", "mypropertyone" );
                expect( view.$( "#el-one" ).html() ).to.equal( "Converted: hello world" );
            });
        });

        describe('_bindViewToModel()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                ModelBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should not set up any binding delegate events if no model is set on the view', function() {
                // Create view
                view = new BindingView();
                stub = sinon.stub( view, "_unbindViewFromModel" );
                view._bindViewToModel();
                expect( stub.called ).to.be.false;
            });

            it('should not set up any binding delegate events if excludeBindViewToModel is set to true', function() {
                // Create view
                view = new BindingView({
                    model: new Backbone.Model()
                });
                stub = sinon.stub( view, "_unbindViewFromModel" );
                view.excludeBindViewToModel = true;
                view._bindViewToModel();
                expect( stub.called ).to.be.false;
            });

            it('should call _unbindViewFromModel to clear any existing bindings', function() {
                // Create view
                view = new BindingView({
                    model: new Backbone.Model()
                });
                stub = sinon.stub( view, "_unbindViewFromModel" );
                view._bindViewToModel();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should update the model data when change events occur on form elements with data-bind or name attributes', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='text' data-bind='mypropertyone'>" );
                expect( view.model.get( "mypropertyone" ) ).to.be.undefined;
                view.$( "#input-one" ).val( "hello" );
                view.$( "#input-one" ).trigger( "change" );
                expect( view.model.get( "mypropertyone" ) ).to.equal( "hello" );
                view.$el.html( "<input id='input-two' type='text' name='mypropertytwo'>" );
                expect( view.model.get( "mypropertytwo" ) ).to.be.undefined;
                view.$( "#input-two" ).val( "howdy" );
                view.$( "#input-two" ).trigger( "change" );
                expect( view.model.get( "mypropertytwo" ) ).to.equal( "howdy" );
            });

            it('should update the model data when change events occur on a checkbox elements with data-bind or name attributes', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='checkbox' data-bind='mypropertyone'>" );
                expect( view.model.get( "mypropertyone" ) ).to.be.undefined;
                view.$( "#input-one" ).prop( "checked", true );
                view.$( "#input-one" ).trigger( "change" );
                expect( view.model.get( "mypropertyone" ) ).to.be.true;
                view.$( "#input-one" ).prop( "checked", false );
                view.$( "#input-one" ).trigger( "change" );
                expect( view.model.get( "mypropertyone" ) ).to.be.false;
            });

            it('should not try to set model if no data-bind or name attributes on element', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='text'>" );
                stub = sinon.stub( view.model, "set" );
                view.$( "#input-one" ).val( "hello" );
                view.$( "#input-one" ).trigger( "change" );
                expect( stub.called ).to.be.false;
            });

            it('should exclude any bindExcludes selectors from updating the model data when change events occur on elements with data-bind or name attributes', function() {
                BindingView.prototype.bindExcludes = [ "#input-one" ];
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='checkbox' data-bind='mypropertyone'>" );
                expect( view.model.get( "mypropertyone" ) ).to.be.undefined;
                view.$( "#input-one" ).val( "hello" );
                view.$( "#input-one" ).trigger( "change" );
                expect( view.model.get( "mypropertyone" ) ).to.be.undefined;
            });

            // This is for edge cases where inbetween view setting and being applied on model the value gets changed i.e. a schema
            // For example model value is 1, view tries to set model with -2 but model has a min value of 1 so changes set value to 1
            // This wouldnt cause a change event to fire as the model doesnt see a  change i.e. 1 set to 1 meaning view is now out of date
            it('should update view if model value is different to value set', function() {
                var model = new Backbone.Model();
                model.set( "mypropertyone", 1 );
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: model
                });
                view.$el.html( "<input id='input-one' type='text' name='mypropertyone'>" );
                expect( view.model.get( "mypropertyone" ) ).to.equal( 1 );
                // Stub get so it looks like model has changed value from one set in view
                var getStub = sinon.stub( model, "get" ).returns( 1 );
                stub = sinon.stub( view, "setViewData" );
                view.$( "#input-one" ).val( 0.5 );
                view.$( "#input-one" ).trigger( "change" );
                expect( stub.called ).to.be.true;
                // Called twice - one from change event and one from resetting value
                expect( stub.callCount ).to.equal( 2 );
                expect( stub.calledWith( view.$( document.getElementById( "input-one" ) ), 1, 'mypropertyone' ) ).to.be.true;
                getStub.restore();
            });
        });

        describe('_unbindViewFromModel()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                ModelBindingMixin.call( BindingView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should unbind the change events delegated on the view when _unbindViewFromModel is called', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                expect( $._data( view.$el[ 0 ], 'events' ).change ).to.exist;
                expect( $._data( view.$el[ 0 ], 'events' ).change.length ).to.equal( 1 );
                view._unbindViewFromModel();
                expect( $._data( view.$el[ 0 ], 'events' ) ).not.to.exist;
            });
        });
    });
}));
