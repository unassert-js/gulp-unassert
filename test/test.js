/*global describe, it*/
'use strict';

delete require.cache[require.resolve('../')];
var fs = require('fs');
var es = require('event-stream');
var assert = require('power-assert');
var gutil = require('gulp-util');
var unassert = require('../');

describe('gulp-unassert', function () {
    
    it('should produce expected file via buffer', function (done) {
        var stream = unassert();
        var srcFile = new gutil.File({
            path: process.cwd() + "/test/fixtures/patterns/fixture.js",
            cwd: process.cwd(),
            base: process.cwd() + "/test/fixtures/patterns",
            contents: fs.readFileSync('test/fixtures/patterns/fixture.js')
        });
        var expectedFile = new gutil.File({
            path: process.cwd() + '/test/fixtures/patterns/expected.js',
            cwd: process.cwd(),
            base: process.cwd() + '/test/fixtures/patterns',
            contents: fs.readFileSync('test/fixtures/patterns/expected.js')
        });
        stream.on('error', function(err) {
            assert(err);
            done(err);
        });
        stream.on('data', function (newFile) {
            assert(newFile);
            assert(newFile.contents);
            assert.equal(String(newFile.contents), String(expectedFile.contents));
            done();
        });
        stream.write(srcFile);
        stream.end();
    });

    it('should produce expected file via stream', function (done) {
        var stream = unassert();
        var srcStream = new gutil.File({
            path: process.cwd() + "/test/fixtures/patterns/fixture.js",
            cwd: process.cwd(),
            base: process.cwd() + "/test/fixtures/patterns",
            contents: fs.createReadStream('test/fixtures/patterns/fixture.js')
        });
        var expectedFile = new gutil.File({
            path: process.cwd() + '/test/fixtures/patterns/expected.js',
            cwd: process.cwd(),
            base: process.cwd() + '/test/fixtures/patterns',
            contents: fs.readFileSync('test/fixtures/patterns/expected.js')
        });
        stream.on('error', function(err) {
            assert(err);
            done();
        });
        stream.on('data', function (newFile) {
            assert(newFile);
            assert(newFile.contents);
            newFile.contents.pipe(es.wait(function(err, data) {
                assert(!err);
                assert.equal(data.toString('utf-8'), String(expectedFile.contents));
                done();
            }));
        });
        stream.write(srcStream);
        stream.end();
    });

    describe('should not throw but emit error when the file has a syntax error', function () {
        it('when file is Buffer', function (done) {
            var stream = unassert();
            var srcFile = new gutil.File({
                path: process.cwd() + "/test/fixtures/syntax-error/fixture.js",
                cwd: process.cwd(),
                base: process.cwd() + "/test/fixtures/syntax-error",
                contents: fs.readFileSync("test/fixtures/syntax-error/fixture.js")
            });
            assert.doesNotThrow(function() {
                stream.on("error", function(err) {
                    assert(err);
                    done();
                });
                stream.write(srcFile);
                stream.end();
            });
        });
        it('when file is Stream', function (done) {
            var stream = unassert();
            var srcStream = new gutil.File({
                path: process.cwd() + "/test/fixtures/syntax-error/fixture.js",
                cwd: process.cwd(),
                base: process.cwd() + "/test/fixtures/syntax-error",
                contents: fs.createReadStream("test/fixtures/syntax-error/fixture.js")
            });
            assert.doesNotThrow(function() {
                stream.on("error", function(err) {
                    assert(err);
                    done();
                });
                stream.write(srcStream);
                stream.end();
            });
        });
    });
});
