const urls = [
    'https://github.com/tc39/proposal-object-rest-spread',
    'https://github.com/tc39/proposal-regexp-lookbehind',
    'https://github.com/tc39/proposal-regexp-unicode-property-escapes',
    'https://github.com/tc39/proposal-promise-finally',
    'https://github.com/tc39/proposal-async-iteration'
];
async function* a() {
    for (const url of urls) {
        console.log(`Fetching: ${ url }`);
        const response = await fetch(url);
        const iterable = response.text();
        yield iterable;
    }
}
async function b() {
    for await (const i of a()) {
        const title = i.match(/<title>(.+)<\/title>/)[1];
        console.log(`Title: ${ title }`);
    }
}
b();
(async () => {
    for await (const val of asyncIterable) {
        const obj = {
            a: 1,
            b: 2
        };
        const expected = {
            ...obj,
            c: 3
        };
        console.log(val);
    }
})();
