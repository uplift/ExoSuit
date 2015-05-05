# View Select List Mixin

**Browser Mixin Name: ExoSuit.Mixins.SelectListMixin**

Create a Select dropdown list out of a collection attached to the view.

During extension of the view or during initialization of the view through the options argument, you can set the below options to customize the select dropdown list:-

    **labelKey** - This is the key of the model in the collection to use to determine what to show for the label of the select option. **Defaults to 'label'**
    **valueKey** - This is the key of the model in the collection to use to determine the value of the select option. **Defaults to 'value'**
    **addInitialOption** - Boolean to determine whether to show an initial value before the collection select options. **Defaults to false**
    **initialOptionLabel** - This is the label to show for the initial option if addInitialOption is set to true. Ignored if false. **Defaults to 'Please Select'**
    **initialOptionValue** - This is the value for the initial option if addInitialOption is set to true. Ignored if false. **Defaults to '0'**

During the initialization of the view, you can also add the following as part of the options argument:-

    **selectedIndex** - This is the index of the model within the collection you wish to be automatically selected from the options list. If you want the initial option to be selected do not set this property.

Rendering a view with this mixin will return the HTML for the select dropdown list which you can use in a parent view to place into the DOM.

**Examples**

    var MyView = ExoSuit.View.extend({
        mixins: [ ExoSuit.Mixins.SelectListMixin ],
        addInitialOption: true
    }); 

    var collection = new Backbone.Collection(
        [
            {
                label: "One",
                value: "1"
            },
            {
                label: "Two",
                value: "2"
            },
            {
                label: "Three",
                value: "3"
            }
        ]
    );
    var myView = new MyView({
        collection: collection
        selectedIndex: 1
    });

    var ParentView = Backbone.View.extend({
        render: function(){
            this.$el.html( myView.render() );
        }
    });
    var parentView = new ParentView();
    parentView.render();
    // <select><option value='0'>Please Select</option><option value='1'>One</option><option value='2'>Two</option><option value='3'>Three</option></select>
