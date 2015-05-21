( function( root, factory ) {
    "use strict";
    // Set up appropriately for the environment.
    // Start with AMD.
    if ( typeof define === 'function' && define.amd ) {
        define(
            [
                'underscore'
            ],
            function( _ ) {
                root.ExoSuit = root.ExoSuit || {};
                root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
                return ( root.ExoSuit.Mixins.ModelBindingMixin = factory( root, {}, _ ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var _ = require( 'underscore' );

        module.exports = factory( root, exports, _ );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.ModelBindingMixin = factory( root, {}, root._ );
    }
}( this, function( root, ModelBindingMixin, _ ) {
    "use strict";
    ModelBindingMixin = function() {
        var oldRender = this.render,
            oldDelegateEvents = this.delegateEvents,
            oldUndelegateEvents = this.undelegateEvents;

        this.excludeBindModelToView = this.excludeBindModelToView || false;
        this.excludeBindViewToModel = this.excludeBindViewToModel || false;

        this.render = !this.overrideRender ? oldRender : function() {
            if ( oldRender ) {
                oldRender.apply( this, arguments );
            }
            if ( this.model ) {
                this.onDataChange( this.model.toJSON() );
            }
            return this;
        };

        this.delegateEvents = function( events ) {
            oldDelegateEvents.call( this, arguments );
            this._bindModelToView();
            this._bindViewToModel();
            return this;
        };

        this.undelegateEvents = function( events ) {
            oldUndelegateEvents.call( this, arguments );
            this._unbindViewFromModel();
            return this;
        };

        this._bindModelToView = function() {
            if ( !this.model || this.excludeBindModelToView ) {
                return;
            }

            this.listenTo( this.model, "change", function() {
                this.onDataChange( this.model.changedAttributes() );
            } );
        };

        this.getBindingSelector = function( change ) {
            var selector;

            if ( this.bindings && this.bindings[ change ] ) {
                if ( typeof this.bindings[ change ] === 'object' && !_.isArray( this.bindings[ change ] ) ) {
                    selector = this.bindings[ change ].bindTo;
                } else {
                    selector = this.bindings[ change ];
                }

                if ( _.isArray( selector ) ) {
                    selector = selector.join( "," );
                }
            }

            if ( !selector ) {
                selector = "[data-bind='" + change + "'], [name='" + change + "']";
            }

            return selector;
        };

        this._getBindingOptions = function( change, element ) {
            var options = {};

            if ( this.bindings && typeof this.bindings[ change ] === 'object' && !_.isArray( this.bindings[ change ] ) ) {
                options = this.bindings[ change ];
            }

            if ( options && options.overrides ) {
                for ( var override in options.overrides ) {
                    if ( element.is( override ) ) {
                        options = _.extend( options, options.overrides[ override ] );
                    }
                }
            }

            return options;
        };

        this.onDataChange = function( changes ) {
            var i, l, selector, el, value, options, optionsArray;

            for ( var change in changes ) {
                selector = this.getBindingSelector( change );
                value = changes[ change ];
                if ( _.isFunction( selector ) ) {
                    selector.call( this, change, value, changes );
                    // Bind mapping takes care of how the change is rendered so exit now
                    return;
                } else {
                    selector = this.$( selector );
                }

                for ( i = 0, l = selector.length; i < l; i++ ) {
                    el = this.$( selector[ i ] );
                    if ( !this._isDirty( change, value, el ) ) {
                        continue;
                    }
                    this.setViewData( el, value, change );
                }
            }
        };

        this._isDirty = function( property, value, element ) {
            var dirtyValue;
            if ( this._dirty && this._dirty[ property ] && element === this._dirty[ property ].el ) {
                dirtyValue = this._dirty[ property ].value;
                if ( value === dirtyValue ) {
                    return false;
                }
            }
            return true;
        };

        this.setViewData = function( el, value, change ) {
            var options = this._getBindingOptions( change, el );

            // Convert model value to view value
            value = options.convert ? options.convert.call( this, value ) : value;

            if ( el.is( ":checkbox" ) ) {
                el.prop( "checked", !!value );
            } else if ( el.is( ":radio" ) ) {
                el.prop( "checked", ( el.val() === value ? true : false ) );
            } else if ( el.is( ":input" ) ) {
                el.val( value );
            } else if ( options.html === true ) {
                el.html( value );
            } else {
                el.text( value );
            }
        };

        this._bindViewToModel = function() {
            var selectors = [ "input[data-bind]", "input[name]", "textarea[data-bind]", "textarea[name]", "select[data-bind]", "select[name]" ],
                selector;

            if ( !this.model || this.excludeBindViewToModel ) {
                return;
            }

            this._dirty = {};

            if ( this.bindExcludes ) {
                for ( var i = 0, len = selectors.length; i < len; i++ ) {
                    selectors[ i ] += ":not(" + this.bindExcludes.join( "," ) + ")";
                }
            }

            this._unbindViewFromModel();
            this.$el.on( "change.bindEvents"  + this.cid, selectors.join( "," ), _.bind( function( event ) {
                var element = this.$( event.currentTarget ),
                    prop = element.data( "bind" ) || element.attr( "name" ),
                    value;

                if ( prop ) {
                    value = element.is( ":checkbox" ) ? element.is( ":checked" ) : element.val();

                    this._dirty[ prop ] = {
                        el: element,
                        value: value
                    };

                    this.model.set( prop, value );
                    delete this._dirty[ prop ];
                    // Reset form element to model value if value has changed between view and being set in model e.g. a schema conversion
                    if ( value !== this.model.get( prop ) ) {
                        this.setViewData( element, this.model.get( prop ), prop );
                    }
                }
            }, this ));
        };

        this._unbindViewFromModel = function() {
            if ( this.$el ) {
                this.$el.off( ".bindEvents" + this.cid );
            }
        };
    };

    return ModelBindingMixin;
} ));
