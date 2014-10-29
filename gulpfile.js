var gulp = require( 'gulp' );
var mocha = require( 'gulp-mocha' );
var cover = require( 'gulp-coverage' );
var karma = require( 'karma' ).server;
var jshint = require( 'gulp-jshint' );
var jscs = require( 'gulp-jscs' );
var lintspaces = require( 'gulp-lintspaces' );
var exec = require( 'child_process' ).exec;

gulp.task('bower-install', function( cb ) {
    exec( 'bower install', function ( err, stdout, stderr ) {
        cb( err );
    });
});

gulp.task('npm-install', function( cb ) {
    exec( 'npm install', function ( err, stdout, stderr ) {
        cb( err );
    });
});

gulp.task('test-node', [ 'lint', 'codestyle', 'npm-install' ], function() {
    // Exclude views as they depend on jQuery which requires a window object which not available in node without a shim i.e. jsdom
    return gulp.src( [ 'test/specs/**/*.js' ], { read: false } )
        .pipe( cover.instrument({
            pattern: [ 'src/**/*' ],
            debugDirectory: 'coverage/node/debug'
        }) )
        .pipe( mocha() )
        .pipe( cover.report({
            outFile: 'coverage/node/coverage.html'
        }) );
});

gulp.task('test-browser', [ 'lint', 'codestyle', 'bower-install' ], function( cb ) {
    karma.start({
        configFile: __dirname + '/test/karma.conf.js',
        singleRun: true
    }, cb);
});

gulp.task('test-amd', [ 'lint', 'codestyle', 'bower-install' ], function( cb ) {
    karma.start({
        configFile: __dirname + '/test/karma.conf.amd.js',
        singleRun: true
    }, cb);
});

gulp.task('lint', [ 'npm-install' ], function() {
    return gulp.src( [ 'src/**/*.js' ] )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default' ) );
});

gulp.task('codestyle', [ 'npm-install' ], function() {
    return gulp.src( [ 'src/**/*.js' ] )
        .pipe(jscs())
        .pipe(lintspaces({
            editorconfig: '.editorconfig',
            ignores: [
                'js-comments'
            ]
        }));
});

gulp.task('default', [ 'test-node', 'test-browser', 'test-amd' ]);
