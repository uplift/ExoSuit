var ExoSuit = {
    "Mixins": {
        "CappedCollectionMixin": require( './src/collections/capped/CappedCollection' ),
        "ClientPaginationMixin": require( './src/collections/pagination/ClientPagination' ),
        "ExcludeFromJSONMixin": require( './src/models/exclude-from-json/ExcludeFromJson' ),
        "GoogleAnalyticsRouteMixin": require( './src/routers/analytics/Google' ),
        "ParseQueryStringMixin": require( './src/routers/parse/ParseQueryString' ),
        "RouteTitleMixin": require( './src/routers/route-title/RouteTitle' ),
        "DataBindingMixin": require( './src/views/data-binding/DataBinding' ),
        "SelectorMixin": require( './src/views/selectors/Selectors' )
    }
};

module.exports = ExoSuit;
