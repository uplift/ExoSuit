(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'jquery',
                'views/data-binding/DataBinding'
            ],
            function( Backbone, $, DataBindingMixin ) {
                factory( Backbone, $, root.expect, DataBindingMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        // Uses jquery which needs window object so don't run these tests in node
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.jQuery, root.expect, root.ExoSuit.Mixins.DataBindingMixin );
    }
}( this, function( Backbone, $, expect, DataBindingMixin ) {
    describe('Data Binding View Mixin ', function () {
        var view, BindingView, stub, oldMethodStub;

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

        describe('delegateEvents()', function () {
            beforeEach(function() {
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                oldMethodStub = sinon.stub( BindingView.prototype, "delegateEvents" );
                DataBindingMixin.call( BindingView.prototype );
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
                DataBindingMixin.call( BindingView.prototype );
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
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });

            it('should call _unbindViewFromModel function', function() {
                stub = sinon.stub( BindingView.prototype, "_unbindViewFromModel" );
                // Create view
                view = new BindingView();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });
        });

        describe('_bindModelToView()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                DataBindingMixin.call( BindingView.prototype );
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

            it('should set model value on input field with model property as data-bind or name attribute when model changes', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='text' data-bind='mypropertyone'>" );
                expect( view.$( "#input-one" ).val() ).to.equal( "" );
                view.model.set( "mypropertyone", "hello" );
                expect( view.$( "#input-one" ).val() ).to.equal( "hello" );
                view.model.set( "mypropertyone", "world" );
                expect( view.$( "#input-one" ).val() ).to.equal( "world" );

                view.$el.html( "<input id='input-two' type='text' name='mypropertytwo'>" );
                expect( view.$( "#input-two" ).val() ).to.equal( "" );
                view.model.set( "mypropertytwo", "hiya" );
                expect( view.$( "#input-two" ).val() ).to.equal( "hiya" );
                view.model.set( "mypropertytwo", "testing" );
                expect( view.$( "#input-two" ).val() ).to.equal( "testing" );

                view.$el.html( "<textarea id='input-three' name='mypropertythree'></textarea>" );
                expect( view.$( "#input-three" ).val() ).to.equal( "" );
                view.model.set( "mypropertythree", "echo" );
                expect( view.$( "#input-three" ).val() ).to.equal( "echo" );
                view.model.set( "mypropertythree", "sudo" );
                expect( view.$( "#input-three" ).val() ).to.equal( "sudo" );

                view.$el.html( "<select id='input-four' name='mypropertyfour'><option value=''></option><option value='1'>One</option><option value='2'>Two</option></select>" );
                expect( view.$( "#input-four" ).val() ).to.equal( "" );
                view.model.set( "mypropertyfour", "1" );
                expect( view.$( "#input-four" ).val() ).to.equal( "1" );
                view.model.set( "mypropertyfour", "2" );
                expect( view.$( "#input-four" ).val() ).to.equal( "2" );
            });

            it('should check/uncheck model value on checkbox field with model property as data-bind or name attribute when model changes', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='checkbox' data-bind='mypropertyone'>" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertyone", true );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.true;
                view.model.set( "mypropertyone", false );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertyone", "hello" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.true;
                view.model.set( "mypropertyone", "" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertyone", 1 );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.true;
                view.model.set( "mypropertyone", 0 );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertyone", null );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertyone", undefined );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;

                view.$el.html( "<input id='input-two' type='checkbox' name='mypropertytwo'>" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertytwo", true );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.true;
                view.model.set( "mypropertytwo", false );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertytwo", "hello" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.true;
                view.model.set( "mypropertytwo", "" );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertytwo", 1 );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.true;
                view.model.set( "mypropertytwo", 0 );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertytwo", null );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertytwo", undefined );
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
            });

            it('should check/uncheck model value on radio field with a radio group with model property as data-bind or name attribute when model changes', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='radio' data-bind='mypropertyone' name='groupone' value='one'><input id='input-two' type='radio' data-bind='mypropertyone' name='groupone' value='two'><input id='input-three' type='radio' data-bind='mypropertyone' name='groupone' value='three'>" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-three" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertyone", "one" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.true;
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-three" ).is( ":checked" ) ).to.be.false;
                view.model.set( "mypropertyone", "three" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-three" ).is( ":checked" ) ).to.be.true;
                view.model.set( "mypropertyone", "unknown" );
                expect( view.$( "#input-one" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-two" ).is( ":checked" ) ).to.be.false;
                expect( view.$( "#input-three" ).is( ":checked" ) ).to.be.false;
            });

            it('should display the model value as text on the element if not a form element with model property as data-bind or name attribute when model changes', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<div id='el-one' data-bind='mypropertyone'></div>" );
                expect( view.$( "#el-one" ).text() ).to.equal( "" );
                view.model.set( "mypropertyone", "hello" );
                expect( view.$( "#el-one" ).text() ).to.equal( "hello" );
                view.model.set( "mypropertyone", "hello world" );
                expect( view.$( "#el-one" ).text() ).to.equal( "hello world" );
            });

            it('should not set model value on element if _isDirty is false when model changes', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                stub = sinon.stub( view, "_isDirty" ).returns( false );
                view.$el.html( "<input id='input-one' type='text' data-bind='mypropertyone' value='hello'>" );
                expect( view.$( "#input-one" ).val() ).to.equal( "hello" );
                view.model.set( "mypropertyone", "world" );
                expect( view.$( "#input-one" ).val() ).to.equal( "hello" );
            });

            it('should set model value on element if _isDirty is true when model changes', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                stub = sinon.stub( view, "_isDirty" ).returns( true );
                view.$el.html( "<input id='input-one' type='text' data-bind='mypropertyone' value='hello'>" );
                expect( view.$( "#input-one" ).val() ).to.equal( "hello" );
                view.model.set( "mypropertyone", "world" );
                expect( view.$( "#input-one" ).val() ).to.equal( "world" );
            });

            it('should update the view if this.bindings has a selector instead of data-bind or name attributes', function() {
                BindingView.prototype.bindings = {
                    "newproperty": "#el-one"
                };
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<div id='el-one'></div>" );
                expect( view.$( "#el-one" ).text() ).to.equal( "" );
                view.model.set( "newproperty", "hello world" );
                expect( view.$( "#el-one" ).text() ).to.equal( "hello world" );
            });

            it('should update the view of multiple elements if this.bindings has an array of selectors instead of data-bind or name attributes', function() {
                BindingView.prototype.bindings = {
                    "newproperty": [ "#el-one", "#input-one" ]
                };
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<div id='el-one'></div><input id='input-one' type='text'>" );
                expect( view.$( "#el-one" ).text() ).to.equal( "" );
                expect( view.$( "#input-one" ).val() ).to.equal( "" );
                view.model.set( "newproperty", "hello world" );
                expect( view.$( "#el-one" ).text() ).to.equal( "hello world" );
                expect( view.$( "#input-one" ).val() ).to.equal( "hello world" );
            });

            it('should run the bindings function on the view object if this.bindings has a function instead of data-bind or name attributes', function() {
                BindingView.prototype.bindings = {
                    "newproperty": function( change, value, changes ) {
                        var el = this.$( "#input-one" );
                        el.toggleClass( "tog" );
                        el.val( value );
                    }
                };
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='text'>" );
                expect( view.$( "#input-one" ).val() ).to.equal( "" );
                view.model.set( "newproperty", "hello world" );
                expect( view.$( "#input-one" ).hasClass( "tog" ) ).to.be.true;
                expect( view.$( "#input-one" ).val() ).to.equal( "hello world" );
                view.model.set( "newproperty", "testing 123" );
                expect( view.$( "#input-one" ).hasClass( "tog" ) ).to.be.false;
                expect( view.$( "#input-one" ).val() ).to.equal( "testing 123" );
                view.model.set( "newproperty", "goodbye" );
                expect( view.$( "#input-one" ).hasClass( "tog" ) ).to.be.true;
                expect( view.$( "#input-one" ).val() ).to.equal( "goodbye" );
            });
        });

        describe('_isDirty()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                DataBindingMixin.call( BindingView.prototype );
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
                expect( view._dirty.myproperty ).to.not.exist;
            });

            it('should return true if value is the different to the dirty value and element is the same as the dirty element', function() {
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
                expect( view._dirty.myproperty ).to.not.exist;
            });

            it('should return true if value is the different to the dirty value and element is different to the dirty element', function() {
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
                expect( view._dirty.myproperty ).to.exist;
            });
        });

        describe('_bindViewToModel()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                DataBindingMixin.call( BindingView.prototype );
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

            it('should add field to dirty list', function() {
                // Create view
                view = new BindingView({
                    el: "#binding-el",
                    model: new Backbone.Model()
                });
                view.$el.html( "<input id='input-one' type='text' name='myprop'>" );
                view.$( "#input-one" ).val( "hello" );
                view.$( "#input-one" ).trigger( "change" );
                expect( view._dirty.myprop ).to.exist;
                expect( view._dirty.myprop.el[ 0 ] ).to.equal( view.$( "#input-one" )[ 0 ] );
                expect( view._dirty.myprop.value ).to.equal( "hello" );
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
        });

        describe('_unbindViewFromModel()', function () {
            beforeEach(function() {
                this.fixture.html( "<div id='binding-el'></div>" );
                // Create Binding View definition
                BindingView = Backbone.View.extend();
                DataBindingMixin.call( BindingView.prototype );
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
