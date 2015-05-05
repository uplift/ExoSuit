# Data Binding Mixin

# Collection Binding

**Browser Mixin Name: ExoSuit.Mixins.CollectionBindingMixin**

**Dependencies:** Underscore.

The collection binding mixin allows a view to manage subviews based on the collection attached to the view. The view will listen to the collection events and update the subviews based on the collection data changes.

To display the subviews, a modelView needs to be set on the view. This is a Backbone view definition that is used to display the model data within the collection.

If overrideRender is not set to true or is unset, then when render is called on the view, the collection data will be populated in the view like it would be on a collection add event. This creates a quick way to update the view with the initial collection data.

# Model Binding

**Browser Mixin Name: ExoSuit.Mixins.ModelBindingMixin**

**Dependencies:** Underscore.

Configurable two way data binding with the model attached to the view. By default any updates to the model will be reflected on the view and updates made to the view will be reflected in the model. If one of these is not required for your view then set the following two properties to true when extending a view module.

* excludeBindModelToView
* excludeBindViewToModel

## Model to View Binding

When data in the model changes and fires a 'change' event, then the view will be updated by determining the what element is being updated.  By default an element is linked to a model property either by the name attribute of the element or the data-bind attribute of an element being equal to the model property name.

If defining model property to element relationship doesn't work for your needs, a bindings object can be added to the view with the key being the model property and the value being the element selector (any jQuery selector can be used here or an array of selectors).

If overrideRender is not set to true or is unset, then when render is called on the view, the model data will be populated in the view like it would be on a change event. This creates a quick way to update the view with the initial model data.

## View to Model Binding

Elements in the view have a delegated change event that listens to changes on any element with a data-bind or name attribute. If you don't wish to have a field with a name or data-bind attribute update the model when it changes then set the selector for those elements within a bindExcludes array.
