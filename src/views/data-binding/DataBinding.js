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
                return ( root.ExoSuit.Mixins.DataBindingMixin = factory( root, {}, _ ) );
            }
        );
    // Next for Node.js or CommonJS.
    } else if ( typeof exports !== 'undefined' ) {
        var _ = require( 'underscore' );

        factory( root, exports, _ );
    // Finally, as a browser global.
    } else {
        root.ExoSuit = root.ExoSuit || {};
        root.ExoSuit.Mixins = root.ExoSuit.Mixins || {};
        root.ExoSuit.Mixins.DataBindingMixin = factory( root, {}, root._ );
    }
}( this, function( root, DataBindingMixin, _ ) {
    "use strict";
    DataBindingMixin = function() {
        var oldDelegateEvents = this.delegateEvents,
            oldUndelegateEvents = this.undelegateEvents;

        this.excludeBindModelToView = this.excludeBindModelToView || false;
        this.excludeBindViewToModel = this.excludeBindViewToModel || false;

        this.delegateEvents = function( events ) {
            oldDelegateEvents.call( this, arguments );
            this._bindModelToView();
            this._bindViewToModel();
        };

        this.undelegateEvents = function( events ) {
            oldUndelegateEvents.call( this, arguments );
            this._unbindViewFromModel();
        };

        this._bindModelToView = function() {
            var i, l, selector, el, changes;

            if ( !this.model || this.excludeBindModelToView ) {
                return;
            }

            this.listenTo( this.model, "change", function() {
                changes = this.model.changedAttributes();
                for ( var change in changes ) {
                    if ( this.bindings && this.bindings[ change ] ) {
                        if ( _.isFunction( this.bindings[ change ] ) ) {
                            this.bindings[ change ].call( this, change, changes[ change ], changes );
                            // Bind mapping takes care of how the change is rendered so exit now
                            return;
                        } else if ( _.isArray( this.bindings[ change ] ) ) {
                            selector = this.$( this.bindings[ change ].join( "," ) );
                        } else {
                            selector = this.$( this.bindings[ change ] );
                        }
                    } else {
                        selector = this.$( "[data-bind='" + change + "']" );
                        if ( selector.length === 0 ) {
                            selector = this.$( "[name='" + change + "']" );
                        }
                    }

                    for ( i = 0, l = selector.length; i < l; i++ ) {
                        el = this.$( selector[ i ] );
                        if ( !this._isDirty( change, changes[ change ], el ) ) {
                            continue;
                        }
                        if ( el.is( ":checkbox" ) ) {
                            el.prop( "checked", !!changes[ change ] );
                        } else if ( el.is( ":radio" ) ) {
                            el.prop( "checked", ( el.val() === changes[ change ] ? true : false ) );
                        } else if ( el.is( ":input" ) ) {
                            el.val( changes[ change ] );
                        } else {
                            el.text( changes[ change ] );
                        }
                    }
                }
            } );
        };

        this._isDirty = function( property, value, element ) {
            var dirtyValue;
            if ( this._dirty && this._dirty[ property ] && element === this._dirty[ property ].el ) {
                dirtyValue = this._dirty[ property ].value;
                delete this._dirty[ property ];
                if ( value === dirtyValue ) {
                    return false;
                }
            }
            return true;
        };

        this._bindViewToModel = function() {
            var selectors = [ "input[data-bind]", "input[name]", "textarea[data-bind]", "textarea[name]", "select[data-bind]", "select[name]" ];

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
                }
            }, this ));
        };

        this._unbindViewFromModel = function() {
            this.$el.off( ".bindEvents" + this.cid );
        };
    };

    return DataBindingMixin;
} ));
