# gulp-unassert

> A [gulp](https://github.com/gulpjs/gulp) plugin for [unassert](https://github.com/unassert-js/unassert).

[![unassert][unassert-banner]][unassert-url]

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]
[![License][license-image]][license-url]


## Description

`gulp-unassert` is a [gulp](https://github.com/gulpjs/gulp) plugin for [unassert](https://github.com/unassert-js/unassert): Encourages [programming with assertions](https://en.wikipedia.org/wiki/Assertion_(software_development)) by providing tools to compile them away.


### Related modules

- [unassert](https://github.com/unassert-js/unassert): Encourages programming with assertions by providing tools to compile them away.
- [unassertify](https://github.com/unassert-js/unassertify): Browserify transform for unassert
- [babel-plugin-unassert](https://github.com/unassert-js/babel-plugin-unassert): Babel plugin for unassert
- [webpack-unassert-loader](https://github.com/unassert-js/webpack-unassert-loader): Webpack loader for unassert
- [unassert-cli](https://github.com/unassert-js/unassert-cli): CLI for unassert


## Usage

First, install `gulp-unassert` as a devDependencies:

```shell
npm install --save-dev gulp-unassert
```

Then, add it to your `gulpfile.js`:

```javascript
var unassert = require('gulp-unassert');

gulp.task('build', function () {
    gulp.src('./src/*.js')
        .pipe(unassert())
        .pipe(gulp.dest('./dist'));
});
```


## Source maps

gulp-unassert can be used with [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps) to generate source maps for the transformed javascript code. Note that you should `init` gulp-sourcemaps prior to running the gulp-unassert and `write` the source maps after. gulp-unassert works well with some gulp plugins that supports [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps).

```javascript
var unassert = require('gulp-unassert');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('build', function () {
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

For more information, see [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps).


## Changelog

See [CHANGELOG](https://github.com/unassert-js/gulp-unassert/blob/master/CHANGELOG.md)


## Author

* [Takuto Wada](https://github.com/twada)


## Our Support Policy

We support Node under maintenance. In other words, we stop supporting old Node version when [their maintenance ends](https://github.com/nodejs/LTS).

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

[depstat-url]: https://gemnasium.com/unassert-js/gulp-unassert
[depstat-image]: https://gemnasium.com/unassert-js/gulp-unassert.svg

[license-url]: https://github.com/unassert-js/gulp-unassert/blob/master/LICENSE-MIT
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat
