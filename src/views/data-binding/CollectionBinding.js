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
                return ( root.ExoSuit.Mixins.CollectionBindingMixin = factory( root, {}, _ ) );
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
        root.ExoSuit.Mixins.CollectionBindingMixin = factory( root, {}, root._ );
    }
}( this, function( root, CollectionBindingMixin, _ ) {
    "use strict";
    CollectionBindingMixin = function() {
        // Cache current mixin methods to use later
        var oldDelegateEvents = this.delegateEvents,
            oldRender = this.render,
            oldRemove = this.remove;

        this.subViewOptions = this.subViewOptions || _.clone( {} );
        this.subviews = _.clone( {} );

        this.render = !this.overrideRender ? oldRender : function() {
            if ( oldRender ) {
                oldRender.apply( this, arguments );
            }
            if ( this.collection && this.modelView ) {
                this.addBulkSubViews( this.collection.models );
            }
            return this;
        };

        this.delegateEvents = function( events ) {
            oldDelegateEvents.call( this, arguments );
            this._bindCollectionToView();
            return this;
        };

        this._bindCollectionToView = function() {
            if ( !this.collection ) {
                return;
            }

            this.listenTo( this.collection, {
                "add": this._add,
                "remove": this._remove,
                "reset": this._reset,
                "sort": this._sort
            }, this );
        };

        this._add = function( model, collection, options ) {
            options = options || {};

            if ( this.modelView ) {
                this.addSubView( model, options.at );
            }
        };

        this._remove = function( model, collection, options ) {
            this.removeSubView( model.cid );
        };

        this._reset = function( collection, options ) {
            this.removeAllSubViews();
            if ( this.modelView ) {
                this.addBulkSubViews( collection.models );
            }
        };

        this._sort = function( collection, options ) {
            var view = this,
                el = this.$el,
                parentEl = this.$el.parent(),
                nextEl = this.$el.next();

            el.detach();
            collection.forEach( function( model ) {
                view.getSubView( model.cid ).$el.detach().appendTo( el );
            } );

            if ( nextEl.length > 0 ) {
                el.insertBefore( nextEl );
            } else {
                el.appendTo( parentEl );
            }
        };

        this.addBulkSubViews = function( models ) {
            for ( var i = 0, len = models.length; i < len; i++ ) {
                this.addSubView( models[ i ] );
            }
        };

        this.addSubView = function( model, index ) {
            var subview,
                view = this.subviews[ model.cid ] = this.createSubView( model );

            view.render();

            if ( typeof index !== "undefined" ) {
                if ( index === 0 && this.collection.indexOf( model ) === 0 ) {
                    this.$el.prepend( view.$el );
                } else {
                    index = index === 0 ? 0 : index - 1;
                    subview = this.getSubView( this.collection.at( index ).cid );
                    subview.$el.after( view.$el );
                }
            } else {
                this.$el.append( view.$el );
            }
        };

        this.createSubView = function( model ) {
            return ( new this.modelView(
                _.defaults(
                    {
                        model   : model
                    },
                    this.subViewOptions
                )
            ) );
        };

        this.removeSubView = function( modelCid ) {
            var view = this.getSubView( modelCid );
            if ( view ) {
                view.remove();
                delete this.subviews[ modelCid ];
            }
        };

        this.removeAllSubViews = function() {
            for ( var viewId in this.subviews ) {
                this.removeSubView( viewId );
            }
        };

        this.getSubView = function( modelCid ) {
            return this.subviews[ modelCid ];
        };

        this.remove = function() {
            this.removeAllSubViews();

            return oldRemove.apply( this, arguments );
        };
    };

    return CollectionBindingMixin;
} ));
