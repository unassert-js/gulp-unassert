/**
 * gulp-derequire
 * 
 * https://github.com/twada/gulp-unassert
 *
 * Copyright (c) 2015 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/twada/gulp-unassert/blob/master/LICENSE-MIT
 */
'use strict';

var unassert = require('unassert');
var through = require('through2');
var gutil = require('gulp-util');
var BufferStreams = require('bufferstreams');
var esprima = require('esprima');
var escodegen = require('escodegen');

function applyUnassertWithoutSourceMap (code) {
    var ast = esprima.parse(code, { sourceType: 'module' });
    return escodegen.generate(unassert(ast));
}

function transform (file, encoding, opt) {
    var inMap = file.sourceMap;
    var code = file.contents.toString(encoding);
    if (!inMap) {
        return new Buffer(applyUnassertWithoutSourceMap(code));
    } else {
        throw new Error('SourceMap is not supported yet');
    }
}

module.exports = function (opt) {
    return through.obj(function (file, encoding, callback) {
        encoding = encoding || 'utf8';
        if (file.isNull()) {
            this.push(file);
        } else if (file.isBuffer()) {
            try {
                file.contents = transform(file, encoding, opt);
                this.push(file);
            } catch (err) {
                return callback(new gutil.PluginError('gulp-unassert', err, {showStack: true}));
            }
        } else if (file.isStream()) {
            file.contents = file.contents.pipe(new BufferStreams(function(err, buf, cb) {
                if(err) {
                    cb(new gutil.PluginError('gulp-unassert', err, {showStack: true}));
                } else {
                    try {
                        var modifiedCode = applyUnassertWithoutSourceMap(buf.toString(encoding));
                        cb(null, new Buffer(modifiedCode));
                    } catch (innerError) {
                        return callback(new gutil.PluginError('gulp-unassert', innerError, {showStack: true}));
                    }
                }
            }));
            this.push(file);
        }
        callback();
    });
};
