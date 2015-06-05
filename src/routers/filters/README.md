# Route Filter Mixin

**Browser Mixin Name: ExoSuit.Mixins.RouteFilterMixin**

**Dependencies:** Underscore, Backbone.

Runs before, after and leave filter function around the route callback for easy pre and post processing of common things like authentication or view cleanup. 

After mixing in to a Backbone Router, three main function can be added to the Router prototype.  They are before, after and leave.  These three functions are global to all routes and if defined will be executed whenever the route changes.

Individual route before and after functions can be defined within the routeConfig property and will only run when a route with the routeConfig callback name is matched. 

**Example:**

    var myRouter = ExoSuit.Router.extend({
        mixins: [ ExoSuit.Mixins.RouteFilterMixin ],

        routes: {
            "": "index",
            "home": "index",
            "login": "login"
        },

        leave: function( args ) {
            // This function is called each time a route changes
        },

        before: function( args ) {
            // This function is called before every route
        },

        after: function( args ) {
            // This function is called after every route 
        },

        routeConfig: {
            index: {
                before: function( args ) {
                    // This function is called before the index route callback
                },
                after: function( args ) {
                    // This function is called after the index route callback
                }
            },
            login: {
                before: function( args, done ) {
                    // This function is called before the login route callback
                    // This is an async callback so done needs to be called when function is finished executing
                    done();
                },
                after: function( args, done ) {
                    // This function is called after the login route callback
                    // This is an async callback so done needs to be called when function is finished executing
                    done();
                }
            }
        },

        index: function() {
            // Index route callback
        },

        login: function() {
            // Login route callback
        }
    });
