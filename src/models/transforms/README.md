# Transform Attribute Values Mixin

**Browser Mixin Name: ExoSuit.Mixins.TransformMixin**

**Dependencies:** Underscore, ExoSuit Flatten Mixin.

Transform your model data into certain data types when its received from the server and when its sent to the server.

Once mixed in to a Backbone Model, define your transforms under the transforms property within the model definition.

The transforms property is a hash of model property and transform definition name.

    var MyModel = ExoSuit.Model.extend({
        mixins: [ ExoSuit.Mixins.TransformMixin ],

        defaults: {
            "hello" : "world",
            "number": "50" 
        },

        transforms: {
            number: "number"
        }
    });

    var myModel = new MyModel();
    var num = myModel.get( "number" );
    // num == 50

By default, there are 3 transformations defined.  They are string, number and boolean.

You can define your own transformations on a model by declaring a property called transformations which is a hash of transformation name and an object containing a serialize and deserialize functions.

Deserialize processes the model attribute when model.parse() is called i.e. when data is received from the server. Serialize processes the model attribute when a model property is about to be sent to the datasource/server i.e. model.toJSON() or model.sync() with patch attributes.

    var MyModel = ExoSuit.Model.extend({
        mixins: [ ExoSuit.Mixins.TransformMixin ],

        defaults: {
            "hello" : "world",
            "number": "50.8" 
        },

        transformations: {
            integer: {
                deserialize: function( value ) {
                    return ( !isNaN( value ) ? parseInt( value, 10 ) : null );
                },
                serialize: function( value ) {
                    return ( !isNaN( value ) ? parseInt( value, 10 ) : null );
                }
            }
        }

        transforms: {
            number: "integer"
        }
    }); 

    var myModel = new MyModel();
    var num = myModel.get( "number" );
    // num == 51
