# gulp-unassert

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]
[![License][license-image]][license-url]

> A [gulp](https://github.com/gulpjs/gulp) plugin for [unassert](https://github.com/unassert-js/unassert).


## Description

`gulp-unassert` is a gulp plugin to encourage reliable programming by writing assertions in production, and compiling them away from release.


### Related modules

- [unassert](https://github.com/unassert-js/unassert): Encourage reliable programming by writing assertions in production code, and compiling them away from release.
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


## License

Licensed under the [MIT](https://github.com/unassert-js/gulp-unassert/blob/master/LICENSE-MIT) license.

[npm-url]: https://npmjs.org/package/gulp-unassert
[npm-image]: https://badge.fury.io/js/gulp-unassert.svg

[travis-url]: https://travis-ci.org/unassert-js/gulp-unassert
[travis-image]: https://secure.travis-ci.org/unassert-js/gulp-unassert.svg?branch=master

[depstat-url]: https://gemnasium.com/unassert-js/gulp-unassert
[depstat-image]: https://gemnasium.com/unassert-js/gulp-unassert.svg

[license-url]: https://github.com/unassert-js/gulp-unassert/blob/master/LICENSE-MIT
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat
