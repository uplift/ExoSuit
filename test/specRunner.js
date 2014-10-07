var callback;

if ( window.__karma__ ) {
    callback = window.__karma__.start;
} else {
    callback = mocha.run;
}

callback();
