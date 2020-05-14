# gulp-unassert

> A [gulp](https://github.com/gulpjs/gulp) plugin for [unassert](https://github.com/unassert-js/unassert).

[![unassert][unassert-banner]][unassert-url]

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Code Style][style-image]][style-url]
[![License][license-image]][license-url]


## Description

`gulp-unassert` is a [gulp](https://github.com/gulpjs/gulp) plugin for [unassert](https://github.com/unassert-js/unassert): Encourages [programming with assertions](https://en.wikipedia.org/wiki/Assertion_(software_development)) by providing tools to compile them away.


### Related modules

- [unassert](https://github.com/unassert-js/unassert): Encourages programming with assertions by providing tools to compile them away.
- [unassertify](https://github.com/unassert-js/unassertify): Browserify transform for unassert
- [babel-plugin-unassert](https://github.com/unassert-js/babel-plugin-unassert): Babel plugin for unassert
- [webpack-unassert-loader](https://github.com/unassert-js/webpack-unassert-loader): Webpack loader for unassert
- [unassert-cli](https://github.com/unassert-js/unassert-cli): CLI for unassert


## Install

```shell
npm install --save-dev gulp-unassert
```

## Usage

### gulp 3.x

```javascript
const unassert = require('gulp-unassert');

gulp.task('build', () => {
  gulp.src('./src/*.js')
    .pipe(unassert())
    .pipe(gulp.dest('./dist'));
});
```

### gulp 4.x

```javascript
const { src, dest } = require('gulp');
const unassert = require('gulp-unassert');

function build() {
  return src('./src/*.js')
    .pipe(unassert())
    .pipe(dest('./dist'));
}
exports.build = build;
```


## Source maps

### gulp 3.x

gulp-unassert can be used with [gulp-sourcemaps](https://github.com/gulp-sourcemaps/gulp-sourcemaps) to generate source maps for the transformed javascript code. Note that you should `init` gulp-sourcemaps prior to running the gulp-unassert and `write` the source maps after. gulp-unassert works well with some gulp plugins that supports [gulp-sourcemaps](https://github.com/gulp-sourcemaps/gulp-sourcemaps).

```javascript
const unassert = require('gulp-unassert');
const coffee = require('gulp-coffee');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('build', () => {
  // compile, instrument then concatinate
  gulp.src('./src/**/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee({bare: true}))
    .pipe(unassert())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'));
  // will write the source maps inline in the code
});
```

For more information, see [gulp-sourcemaps](https://github.com/gulp-sourcemaps/gulp-sourcemaps).


### gulp 4.x

In gulp 4, sourcemaps are built-in by default.

```javascript
const { src, dest } = require('gulp');
const unassert = require('gulp-unassert');
const coffee = require('gulp-coffee');
const concat = require('gulp-concat');

function build() {
  return src('./src/*.coffee', { sourcemaps: true })
    .pipe(coffee({ bare: true }))
    .pipe(unassert())
    .pipe(concat('bundle.js'))
    .pipe(dest('./build'));
}
exports.build = build;
```


## Changelog

See [CHANGELOG](https://github.com/unassert-js/gulp-unassert/blob/master/CHANGELOG.md)


## Author

* [Takuto Wada](https://github.com/twada)


## Our Support Policy

We support Node under maintenance. In other words, we stop supporting old Node version when [their maintenance ends](https://github.com/nodejs/Release).

This means that any other environment is not supported.

NOTE: If gulp-unassert works in any of the unsupported environments, it is purely coincidental and has no bearing on future compatibility. Use at your own risk.


## License

Licensed under the [MIT](https://github.com/unassert-js/gulp-unassert/blob/master/LICENSE-MIT) license.


[unassert-url]: https://github.com/unassert-js/unassert
[unassert-banner]: https://raw.githubusercontent.com/unassert-js/unassert-js-logo/master/banner/banner-official-fullcolor.png

[npm-url]: https://npmjs.org/package/gulp-unassert
[npm-image]: https://badge.fury.io/js/gulp-unassert.svg

[travis-url]: https://travis-ci.org/unassert-js/gulp-unassert
[travis-image]: https://secure.travis-ci.org/unassert-js/gulp-unassert.svg?branch=master

[license-url]: https://github.com/unassert-js/gulp-unassert/blob/master/LICENSE-MIT
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat

[style-url]: https://github.com/Flet/semistandard
[style-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg
