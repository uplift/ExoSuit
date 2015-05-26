# Capped Collection Mixin

**Browser Mixin Name: ExoSuit.Mixins.CappedCollectionMixin**

The size of the collection is fixed to a specified limit.

If more models than the collection limit are added then old models are removed until collection is the size of the limit. The latest models added to the collection within the limit are retained. 

Default limit is 100. 

**Examples:**

    var MyCollection = Backbone.Collection.extend({
        mixins: [ ExoSuit.Mixins.CappedCollectionMixin ],
        model: Backbone.Model,
        limit: 2
    });

    var myCollection = new MyCollection( [ { id : 1, name: "Pete" }, { id : 2,name : "Tom" } ] );
    myCollection.add( { id : 3, name : "Mike" } );
    // [ { id : 2, name : "Tom" }, { id : 3, name : "Mike" } ]
