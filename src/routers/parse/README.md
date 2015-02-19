# Parse QueryString Mixin

**Browser Mixin Name: ExoSuit.Mixins.ParseQueryStringMixin**

**Dependencies:** Underscore.

Parses the querystring from a route url into a hash object of key value pairs that get passed to the route callback as part of the params array.

No configuration is required in the router once the mixin is mixed in.

**Example:**

Turns 

URL = http://www.mysite.com/#/search?q=test&category=news

into

    {
        q: "test",
        category: "news"
    }

as part of the array of arguments passed to callback as last argument.
