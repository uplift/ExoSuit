# Bootstrap Modal View Mixin

**Browser Mixin Name: ExoSuit.Mixins.BootstrapModalMixin**

**Dependencies:** Underscore and Bootstrap.

Convert a view to a Bootstrap Modal window. Provides shortcuts via the View interface to the bootstrap plugin functions.

Provide the template of the modal view in your render function. During the view initialization, the top node element of the view (i.e. view.$el) will be initialized with the bootstrap modal. 

Configure any bootstrap options during extension of the view or the options argument of the initialization of the view with the keyword bootstrapOptions.

By default the modal won't be show when initialized. To make the modal show when the view is initialized, pass autoShow in the options argument when initializing.

The modal window can be controlled by using the below functions on the view interface.

    **open()** - Shows the modal window
    **close()** - Hides the modal window
    **toggle()** - Toggles the modal window

**Examples**

    var MyView = ExoSuit.View.extend({
        mixins: [ ExoSuit.Mixins.BootstrapModalMixin ],
        bootstrapOptions: {
            backdrop: true
        }
    }); 
    
    var view = new MyView({
        bootstrapOptions: {
            keyboard: false
        }
    });
    view.open();
    // Modal shown
    view.close();
    // Modal hidden
    view.toggle();
    // Modal shown
    view.toggle();
    // Modal hidden
