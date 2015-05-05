# View Switcher Mixin

**Browser Mixin Name: ExoSuit.Mixins.ViewSwitcherMixin**

**Dependencies:** Underscore.

A mixin to list subviews of a view and switch between them.

Subviews can be added through the views property during extension of a view class and by passing in a views object in the options argument during the view initialization.

The first subview to be shown should have the id of 'initial'.

The render of this view should only be called once. If an initial subview is setup then render will switch to the initial subview.

To switch to a different subview, call the switchView function with the id of the subview to change to.  Switching views will call the remove function of the current view (if it exists), calls the render and delegateEvents functions of the new subview and inserts the subview parent element into this views parent element using jQuery html function.

Subviews can be programmatically added and removed by calling addView with an id and view instance as arguments and removeView with an id as the only argument.

You can retrieve a subview instance from the parent view by calling getView with an id as the only argument.

Any events that are omitted by the subviews will automatically be proxied through the parent view, so any listeners can register with the parent view instead of having to obtain the necessary subview and register with it.

**Examples**

    var SubviewOne = Backbone.View.extend({
        render: function() {
            this.$el.html( "<strong>HELLO</strong>" );
        }
    });
    var SubviewTwo = Backbone.View.extend({
        render: function() {
            this.$el.html( "<em>WORLD</em>" );
        }
    });
    var SubviewThree = Backbone.View.extend({
        render: function() {
            this.$el.html( "BOOM!!!" );
        }
    });
    var SubviewTwo = Backbone.View.extend({
        render: function() {
            this.$el.html( "BANG!!!" );
        }
    });

    var subviewOne = new SubviewOne();

    var MyView = ExoSuit.View.extend({
        mixins: [ ExoSuit.Mixins.ViewSwitcherMixin ],
        views: {
            "initial": subviewOne,
            "pageOne": subviewOne,
            "pageTwo": new SubviewTwo()
        }
    }); 

    var myView = new MyView({
        views: {
            "pageThree": new SubviewThree()
        }
    });

    myView.render();
    // Initial view shown i.e. SubviewOne
    myView.switchView( "pageTwo" );
    // SubviewTwo displayed
    myView.switchView( "pageThree" );
    // SubviewThree displayed
    myView.addView( "pageFour", new SubviewFour() );
    myView.switchView( "pageFour" );
    // SubviewFour displayed
