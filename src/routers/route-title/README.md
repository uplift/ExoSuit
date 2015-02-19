# Route Title Mixin

**Browser Mixin Name: ExoSuit.Mixins.RouteTitleMixin**

**Dependencies:** Underscore, Backbone.

Changes the title of the page when a route is changed.

After mixing in to a Backbone Router, a routeConfig property needs to be added to the router definition. The routeConfig is a hash of key value pairs of route callback names and a config object.  

For this mixin the config object of each callback name needs a title property and value. The title value can be a string or a function that returns a string (the scope of the function is the router object).

A titlePrefix property can also be added to the router definition to prefix every page title with a common brand etc. The titlePrefix can only be a string.

A titleSuffix property can be added for appending to very page title similar to titlePrefix. The titleSuffix can only be a string.

A defaultTitle property can be set to cater for pages that don't have a defined page title. The defaultTitle can be a string or a function.

**Example:**

    var myRouter = Backbone.Router.extend({
        mixins: [ ExoSuit.Mixins.RouteTitleMixin ],

        routes: {
            "": "index",
            "home": "index",
            "login": "login"
        },

        titlePrefix: "My Brand - ",
        titleSuffix: " - The Best Brand in the World!",
        defaultPrefix: "Welcome!",

        routeConfig: {
            index: {
                title: "Homepage"
            },
            login: {
                title: "Login"
            }
        }
    });
