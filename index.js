var ExoSuit = {
    "Mixins": {
        "CappedCollectionMixin": require( './src/collections/capped/CappedCollection' ),
        "ClientPaginationMixin": require( './src/collections/pagination/ClientPagination' ),
        "SortOnChangeMixin": require( './src/collections/sort-on-change/SortOnChange' ),
        "CappedSubsetMixin": require( './src/collections/subset/CappedSubset' ),
        "FilteredSubsetMixin": require( './src/collections/subset/FilteredSubset' ),
        "PaginationSubsetMixin": require( './src/collections/subset/PaginationSubset' ),
        "ComputedAttributesMixin": require( './src/models/computed-attributes/ComputedAttributes' ),
        "ExcludeFromJSONMixin": require( './src/models/exclude-from-json/ExcludeFromJson' ),
        "FlattenMixin": require( './src/models/flatten/Flatten' ),
        "TransformMixin": require( './src/models/transforms/Transforms' ),
        "GoogleAnalyticsRouteMixin": require( './src/routers/analytics/Google' ),
        "ParseQueryStringMixin": require( './src/routers/parse/ParseQueryString' ),
        "RouteTitleMixin": require( './src/routers/route-title/RouteTitle' ),
        "CollectionBindingMixin": require( './src/views/data-binding/CollectionBinding' ),
        "ModelBindingMixin": require( './src/views/data-binding/ModelBinding' ),
        "ModelEventsMixin": require( './src/views/events/ModelEvents' ),
        "CollectionEventsMixin": require( './src/views/events/CollectionEvents' ),
        "ViewSwitcherMixin": require( './src/views/layout-manager/ViewSwitcher' ),
        "SelectListMixin": require( './src/views/select-list/Select' ),
        "SelectorMixin": require( './src/views/selectors/Selectors' )
    }
};

module.exports = ExoSuit;
