# Sort on Model Change Mixin

**Browser Mixin Name: ExoSuit.Mixins.SortOnChangeMixin**

Whenever a model within a collection changes, resort the collection.

If the comparator of the collection is a string, then the collection is only sorted when the model attribute matching the string is changed.

If the comparator of the collection is not a string, the collection is sorted on every model change in the collection. Depending on the collection, this could cause some performance issues if the data changes often.

**Examples:**

    var MyCollection = ExoSuit.Collection.extend({
        mixins: [ ExoSuit.Mixins.SortOnChangeMixin ],
        model: Backbone.Model,
        comparator: "name"
    });

    var myCollection = new MyCollection( [ { id : 1, name: "Pete" }, { id : 2,name : "Tom" }, { id : 3, name : "Mike" } ] );
    myCollection.toJSON();
    // [ { id : 1, name: "Pete" }, { id : 3, name : "Mike" }, { id : 2, name : "Tom" } ]
    var model = myCollection.at( 0 );
    model.set( "name", "Steve" );
    myCollection.toJSON();
    // [ { id : 3, name : "Mike" }, { id : 1, name: "Steve" }, { id : 2, name : "Tom" } ]
