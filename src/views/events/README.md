# Events Mixin

Define an object of collection/model events similar to the DOM events object in a Backbone View module. The key of each object property is the event name and the value is the callback function. The callback function can be a function or a string of a view property that results in a function.

Behind the scenes, the event is setup using view.listenTo and the usual callback arguments for that function are passed to the callback.

# Collection Events Mixin

**Browser Mixin Name: ExoSuit.Mixins.CollectionEventsMixin**

Collection events can be defined during the extension of a Backbone.View component or during the view initialization through the options argument using the property name collectionEvents.

**Examples:**

    var MyView = Backbone.Collection.extend({
        mixins: [ ExoSuit.Mixins.CollectionEventsMixin ],
        collectionEvents: {
            "add": "addCallback"
        },
        addCallback: function( model, collection, options ) {
            console.log( model.name );
        }
    });

    var myView = new MyView({ collection: new Backbone.Collection() });
    myView.collection.add( { id : 1, name : "Mike" } );
    // Console = Mike

# Model Events Mixin

**Browser Mixin Name: ExoSuit.Mixins.ModelEventsMixin**

Model events can be defined during the extension of a Backbone.View component or during the view initialization through the options argument using the property name modelEvents.

**Examples:**

    var MyView = Backbone.Collection.extend({
        mixins: [ ExoSuit.Mixins.ModelEventsMixin ],
        modelEvents: {
            "change:name": "nameChange"
        },
        nameChange: function( model, value, options ) {
            console.log( value );
        }
    });

    var myView = new MyView({ model: new Backbone.Model() });
    myView.model.set( "name", "Ian" );
    // Console = Ian
