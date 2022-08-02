'use strict';

const assert = require('assert');

async function add (a, b) {
  await assert.rejects(Promise.reject(new Error(`error: ${a}`)));
  await assert.doesNotReject(Promise.resolve(b));
  return a + b;
}
