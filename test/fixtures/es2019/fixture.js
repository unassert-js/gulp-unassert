const assert = require('assert');

try {
    console.log('body of try statement');
    assert(true);
} catch {
    console.log('optional catch binding');
    assert(false);
} finally {
    console.log('in finalizer');
    assert(true);
}
