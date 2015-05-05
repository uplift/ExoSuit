# ExoSuit

By including the ExoSuit.js script in your application, it adds the following modules to your application. They are almost identical to their Backbone counterparts but the extend function is overridden with the ability to auto mixin behaviour defined within the mixins array.

* ExoSuit.Model
* ExoSuit.Collection
* ExoSuit.View
* ExoSuit.Router

It also adds ExoSuit.MixinExtend which is the new extension function overridden in the above modules, so it can be used elsewhere in other modules if needed.
