const assert = require('assert');

const foo = (obj) => {
    assert(obj.aaa?.bbb()?.ccc() === '9007199254740991n');
    return obj;
};
