var baseUrl, dep, callback;

if ( window.__karma__ ) {
    var tests = [];
    for ( var file in window.__karma__.files ) {
        if ( /Spec\.js$/.test( file ) ) {
            tests.push( file );
        }
    }
    // Karma serves files from '/base'
    baseUrl = '/base/src';
    deps = tests;
    callback = window.__karma__.start;
} else {
    baseUrl = '../src';
    deps = [
        'tests/specs/collections/capped/CappedCollectionSpec',
        'tests/specs/collections/sort-on-change/SortOnChangeSpec',
        'tests/specs/collections/subset/CappedSubsetSpec',
        'tests/specs/collections/subset/FilteredSubsetSpec',
        'tests/specs/collections/subset/PaginationSubsetSpec',
        'tests/specs/models/computed-attributes/ComputedAttributesSpec',
        'tests/specs/models/exclude-from-json/ExcludeFromJsonSpec',
        'tests/specs/models/flatten/FlattenSpec',
        'tests/specs/models/transforms/TransformsSpec',
        'tests/specs/routers/analytics/GoogleSpec',
        'tests/specs/routers/filters/RouteFilterSpec',
        'tests/specs/routers/parse/ParseQueryStringSpec',
        'tests/specs/routers/route-title/RouteTitleSpec',
        'tests/specs/views/data-binding/CollectionBindingSpec',
        'tests/specs/views/data-binding/ModelBindingSpec',
        'tests/specs/views/events/ModelEventsSpec',
        'tests/specs/views/events/CollectionEventsSpec',
        'tests/specs/views/layout-manager/ViewSwitcherSpec',
        'tests/specs/views/modal/BootstrapModalSpec',
        'tests/specs/views/select-list/SelectSpec',
        'tests/specs/views/selectors/SelectorsSpec',
        'tests/specs/ExoSuitSpec'
    ];
    callback = mocha.run;
}


requirejs.config({
    baseUrl: baseUrl,
    paths: {
        "exosuit"           : ".",
        "jquery"            : "../test/bower_components/jquery/dist/jquery",
        "bootstrap"         : "../test/bower_components/bootstrap/dist/js/bootstrap",
        "underscore"        : "../test/bower_components/underscore/underscore",
        "backbone"          : "../test/bower_components/backbone/backbone",
        "sinon"             : "../test/bower_components/sinon/index",
        "tests"             : "../test"
    },
    shim: {
        "bootstrap": {
            exports: "bootstrap",
            deps: [ "jquery" ]
        },
        "sinon": {
            exports: "sinon"
        }
    },
    deps: deps,
    callback: function() {
        callback();
    }
});
