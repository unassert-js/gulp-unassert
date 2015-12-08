# gulp-unassert

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]
[![License][license-image]][license-url]

> A [gulp](https://github.com/gulpjs/gulp) plugin for [unassert](https://github.com/twada/unassert).


## Description

`gulp-unassert` is a gulp plugin to encourage reliable programming by writing assertions in production, and compiling them away from release.


### Related modules

- [unassert](https://github.com/twada/unassert): Remove assertions from AST
- [unassertify](https://github.com/twada/unassertify): Browserify transform to remove assertions on build
- [babel-plugin-unassert](https://github.com/twada/babel-plugin-unassert): Babel plugin to remove assertions on build
- [webpack-unassert-loader](https://github.com/zoncoen/webpack-unassert-loader): A webpack loader to remove assertions on production build


## Usage

First, install `gulp-unassert` as a devDependencies:

```shell
npm install --save-dev gulp-unassert
```

Then, add it to your `gulpfile.js`:

```javascript
var unassert = require('gulp-unassert');

gulp.src('./src/*.js')
    .pipe(unassert())
    .pipe(gulp.dest('./dist'));
```


## Changelog

See [CHANGELOG](https://github.com/twada/gulp-unassert/blob/master/CHANGELOG.md)


## Author

* [Takuto Wada](http://github.com/twada)


## License

Licensed under the [MIT](https://github.com/twada/gulp-unassert/blob/master/LICENSE-MIT) license.

[npm-url]: https://npmjs.org/package/gulp-unassert
[npm-image]: https://badge.fury.io/js/gulp-unassert.svg

[travis-url]: http://travis-ci.org/twada/gulp-unassert
[travis-image]: https://secure.travis-ci.org/twada/gulp-unassert.svg?branch=master

[depstat-url]: https://gemnasium.com/twada/gulp-unassert
[depstat-image]: https://gemnasium.com/twada/gulp-unassert.svg

[license-url]: https://github.com/twada/gulp-unassert/blob/master/LICENSE-MIT
[license-image]: http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat
