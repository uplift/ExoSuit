# ExoSuit

[![Bower version](https://badge.fury.io/bo/exosuit.svg)](http://badge.fury.io/bo/bullhorn-handlebars-helpers)
[![NPM version](https://badge.fury.io/js/exosuit.svg)](http://badge.fury.io/js/bullhorn-handlebars-helpers)
[![Dependency Status](https://david-dm.org/uplift/ExoSuit.svg)](https://david-dm.org/uplift/ExoSuit)
[![devDependency Status](https://david-dm.org/uplift/ExoSuit/dev-status.svg)](https://david-dm.org/uplift/ExoSuit#info=devDependencies)
[![Build Status](https://travis-ci.org/uplift/ExoSuit.svg)](https://travis-ci.org/uplift/ExoSuit)

A collection of mixins to be used to augment backbone.js applications.

Compose the bits of functionality you need and create your own base modules to extend from for your applications need.

## Install

### Bower

    bower install exosuit@0.3.0

### NPM

    npm install exosuit@0.3.0

## Usage

### Node

In Node.js environment, require the mixin as a standard module.

    var ExcludeFromJSONMixin = require( 'exosuit/src/models/ExcludeFromJSON' );

Alternatively you can include all mixins at once by requiring the exosuit object. This will give you an object with all the mixins on it.

    var ExoSuit = require( 'exosuit' );
    // Can now use ExoSuit.Mixins.ExcludeFromJSONMixin 

### Browser

In a browser environment, just include the script to the mixin as a script tag after the inclusion of the Backbone (and dependencies) script tag(s). (Some mixins require other libraries to be included before the helpers inclusion)
    
    <script src="bower_components/backbone/backbone.js"></script>
    <script src="bower_components/exosuit/src/model/ExcludeFromJSON.js"></script>

The mixin will be registered on the ExoSuit global object via ExoSuit.Mixins.MIXINNAME.  The above script tag would be accessible from ExoSuit.Mixins.ExcludeFromJSONMixin.

### AMD

In an AMD environment, load the mixin as you would any other AMD module. You'll need to configure paths for 'underscore', 'backbone' and 'exosuit' in your requirejs config as some of the mixins load these dependencies in their definition by those path names. The mixin is also attached to the global ExoSuit object the same as the standard browser environment.

    requirejs.config({
        paths: {
            "underscore": "path/to/underscore"
            "backbone": "path/to/backbone"
            "exosuit": "path/to/exosuit"
        }
    });

    // My Module
    define( [ 'bower_components/exosuit/src/models/ExcludeFromJSON' ], function( ExcludeFromJSON ) {
        // Do something
    });

## ExoSuit Modules

ExoSuit extends all the Backbone modules and creates ExoSuit version which are exactly the same except the extend method is overridden to include the ability to define mixins on the module and have them automatically mixed in to the module prototype.

### Module Mixin Extend

Define mixins for a module as an array on the module definition when extending a module

Example:

    var myModel = ExoSuit.Model.extend({
        mixins: [ ExoSuit.Mixins.ExcludeFromJSONMixin ]
    });

The order of the mixins within the array matters. The mixins are mixed on a first to last order.

## ExoSuit Mixins

Detailed description on each mixin can be found in their corresponding directory README under the **src** directory.

### Collection

#### Capped Collection

Cap the number of model that are in the collection at any one time.

#### Sort on Model Change Collection

When a model within the collection changes, resort the collection.

#### Capped Subset Collection

Creates a subset of another collection with a capped amount of data.

#### Filtered Subset Collection

Creates a subset of another collection based on a filter function to determine what data should be included within the subset.

#### Pagination Subset Collection

Creates a subset of another collection based on the paging state to determine which datat should be included within the subset.

### Model

#### Computed Attributes

Set attributes that depend on other data/attributes within the model. Changes to dependent attributes updates the computed attribute and changes to computed attribute will update dependent attributes.

#### Exclude from JSON

Exclude certain attributes from being included in the model toJSON() call.

#### Flatten

Flatten a models nested attributes to a single level to make it easier to work with the data.

#### Transforms

Transform model data to certain types when they are received and sent to the server.

### Router

#### Google Analytics

Fire a Google tracking page event when a new route is fired.

#### Parse Querystring

Parse querystring data into an object and pass to the route callback.

#### Route Title

Set the browser title based on the route called. 

### Views

#### Collection Data Binding

Bind collection events to a view.

Add event - Adds model view to collection view.
Remove event - Remove model view from collection view.
Reset event - Remove all previous model views and add any new model views.
Sort event - Detach model views and reorder into new order within the collection view.

#### Model Data Binding

Bind model events to view.  Listens for changes to the model data and updates the view accordingly.

#### Collection Events

List callbacks for collection events in a hash object on the view. Similar to how DOM events are defined.

#### Model Events

List callbacks for model events in a hash object on the view. Similar to how DOM events are defined.

#### View Switcher

An easy way to switch out views within the same area of the DOM.

#### Select List

Produce a select HTML element based on the collection attached to the view.

#### Selector Caching

Define a hash object of selectors used within the view and retrieve cached selector based on a key.

# License

Licensed under the [MIT](http://www.opensource.org/licenses/MIT) license.
