# View Selector Mixin

**Browser Mixin Name: ExoSuit.Mixins.SelectorMixin**

**Dependencies:** Underscore.

Define a list of selectors used within a view and cache them automatically.  

The selector attribute is an object with the key as the selector name and the value as the (jQuery) selector. Use the get method, passing the selector name as the first argument, to retrieve the DOM nodes.

The first time the this.get method is called with a selector name, the result of the selector is cached so further calls to the this.get method with same selector name uses the cached result instead of querying the DOM again. Behind the scenes this.$( SELECTOR ) is used the first time this.get is called.

You can also use the selector name within the events hash to avoid duplicating selectors within the view.

Utility functions:-

hasSelector - Pass selector name to hasSelector as only argument to determine if a selector has been setup for the name.
isValidSelector - Pass selector name to isValidSelector as only argument to check if selector exists within the current view DOM.
isCachedSelector - Pass selector name to isCachedSelector as only argument to determine whether selector has already been cached.
clearSelector - Pass selector name to clearSelector as only argument to remove selector from cached selector list. Don't pass a selector to clearSelector to remove all cached selectors.

**Examples:**

    var MyView = ExoSuit.View.extend({
        mixins: [ ExoSuit.Mixins.SelectorMixin ],
        selectors: {
            "username": "#usernameField",
            "password": "#passwordField",
            "button": "#submitButton"
        },
        events: {
            // button is replace by #submitButton when events are delegated
            "click button": "submitForm"
        },
        submitForm: function( event ) {
            var user = this.get( "username" ).val(),
                pass = this.get( "password" ).val();

            // Querys DOM for button using jQuery this.$( "#submitButton" )
            this.get( "button" ).text( "submitting..." );

            // Do something with data

            // Uses cached DOM from previous get call
            this.get( "button" ).text( "Submit" );
        }
    });
