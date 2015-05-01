# Flatten Attributes Mixin

**Browser Mixin Name: ExoSuit.Mixins.FlattenMixin**

**Dependencies:** Underscore, Backbone.

Flatten a nested object to flat single depth object.

When mixed in to a Backbone.Model, it adds flatten and unflatten functions.

Flatten accepts a hash of attributes to flatten or if no attributes argument is given, then takes model.attributes to flatten.

Unflatten accepts a hash of single depth attributes and returns the nested hash of attributes. 

**Example:**

    var MyModel = ExoSuit.Model.extend({
        mixins: [ ExoSuit.Mixins.FlattenMixin ],

        defaults: {
            "main" : {
                "childKey": "value",
                "myArray": [ "good", "bye" ],
                "arrayObjects": [ { "key": "value" } ]
            }
        }
    });

    var myModel = new MyModel();
    var flattened = myModel.flatten();
    // {
    //      "main.childKey" : "value",
    //      "main.myArray.0" : "good",
    //      "main.myArray.1" : "bye",
    //      "main.arrayObjects.0.key" : "value"
    // }
    // Return to nested structure
    var nestedAttrs = myModel.unflatten( flattened );
