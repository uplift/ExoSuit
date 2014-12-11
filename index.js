var ExoSuit = {
    "Mixins": {
        "CappedCollectionMixin": require( './src/collections/capped/CappedCollection' ),
        "ClientPaginationMixin": require( './src/collections/pagination/ClientPagination' ),
        "SortOnChangeMixin": require( './src/collections/sort-on-change/SortOnChange' ),
        "ExcludeFromJSONMixin": require( './src/models/exclude-from-json/ExcludeFromJson' ),
        "GoogleAnalyticsRouteMixin": require( './src/routers/analytics/Google' ),
        "ParseQueryStringMixin": require( './src/routers/parse/ParseQueryString' ),
        "RouteTitleMixin": require( './src/routers/route-title/RouteTitle' ),
        "ModelBindingMixin": require( './src/views/data-binding/ModelBinding' ),
        "SelectorMixin": require( './src/views/selectors/Selectors' )
    }
};

module.exports = ExoSuit;
