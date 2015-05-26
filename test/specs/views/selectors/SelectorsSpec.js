(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'jquery',
                'sinon',
                'views/selectors/Selectors'
            ],
            function( Backbone, $, sinon, SelectorMixin ) {
                factory( Backbone, $, root.expect, sinon, SelectorMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        /*var fs = require( 'fs' );
        var expect = require( 'chai' ).expect;
        var Backbone = require( 'backbone' );
        var $ = require( 'jquery' )( require( 'jsdom' ).jsdom( fs.readFileSync( './test/specs/fixtures/main.html' ) ).parentWindow );
        Backbone.$ = $;
        var sinon = require( 'sinon' );
        var SelectorMixin = require( '../../../../src/views/selectors/Selectors' );
        factory( Backbone, $, expect, sinon, SelectorMixin );*/
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.jQuery, root.expect, root.sinon, root.ExoSuit.Mixins.SelectorMixin );
    }
}( this, function( Backbone, $, expect, sinon, SelectorMixin ) {
    describe('Selector Mixin View', function () {
        var view, SelectorView, stub, stub2, oldMethodStub;

        before(function() {
            // If karma, add fixtures html
            if ( typeof __html__ !== "undefined" ) {
                document.body.innerHTML = __html__[ 'test/specs/fixtures/main.html' ];
            }
            // Create fixture DOM placeholder
            this.fixture = $( "<div id='selector-area'></div>" );
            // Add fixture to DOM
            this.fixture.appendTo( "#fixtures" );
        });

        after(function() {
            // Empty any DOM created as part of this test suite
            $( "#fixtures" ).empty();
        });

        describe('initialize()', function () {
            beforeEach(function() {
                // Create SelectorView definition
                SelectorView = Backbone.View.extend({
                    initialize: function( options ) {}
                });
                oldMethodStub = sinon.stub( SelectorView.prototype, "initialize" );
                SelectorMixin.call( SelectorView.prototype );
            });

            afterEach(function() {
                view.remove();
                oldMethodStub.restore();
            });

            it('should set this._selectors empty object from the mixin initialize function', function() {
                // Create view
                view = new SelectorView();
                expect( view._selectors ).to.be.an( 'object' );
                expect( view._selectors ).to.be.empty;
            });

            it('should run the original initialize function too', function() {
                // Create view
                view = new SelectorView();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });
        });

        describe('delegate()', function () {
            beforeEach(function() {
                // Add dom to fixture
                this.fixture.html( "<div id='selector-el'><button type='button' id='button'></div>" );
                // Create View definition based on SelectorView module
                SelectorView = Backbone.View.extend({
                    el: "#selector-el",
                    selectors: {
                        "myButton" : "#button"
                    },
                    test: function() {
                        return 10;
                    }
                });
                oldMethodStub = sinon.stub( SelectorView.prototype, "delegate" );
                SelectorMixin.call( SelectorView.prototype );
            });

            afterEach(function() {
                view.remove();
                oldMethodStub.restore();
            });

            it('should call the old delegate function with correct selectors when the delegate function is called', function() {
                // Create view
                view = new SelectorView();
                view.delegate( "click", "myButton", view.test );
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                expect( oldMethodStub.calledWithMatch( "click", "#button", view.test ) ).to.be.true;
                expect( oldMethodStub.neverCalledWithMatch( "click", "myButton", view.test ) ).to.be.true;
            });
        });

        describe('undelegate()', function () {
            beforeEach(function() {
                // Add dom to fixture
                this.fixture.html( "<div id='selector-el'><button type='button' id='button'></div>" );
                // Create View definition based on SelectorView module
                SelectorView = Backbone.View.extend({
                    el: "#selector-el",
                    selectors: {
                        "myButton" : "#button"
                    },
                    test: function() {
                        return 10;
                    }
                });
                oldMethodStub = sinon.stub( SelectorView.prototype, "undelegate" );
                SelectorMixin.call( SelectorView.prototype );
            });

            afterEach(function() {
                view.remove();
                oldMethodStub.restore();
            });

            it('should call the old undelegate function with correct selectors when the undelegate function is called', function() {
                // Create view
                view = new SelectorView();
                view.undelegate( "click", "myButton", view.test );
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                expect( oldMethodStub.calledWithMatch( "click", "#button", view.test ) ).to.be.true;
                expect( oldMethodStub.neverCalledWithMatch( "click", "myButton", view.test ) ).to.be.true;
            });
        });

        describe('get()', function () {
            beforeEach(function() {
                // Add dom to fixture
                this.fixture.html( "<div id='selector-el'><input type='text' id='username'><input type='text' id='password'><div class='list'></div></div>" );
                // Create SelectorView definition
                SelectorView = Backbone.View.extend({
                    el: "#selector-el",
                    selectors: {
                        "usernameField" : "#username",
                        "passwordField" : "#password",
                        "listDivs"      : ".list"
                    }
                });
                SelectorMixin.call( SelectorView.prototype );
            });

            afterEach(function() {
                // Clear down fixture DOM
                this.fixture.empty();
                // Clean up any stubs
                stub.restore();
                stub2.restore();
                view.remove();
            });

            it('should return undefined if selector isnt defined in selector list', function() {
                // Create view
                view = new SelectorView();
                // Stub function that is used internally to this method
                stub = sinon.stub( view, "isCachedSelector" ).returns( false );
                stub2 = sinon.stub( view, "hasSelector" ).returns( false );
                expect( view.get( "noneExistingField" ) ).to.be.undefined;
            });

            it('should return a jquery object if selector has not been cached already and is in the selector list', function() {
                // Create view
                view = new SelectorView();
                expect( view.isCachedSelector( "usernameField" ) ).to.be.false;
                // Stub function that is used internally to this method
                stub = sinon.stub( view, "isCachedSelector" ).returns( false );
                stub2 = sinon.stub( view, "hasSelector" ).returns( true );
                var element = view.get( "usernameField" );
                expect( element ).to.exist;
                expect( element.length ).to.equal( 1 );
            });

            it('should cache the selector in the _selectors object', function() {
                // Create view
                view = new SelectorView();
                expect( view.isCachedSelector( "usernameField" ) ).to.be.false;
                view.get( "usernameField" );
                expect( view.isCachedSelector( "usernameField" ) ).to.be.true;
            });

            it('should return cached selector if selector has already been queried and cached', function() {
                // Create view
                view = new SelectorView();
                expect( view.isCachedSelector( "usernameField" ) ).to.be.false;
                view.get( "usernameField" );
                expect( view.isCachedSelector( "usernameField" ) ).to.be.true;
                stub = sinon.stub( view._selectors[ 'usernameField' ], "closest" ).returns( [ 1 ] );
                $( "#username" ).remove();
                var element = view.get( "usernameField" );
                expect( element ).to.exist;
                expect( element.length ).to.equal( 1 );
            });

            it('should re query the DOM if the cached selector is no longer in the view', function() {
                // Create view
                view = new SelectorView();
                expect( view.isCachedSelector( "usernameField" ) ).to.be.false;
                view.get( "usernameField" );
                expect( view.isCachedSelector( "usernameField" ) ).to.be.true;
                $( "#username" ).remove();
                var element = view.get( "usernameField" );
                expect( view.isCachedSelector( "usernameField" ) ).to.be.false;
                expect( element ).not.to.exist;
            });

            it('should re query DOM if refresh flag is set to true', function() {
                // Create view
                view = new SelectorView();
                expect( view.isCachedSelector( "listDivs" ) ).to.be.false;
                var element = view.get( "listDivs" );
                expect( element ).to.exist;
                expect( element.length ).to.equal( 1 );
                expect( view.isCachedSelector( "listDivs" ) ).to.be.true;
                view.$el.append( "<div class='list'></div>" );
                element = view.get( "listDivs", true );
                expect( element ).to.exist;
                expect( element.length ).to.equal( 2 );
            });
        });

        describe('hasSelector()', function () {
            beforeEach(function() {
                // Create SelectorView definition
                SelectorView = Backbone.View.extend({
                    selectors: {
                        "usernameField": "#username",
                        "passwordField": "#password"
                    }
                });
                SelectorMixin.call( SelectorView.prototype );
            });

            afterEach(function() {
                view.remove();
            });

            it('should return true for keys defined within selectors list', function() {
                // Create view
                view = new SelectorView();
                expect( view.hasSelector( "usernameField" ) ).to.be.true;
                expect( view.hasSelector( "passwordField" ) ).to.be.true;
            });

            it('should return false for keys not defined within selectors list', function() {
                // Create view
                view = new SelectorView();
                expect( view.hasSelector( "submitButton" ) ).to.be.false;
            });
        });

        describe('isValidSelector()', function () {
            beforeEach(function() {
                // Add dom to fixture
                this.fixture.html( "<div id='selector-el'><input type='text' id='username'><input type='text' id='password'></div>" );
                // Create SelectorView definition
                SelectorView = Backbone.View.extend({
                    el: "#selector-el",
                    selectors: {
                        "usernameField" : "#username",
                        "passwordField" : "#password",
                        "confirmField"  : "#confirm"
                    }
                });
                SelectorMixin.call( SelectorView.prototype );
                // Create view
                view = new SelectorView();
            });

            afterEach(function() {
                // Clear down fixture DOM
                this.fixture.empty();
                view.remove();
            });

            it('should return true for a key with a valid selector within the Views DOM area', function() {
                expect( view.isValidSelector( "usernameField" ) ).to.be.true;
                expect( view.isValidSelector( "passwordField" ) ).to.be.true;
            });

            it('should return false for a key with a selector that isnt within the Views DOM area', function() {
                expect( view.isValidSelector( "confirmField" ) ).to.be.false;
            });
        });

        describe('isCachedSelector()', function () {
            beforeEach(function() {
                // Create SelectorView definition
                SelectorView = Backbone.View.extend();
                SelectorMixin.call( SelectorView.prototype );
                // Create view
                view = new SelectorView();
                // Fake a set of predefined cached selectors - just a hash needed, values don't matter
                view._selectors = {
                    "usernameField": "value",
                    "passwordField": "anotherValue"
                };
            });

            afterEach(function() {
                view.remove();
            });

            it('should return true for keys that have cached selectors', function() {
                expect( view.isCachedSelector( "usernameField" ) ).to.be.true;
                expect( view.isCachedSelector( "passwordField" ) ).to.be.true;
            });

            it('should return false for keys that do not have cached selectors', function() {
                expect( view.isCachedSelector( "submitButton" ) ).to.be.false;
            });
        });

        describe('clearSelector()', function () {
            beforeEach(function() {
                // Create SelectorView definition
                SelectorView = Backbone.View.extend();
                SelectorMixin.call( SelectorView.prototype );
            });

            afterEach(function() {
                // Clean up any stubs
                stub.restore();
                view.remove();
            });

            it('should remove cached selector if key is supplied and is already cached', function() {
                // Stub function that is used internally to this method
                stub = sinon.stub( SelectorView.prototype, "isCachedSelector" ).returns( true );
                // Create view
                view = new SelectorView();
                // Fake a set of predefined cached selectors - just a hash needed, values don't matter
                view._selectors = {
                    "testKey": "value"
                };
                expect( view._selectors ).to.be.an( 'object' );
                expect( view._selectors ).to.not.be.empty;
                view.clearSelector( "testKey" );
                expect( view._selectors ).to.be.an( 'object' );
                expect( view._selectors ).to.be.empty;
            });

            it('should remove all cached selectors if no key is passed', function() {
                // Create view
                view = new SelectorView();
                // Fake a set of predefined cached selectors - just a hash needed, values don't matter
                view._selectors = {
                    "testKey": "value",
                    "anotherTest": "anotherValue"
                };
                expect( view._selectors ).to.be.an( 'object' );
                expect( view._selectors ).to.not.be.empty;
                view.clearSelector();
                expect( view._selectors ).to.be.an( 'object' );
                expect( view._selectors ).to.be.empty;
            });
        });

        describe('remove()', function () {
            beforeEach(function() {
                // Create SelectorView definition
                SelectorView = Backbone.View.extend();
                oldMethodStub = sinon.stub( SelectorView.prototype, "remove" );
                SelectorMixin.call( SelectorView.prototype );
            });

            afterEach(function() {
                // Clean up any stubs
                stub.restore();
                oldMethodStub.restore();
            });

            it('should call clearSelector when remove is called', function() {
                // Stub function that is used internally to this method
                stub = sinon.stub( SelectorView.prototype, "clearSelector" );
                // Create view
                view = new SelectorView();
                view.remove();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith() ).to.be.true;
            });

            it('should call old remove method when remove is called', function() {
                // Stub function that is used internally to this method
                stub = sinon.stub( SelectorView.prototype, "clearSelector" );
                // Create view
                view = new SelectorView();
                view.remove();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
                expect( oldMethodStub.calledWith() ).to.be.true;
            });
        });
    });
}));
