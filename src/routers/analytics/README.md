# Google Analytics Mixin

**Browser Mixin Name: ExoSuit.Mixins.GoogleAnalyticsRouteMixin**

**Dependencies:** Backbone.

When a route changes and the route callback is executed within the Backbone Router, it fires a google tracking event with the hash url.

Must have google analytics loaded when route change occurs for event to be tracked.

Detects if old (window._gaq) or new (window.GoogleAnalyticsObject) is used and creates necessary tracking event for version.

No extra configuration is needed within the router. Once this mixin is mixed in to the router it will create event for each route change.
