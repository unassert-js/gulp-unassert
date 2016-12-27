/**
 * gulp-unassert
 * 
 * https://github.com/unassert-js/gulp-unassert
 *
 * Copyright (c) 2015 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/unassert-js/gulp-unassert/blob/master/LICENSE-MIT
 */
'use strict';

var unassert = require('unassert');
var through = require('through2');
var gutil = require('gulp-util');
var BufferStreams = require('bufferstreams');
var acorn = require('acorn');
var escodegen = require('escodegen');
var applySourceMap = require('vinyl-sourcemaps-apply');
var convert = require('convert-source-map');
var transfer = require('multi-stage-sourcemap').transfer;

function mergeSourceMap(incomingSourceMap, outgoingSourceMap) {
    if (typeof outgoingSourceMap === 'string' || outgoingSourceMap instanceof String) {
        outgoingSourceMap = JSON.parse(outgoingSourceMap);
    }
    if (!incomingSourceMap) {
        return outgoingSourceMap;
    }
    return JSON.parse(transfer({fromSourceMap: outgoingSourceMap, toSourceMap: incomingSourceMap}));
}

function overwritePropertyIfExists (name, from, to) {
    if (from.hasOwnProperty(name)) {
        to.setProperty(name, from[name]);
    }
}

function applyUnassertWithSourceMap (file, encoding, opt) {
    var inMap = file.sourceMap;
    var code = file.contents.toString(encoding);

    var ast = acorn.parse(code, { sourceType: 'module', locations: true });
    var instrumented = escodegen.generate(unassert(ast), {
        file: file.relative,
        sourceMap: file.relative,
        sourceMapWithCode: true
    });
    var outMap = convert.fromJSON(instrumented.map.toString());
    overwritePropertyIfExists('sources', inMap, outMap);
    overwritePropertyIfExists('sourcesContent', inMap, outMap);
    overwritePropertyIfExists('sourceRoot', inMap, outMap);

    var reMap;
    if (inMap.mappings === '') {
        // when incoming SourceMap is an initial sourceMap created by gulp-sourcemaps
        applySourceMap(file, outMap.toJSON());
        reMap = convert.fromObject(file.sourceMap);
    } else {
        reMap = convert.fromObject(mergeSourceMap(inMap, outMap.toJSON()));
    }
    overwritePropertyIfExists('sources', inMap, reMap);
    overwritePropertyIfExists('sourcesContent', inMap, reMap);
    overwritePropertyIfExists('sourceRoot', inMap, reMap);
    overwritePropertyIfExists('file', inMap, reMap);

    file.contents = new Buffer(instrumented.code);
    file.sourceMap = reMap.toObject();
}

function applyUnassertWithoutSourceMap (code) {
    var ast = acorn.parse(code, { sourceType: 'module' });
    return escodegen.generate(unassert(ast));
}

function transform (file, encoding, opt) {
    if (file.sourceMap) {
        applyUnassertWithSourceMap(file, encoding, opt);
    } else {
        file.contents = new Buffer(applyUnassertWithoutSourceMap(file.contents.toString(encoding)));
    }
}

module.exports = function (opt) {
    return through.obj(function (file, encoding, callback) {
        encoding = encoding || 'utf8';
        if (file.isNull()) {
            this.push(file);
        } else if (file.isBuffer()) {
            try {
                transform(file, encoding, opt);
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
