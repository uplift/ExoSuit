(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'jquery',
                'underscore',
                'backbone',
                'sinon',
                'views/modal/BootstrapModal'
            ],
            function( jQuery, _, Backbone, sinon, BootstrapModalMixin ) {
                factory( jQuery, _, Backbone, root.expect, sinon, BootstrapModalMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        /* This is a Client side mixin only */
    // Finally, as a browser global.
    } else {
        factory( root.jQuery, root._, root.Backbone, root.expect, root.sinon, root.ExoSuit.Mixins.BootstrapModalMixin );
    }
}( this, function( jQuery, _, Backbone, expect, sinon, BootstrapModalMixin ) {
    describe('Bootstrap Modal Mixin View', function () {
        var view, ModalView, stub, oldMethodStub;

        describe('initialize()', function () {
            beforeEach(function() {
                // Create ModalView definition
                ModalView = Backbone.View.extend({
                    initialize: function( options ) {}
                });
                oldMethodStub = sinon.stub( ModalView.prototype, "initialize" );
                BootstrapModalMixin.call( ModalView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                oldMethodStub.restore();
                view.remove();
            });

            it('should set any bootstrap options on the view when passed in the view initialization', function() {
                var opts = {
                    keyboard: false,
                    backdrop: true
                };
                // Create view
                view = new ModalView({
                    bootstrapOptions: opts
                });
                expect( view.bootstrapOptions ).to.equal( opts );
            });

            it('should pass bootstrap options to bootstrap modal function', function() {
                var opts = {
                    keyboard: false,
                    backdrop: true
                };
                stub = sinon.stub( jQuery.fn, "modal" );
                // Create view
                view = new ModalView({
                    bootstrapOptions: opts
                });
                expect( stub.called ).to.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( {
                    keyboard: false,
                    backdrop: true,
                    show: false
                } ) ).to.be.true;
                // afterEach stub restore in Karma shows stub as undefined for some strange reason, so need to restore here as workaround
                stub.restore();
            });

            it('should set initial bootstrap show option to true if autoShow option is set to true during the view initialization', function() {
                var opts = {
                    keyboard: false,
                    backdrop: true
                };
                stub = sinon.stub( jQuery.fn, "modal" );
                // Create view
                view = new ModalView({
                    autoShow: true,
                    bootstrapOptions: opts
                });
                expect( stub.called ).to.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( {
                    keyboard: false,
                    backdrop: true,
                    show: true
                } ) ).to.be.true;
                // afterEach stub restore in Karma shows stub as undefined for some strange reason, so need to restore here as workaround
                stub.restore();
            });

            it('should call super initialize function', function() {
                // Create view
                view = new ModalView();
                expect( oldMethodStub.called ).to.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });
        });

        describe('open()', function () {
            beforeEach(function() {
                // Create ModalView definition
                ModalView = Backbone.View.extend({
                    initialize: function( options ) {}
                });
                BootstrapModalMixin.call( ModalView.prototype );
            });

            afterEach(function() {
                stub.restore();
                view.remove();
            });

            it('should call bootstrap modal function on view element with show argument', function() {
                // Create view
                view = new ModalView();
                stub = sinon.stub( view.$el, 'modal' );
                view.open();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( 'show' ) ).to.be.true;
            });
        });

        describe('close()', function () {
            beforeEach(function() {
                // Create ModalView definition
                ModalView = Backbone.View.extend({
                    initialize: function( options ) {}
                });
                BootstrapModalMixin.call( ModalView.prototype );
            });

            afterEach(function() {
                stub.restore();
                view.remove();
            });

            it('should call bootstrap modal function on view element with hide argument', function() {
                // Create view
                view = new ModalView();
                stub = sinon.stub( view.$el, 'modal' );
                view.close();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( 'hide' ) ).to.be.true;
            });
        });

        describe('toggle()', function () {
            beforeEach(function() {
                // Create ModalView definition
                ModalView = Backbone.View.extend({
                    initialize: function( options ) {}
                });
                BootstrapModalMixin.call( ModalView.prototype );
            });

            afterEach(function() {
                if ( stub ) {
                    stub.restore();
                }
                view.remove();
            });

            it('should call bootstrap modal function on view element with toggle argument', function() {
                // Create view
                view = new ModalView();
                stub = sinon.stub( view.$el, 'modal' );
                view.toggle();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
                expect( stub.calledWith( 'toggle' ) ).to.be.true;
            });
        });

        describe('remove()', function () {
            beforeEach(function() {
                // Create ModalView definition
                ModalView = Backbone.View.extend({
                    initialize: function( options ) {}
                });
                oldMethodStub = sinon.stub( ModalView.prototype, "remove" );
                BootstrapModalMixin.call( ModalView.prototype );
            });

            afterEach(function() {
                oldMethodStub.restore();
                if ( stub ) {
                    stub.restore();
                }
            });

            it('should call the views close function', function() {
                // Create view
                view = new ModalView();
                stub = sinon.stub( view, 'close' );
                view.remove();
                expect( stub.called ).to.be.true;
                expect( stub.callCount ).to.equal( 1 );
            });

            it('should call the super remove function', function() {
                // Create view
                view = new ModalView();
                view.remove();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });
        });
    });
}));
