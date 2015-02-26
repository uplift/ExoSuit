# Computed Attributes Mixin

**Browser Mixin Name: ExoSuit.Mixins.ComputedAttributesMixin**

**Dependencies:** Underscore.

Create model properties calculated by other properties on the model.

After mixing in to a Backbone Model add a property called computed to the model definition which contains an object with the definitions of the computed properties.

The property key will be used as the computed properties name and the value is an object containing deps and either or both of get and set functions.

All computed properties are omitted from the toJSON call, so will never be sent to the server.

**Examples:**

    var MyModel = Backbone.Model.extend({
        mixins: [ ExoSuit.Mixins.ComputedAttributesMixin ],

        computed: {
            datetime: {
                deps: [ 'date', 'time' ],
                get: function( fields ) {
                    var date = fields.date + "T" + fields.time;
                    return new Date( date );
                },
                set: function( value, fields ) {
                    fields.date = value.getFullYear() + "-" + value.getMonth() + "-" + value.getDate();
                    fields.time = value.getHours() + ":" + value.getMinutes();
                }
            }
        },

        defaults: {
            date: "2015-02-20",
            time: "13:00"
        }
    });

    var myModel = new MyModel();
    var datetime = myModel.get( "datetime" );
    // datetime = Fri Feb 20 2015 13:00:00

    // Date now for example is 21st February 2015 17:15
    myModel.set( "datetime", new Date() );
    var date = myModel.get( "date" );
    // date = 2015-02-21
    var time = myModel.get( "time" );
    // time = 17:15
    var response = myModel.toJSON();
    // response = {
    //    date: "2015-02-20",
    //    time: "13:00"  
    // }
