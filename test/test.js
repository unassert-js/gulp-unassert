/*global describe, it*/
'use strict';

delete require.cache[require.resolve('../')];
var fs = require('fs');
var es = require('event-stream');
var assert = require('power-assert');
var Vinyl = require('vinyl');
var unassert = require('../');

describe('gulp-unassert', function () {

    it('ES2018 syntax', function (done) {
        var stream = unassert();
        var srcStream = new Vinyl({
            path: process.cwd() + "/test/fixtures/es2018/fixture.js",
            cwd: process.cwd(),
            base: process.cwd() + "/test/fixtures/es2018",
            contents: fs.createReadStream('test/fixtures/es2018/fixture.js')
        });
        var expectedFile = new Vinyl({
            path: process.cwd() + '/test/fixtures/es2018/expected.js',
            cwd: process.cwd(),
            base: process.cwd() + '/test/fixtures/es2018',
            contents: fs.readFileSync('test/fixtures/es2018/expected.js')
        });
        stream.on('error', function(err) {
            assert(!err.message);
            done();
        });
        stream.on('data', function (newFile) {
            assert(newFile);
            assert(newFile.contents);
            newFile.contents.pipe(es.wait(function(err, data) {
                assert(!err);
                assert.equal(data.toString('utf-8') + '\n', String(expectedFile.contents));
                done();
            }));
        });
        stream.write(srcStream);
        stream.end();
    });

    
    it('should produce expected file via buffer', function (done) {
        var stream = unassert();
        var srcFile = new Vinyl({
            path: process.cwd() + "/test/fixtures/patterns/fixture.js",
            cwd: process.cwd(),
            base: process.cwd() + "/test/fixtures/patterns",
            contents: fs.readFileSync('test/fixtures/patterns/fixture.js')
        });
        var expectedFile = new Vinyl({
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
        var srcStream = new Vinyl({
            path: process.cwd() + "/test/fixtures/patterns/fixture.js",
            cwd: process.cwd(),
            base: process.cwd() + "/test/fixtures/patterns",
            contents: fs.createReadStream('test/fixtures/patterns/fixture.js')
        });
        var expectedFile = new Vinyl({
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
            var srcFile = new Vinyl({
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
            var srcStream = new Vinyl({
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

    describe('SourceMap support', function () {
        it('with initial sourceMap created by gulp-sourcemaps', function (done) {
            var stream = unassert();
            var srcFileContents = fs.readFileSync('test/fixtures/patterns/fixture.js');
            var srcFile = new Vinyl({
                path: process.cwd() + "/test/fixtures/patterns/fixture.js",
                cwd: process.cwd(),
                base: process.cwd() + "/test/fixtures/patterns",
                contents: srcFileContents
            });
            // simulate initial raw map created by gulp-sourcemaps
            srcFile.sourceMap = {
                version : 3,
                file: srcFile.relative,
                names: [],
                mappings: '',
                sources: [ srcFile.relative ],
                sourcesContent: [ srcFileContents.toString('utf8') ]
            };
            stream.on("error", function(err) {
                assert(err);
                done(err);
            });
            stream.on("data", function (newFile) {
                assert(newFile);
                assert(newFile.contents);
                assert.equal(newFile.contents.toString(), fs.readFileSync('test/fixtures/patterns/expected.js', 'utf8'));
                assert(newFile.sourceMap, 'push file.sourceMap to downstream');
                assert.deepEqual(newFile.sourceMap, {
                    version: 3,
                    sources: [
                        'fixture.js'
                    ],
                    names: [
                        'add',
                        'a',
                        'b'
                    ],
                    mappings: 'AAAA;AAIA,SAASA,GAAT,CAAcC,CAAd,EAAiBC,CAAjB,EAAoB;AAAA,IAqDhB,OAAOD,CAAA,GAAIC,CAAX,CArDgB;AAAA',
                    file: 'fixture.js',
                    sourcesContent: [ srcFileContents.toString('utf8') ] 
                });
                done();
            });
            stream.write(srcFile);
            stream.end();
        });

        it('with upstream sourceMap', function (done) {
            var stream = unassert();
            var originalFileContents = fs.readFileSync('test/fixtures/coffee/fixture.coffee', 'utf8');
            var srcFile = new Vinyl({
                path: process.cwd() + "/test/fixtures/coffee/fixture.js",
                cwd: process.cwd(),
                base: process.cwd() + "/test/fixtures/coffee",
                contents: fs.readFileSync('test/fixtures/coffee/fixture.js')
            });
            srcFile.sourceMap = {
                version: 3,
                sources: [ 'fixture.coffee' ],
                names: [],
                mappings: 'AAAA,IAAA;;AAAA,MAAA,GAAS,OAAA,CAAQ,QAAR;;AAET,GAAA,GAAM,SAAC,CAAD,EAAI,CAAJ;EACJ,OAAO,CAAC,MAAR,CAAe,OAAO,CAAP,KAAY,QAA3B;EACA,MAAA,CAAO,CAAC,KAAA,CAAM,CAAN,CAAR;EACA,MAAM,CAAC,KAAP,CAAa,OAAO,CAApB,EAAuB,QAAvB;EACA,MAAM,CAAC,EAAP,CAAU,CAAC,KAAA,CAAM,CAAN,CAAX;SACA,CAAA,GAAI;AALA',
                file: 'fixture.js',
                sourceRoot: '',
                sourcesContent: [ originalFileContents ]
            };
            stream.on("error", function(err) {
                assert(err);
                done(err);
            });
            stream.on("data", function (newFile) {
                assert(newFile);
                assert(newFile.contents);
                assert.equal(newFile.contents.toString() + '\n', fs.readFileSync('test/fixtures/coffee/expected.js', 'utf8'));
                assert(newFile.sourceMap, 'push file.sourceMap to downstream');
                assert.deepEqual(newFile.sourceMap, {
                    version: 3,
                    sources: [ 'fixture.coffee' ],
                    names: [],
                    mappings: 'AAAA,IAAA,GAAA,EAAA,MAAA;AAEA,GAAA,GAAM,UAAC,CAAD,EAAI,CAAJ,EAAA;AAAA,WAKJ,CAAA,GAAI,EALA;AAAA,CAAN',
                    file: 'fixture.js',
                    sourceRoot: '',
                    sourcesContent: [ originalFileContents ] 
                });
                done();
            });
            stream.write(srcFile);
            stream.end();
        });
    });
});
