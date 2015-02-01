var ExoSuit = {
    "Mixins": {
        "CappedCollectionMixin": require( './src/collections/capped/CappedCollection' ),
        "ClientPaginationMixin": require( './src/collections/pagination/ClientPagination' ),
        "SortOnChangeMixin": require( './src/collections/sort-on-change/SortOnChange' ),
        "CappedSubsetMixin": require( './src/collections/subset/CappedSubset' ),
        "FilteredSubsetMixin": require( './src/collections/subset/FilteredSubset' ),
        "PaginationSubsetMixin": require( './src/collections/subset/PaginationSubset' ),
        "ExcludeFromJSONMixin": require( './src/models/exclude-from-json/ExcludeFromJson' ),
        "GoogleAnalyticsRouteMixin": require( './src/routers/analytics/Google' ),
        "ParseQueryStringMixin": require( './src/routers/parse/ParseQueryString' ),
        "RouteTitleMixin": require( './src/routers/route-title/RouteTitle' ),
        "ModelBindingMixin": require( './src/views/data-binding/ModelBinding' ),
        "SelectListMixin": require( './src/views/select-list/Select' ),
        "SelectorMixin": require( './src/views/selectors/Selectors' )
    }
};

module.exports = ExoSuit;
