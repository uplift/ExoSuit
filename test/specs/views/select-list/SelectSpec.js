(function( root, factory ) {
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'backbone',
                'sinon',
                'views/select-list/Select'
            ],
            function( Backbone, sinon, SelectListMixin ) {
                factory( Backbone, root.expect, sinon, SelectListMixin );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        /* This is a Client side mixin only */
    // Finally, as a browser global.
    } else {
        factory( root.Backbone, root.expect, root.sinon, root.ExoSuit.Mixins.SelectListMixin );
    }
}( this, function( Backbone, expect, sinon, SelectListMixin ) {
    describe('Select List Mixin View', function () {
        var view, SelectView, oldMethodStub;

        describe('initialize()', function () {
            beforeEach(function() {
                // Create SelectorView definition
                SelectView = Backbone.View.extend({
                    initialize: function( options ) {}
                });
                oldMethodStub = sinon.stub( SelectView.prototype, "initialize" );
                SelectListMixin.call( SelectView.prototype );
            });

            afterEach(function() {
                view.remove();
            });

            it('should override default select list options if passed in options hash to initialize', function() {
                // Create view
                view = new SelectView({
                    labelKey: "myLabel",
                    valueKey: "myValue",
                    addInitialOption: true,
                    initialOptionLabel: "Select Value",
                    initialOptionValue: "100",
                    selectedIndex: 1
                });
                expect( view.labelKey ).to.equal( 'myLabel' );
                expect( view.valueKey ).to.equal( 'myValue' );
                expect( view.addInitialOption ).to.be.true;
                expect( view.initialOptionLabel ).to.equal( 'Select Value' );
                expect( view.initialOptionValue ).to.equal( '100' );
                expect( view.selectedIndex ).to.equal( 1 );
            });

            it('should call old initialize method', function() {
                // Create view
                view = new SelectView();
                expect( oldMethodStub.called ).to.be.true;
                expect( oldMethodStub.callCount ).to.equal( 1 );
            });
        });

        describe('render()', function () {
            beforeEach(function() {
                // Create SelectorView definition
                SelectView = Backbone.View.extend();
                SelectListMixin.call( SelectView.prototype );
            });

            afterEach(function() {
                view.remove();
            });

            it('should add the models of the collection as option tags within the select element of the view', function() {
                // Create view
                view = new SelectView({
                    collection: new Backbone.Collection( [
                        {
                            label: "One",
                            value: "1"
                        },
                        {
                            label: "Two",
                            value: "2"
                        },
                        {
                            label: "Three",
                            value: "3"
                        }
                    ] )
                });
                expect( view.render().html() ).to.equal( '<option value="1">One</option><option value="2">Two</option><option value="3">Three</option>' );
            });

            it('should add an initial option if set to true', function() {
                // Create view
                view = new SelectView({
                    addInitialOption: true,
                    collection: new Backbone.Collection( [
                        {
                            label: "One",
                            value: "1"
                        },
                        {
                            label: "Two",
                            value: "2"
                        },
                        {
                            label: "Three",
                            value: "3"
                        }
                    ] )
                });
                expect( view.render().html() ).to.equal( '<option value="0">Please Select</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option>' );
                // Create view
                view = new SelectView({
                    addInitialOption: true,
                    initialOptionLabel: "Select Value",
                    initialOptionValue: "",
                    collection: new Backbone.Collection( [
                        {
                            label: "One",
                            value: "1"
                        },
                        {
                            label: "Two",
                            value: "2"
                        },
                        {
                            label: "Three",
                            value: "3"
                        }
                    ] )
                });
                expect( view.render().html() ).to.equal( '<option value="">Select Value</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option>' );
            });

            it('should ', function() {
                // Create view
                view = new SelectView({
                    selectedIndex: 2,
                    collection: new Backbone.Collection( [
                        {
                            label: "One",
                            value: "1"
                        },
                        {
                            label: "Two",
                            value: "2"
                        },
                        {
                            label: "Three",
                            value: "3"
                        }
                    ] )
                });
                expect( view.render().html() ).to.equal( '<option value="1">One</option><option value="2">Two</option><option value="3" selected="">Three</option>' );
            });
        });
    });
}));
