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
        'tests/specs/models/exclude-from-json/ExcludeFromJsonSpec'
    ];
    callback = mocha.run;
}


requirejs.config({
    baseUrl: baseUrl,
    paths: {
        "jquery"            : "../test/bower_components/jquery/dist/jquery",
        "underscore"        : "../test/bower_components/underscore/underscore",
        "backbone"          : "../test/bower_components/backbone/backbone",
        "tests"             : "../test"
    },
    deps: deps,
    callback: function() {
        callback();
    }
});
