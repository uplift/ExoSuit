# Exclude From JSON Mixin

**Browser Mixin Name: ExoSuit.Mixins.ExcludeFromJSONMixin**

**Dependencies:** Underscore, ExoSuit Flatten Mixin.

Exclude model properties from appearing in toJSON response. Useful when certain properties on a model shouldn't be sent to the server.

After mixing in to a Backbone Model, add an excludeFromJSON property to the model definition with an array of model property keys that should be removed from toJSON response.

**Example:**

    var MyModel = ExoSuit.Model.extend({
        mixins: [ ExoSuit.Mixins.ExcludeFromJSONMixin ],

        excludeFromJSON: [ "hello" ],

        defaults: {
            hello: "world",
            foo: "bar",
            bar: "baz"
        }
    });

    var myModel = new MyModel();
    var response = myModel.toJSON();
    // response = {
    //    hello: "world",
    //    bar: "baz"  
    // }
