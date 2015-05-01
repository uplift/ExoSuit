# Subsets

A subset collection is a collection in its own right that gets its data from a parent collection.  The data in the parent collection is filtered depending on the type of subset to only contain the relevant models for the subset.

When data in the parent collection changes, the subset is updated to reflect the changes if it is relevant to the subset filter mechanism.

All subset collections require a parent collection being passed in the options argument (as the parent attribute) when the subset collection is initialized.

# Capped Subset Mixin

**Browser Mixin Name: ExoSuit.Mixins.CappedSubsetMixin**

**Dependencies:** Underscore.

Extend a collection with a limit and order attributes. The limit attribute is the capped limit of models the subset will include at anytime. The order is either 'first' or 'last' and is which end of the parent collection the subset data is retrieved from.

The subset has two utility methods on its prototype. They are resize and reorder. 

subset.resize accepts a size value and a options hash as arguments. The size value is the new limit the subset collection should be changed too. As part of the resize, any models that need to be removed or added to the subset will be done without a full reset of the subset collection meaning the add and remove events ca be listened for.

subset.reorder accepts only a options argument. subset.reorder will toggle the order value between 'first' and 'last' and reset the data in the subset collection.

Default limit value is 100 and the default order value is 'last'.

**Examples:**

    var MyCollection = ExoSuit.Collection.extend({
        mixins: [ ExoSuit.Mixins.CappedSubsetMixin ],
        model: Backbone.Model,
        limit: 2,
        order: 'last'
    });

    var parent = new Backbone.Collection( [ { id : 1, name: "Pete" }, { id : 2,name : "Tom" }, { id : 3, name : "Mike" } ] );
    var myCollection = new MyCollection( null, {
        parent: parent
    } );
    myCollection.toJSON();
    // [ { id : 2, name : "Tom" }, { id : 3, name : "Mike" } ]
    parent.add( { id : 4, name : "Steve" } );
    // [ { id : 3, name : "Mike" }, { id : 4, name : "Steve" } ]
    myCollection.reorder();
    // [ { id : 1, name: "Pete" }, { id : 2,name : "Tom" } ]
    myCollection.resize( 3 );
    // [ { id : 1, name: "Pete" }, { id : 2,name : "Tom" }, { id : 3, name : "Mike" } ]

# Filtered Subset Mixin

**Browser Mixin Name: ExoSuit.Mixins.FilteredSubsetMixin**

Extend a collection with a filter function. The filter function is run on all the models in the parent collection and models that pass the filter function as true are added to the subset collection.

Filter function can be defined when extending a collection or through the filter attribute on the options argument when the subset collection is initialized.

Default filter function returns true for all parent models so should be overridden.

**Examples:**

    var MyCollection = ExoSuit.Collection.extend({
        mixins: [ ExoSuit.Mixins.FilteredSubsetMixin ],
        model: Backbone.Model
    });

    var parent = new Backbone.Collection( [ { id : 1, name: "Pete" }, { id : 2,name : "Tom" }, { id : 3, name : "Mike" } ] );
    var myCollection = new MyCollection( null, {
        parent: parent,
        filter: function( model ) {
            return model.id >= 2;
        }
    } );
    myCollection.toJSON();
    // [ { id : 2, name : "Tom" }, { id : 3, name : "Mike" } ]
    parent.add( { id : 4, name : "Steve" } );
    myCollection.toJSON();
    // [ { id : 2, name : "Tom" }, { id : 3, name : "Mike" }, { id : 4, name : "Steve" } ]
    parent.remove( parent.at( 2 ) );
    myCollection.toJSON();
    // [ { id : 2, name : "Tom" }, { id : 4, name : "Steve" } ]

# Pagination Subset Mixin

**Browser Mixin Name: ExoSuit.Mixins.PaginationSubsetMixin**

**Dependencies:** Underscore, Backbone.

Extend a collection with paging state. The paging state determines which models should be taken from the parent collection and stored within the subset collection.

The paging state can be defined when extending a collection or through the pagingState attribute on the options argument when the subset collection is initialized.  

pagingState is an object consisting of currentPage and perPage properties. The currentPage property refers to which page of data of the parent collection should be within the subset and the perPage property refers to the number of models that should exist within a page of the subset collection.

After initialization, the perPage attribute can be changed by calling collection.howManyPerPage function with an integer argument. It will recalculate the data that exists in the subset based on the new paging state.

To change the currentPage attribute after initialization, call collection.goTo function with an integer page number or one of the four navigation utility functions - firstPage(), lastPage(), previousPage(), nextPage() - with no arguments. These functions all change the currentPage and recalculates the data for the subset collection based on new paging state.

If collection.goTo is called with a non numeric value or a negative number then the collection will be set to the first page. If goTo is called with a number greater than the maximum number of pages for the collection then the maximum number of pages value will be set as the currentPage.

Other utility functions within this mixin:-

collection.hasPrevious - Check if the collections current paging state has a previous page to go to. Returns boolean.
collection.hasNext - Check if the collections current paging state has a next page to go to. Returns boolean.
collection.getMaxPages - Returns the maximum number of pages based on the current parent collection data and the subset collection paging state. Returns integer.

By default when models are added or removed from the parent collection, the subset is updated to add or remove models based on paging state. If this behaviour isn't required, it can be turned off by setting the attributes, updateOnAdd and updateOnRemove, to false during the collections extension. By turning off the updating during add and/or remove, the subset will be out of sync with the parent collection until the next time the goTo function is called.

Default currentPage is 1 and default perPage is 10. 
