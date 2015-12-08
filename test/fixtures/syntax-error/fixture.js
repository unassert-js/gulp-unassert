'use strict';

var assert = require('assert');

function add (a, b) {
    assert.equal(typeof b, 'number');
    assert( // !isNaN(a));
    return a + b;
}
