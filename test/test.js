'use strict';

delete require.cache[require.resolve('../')];
const unassert = require('../');
const fs = require('fs');
const { join, dirname } = require('path');
const es = require('event-stream');
const assert = require('assert').strict;
const Vinyl = require('vinyl');

describe('gulp-unassert', () => {
  for (const name of ['es2017', 'es2018', 'es2019', 'es2020']) {
    it(name + ' syntax', (done) => {
      const stream = unassert();
      const srcStream = new Vinyl({
        path: join(process.cwd(), 'test', 'fixtures', name, 'fixture.js'),
        cwd: process.cwd(),
        base: join(process.cwd(), 'test', 'fixtures', name),
        contents: fs.createReadStream(join('test', 'fixtures', name, 'fixture.js'))
      });
      const expectedFile = new Vinyl({
        path: join(process.cwd(), 'test', 'fixtures', name, 'expected.js'),
        cwd: process.cwd(),
        base: join(process.cwd(), 'test', 'fixtures', name),
        contents: fs.readFileSync(join('test', 'fixtures', name, 'expected.js'))
      });
      stream.on('error', (err) => {
        assert(!err.message);
        done();
      });
      stream.on('data', (newFile) => {
        assert(newFile);
        assert(newFile.contents);
        newFile.contents.pipe(es.wait((err, data) => {
          assert(!err);
          assert.equal(String(data.toString('utf-8')) + '\n', String(expectedFile.contents));
          done();
        }));
      });
      stream.write(srcStream);
      stream.end();
    });
  }

  it('should produce expected file via buffer', (done) => {
    const stream = unassert();
    const srcFile = new Vinyl({
      path: join(process.cwd(), 'test', 'fixtures', 'patterns', 'fixture.js'),
      cwd: process.cwd(),
      base: join(process.cwd(), 'test', 'fixtures', 'patterns'),
      contents: fs.readFileSync(join('test', 'fixtures', 'patterns', 'fixture.js'))
    });
    const expectedFile = new Vinyl({
      path: join(process.cwd(), 'test', 'fixtures', 'patterns', 'expected.js'),
      cwd: process.cwd(),
      base: join(process.cwd(), 'test', 'fixtures', 'patterns'),
      contents: fs.readFileSync(join('test', 'fixtures', 'patterns', 'expected.js'))
    });
    stream.on('error', (err) => {
      assert(err);
      done(err);
    });
    stream.on('data', (newFile) => {
      assert(newFile);
      assert(newFile.contents);
      assert.equal(String(newFile.contents), String(expectedFile.contents));
      done();
    });
    stream.write(srcFile);
    stream.end();
  });

  it('should produce expected file via stream', (done) => {
    const stream = unassert();
    const srcStream = new Vinyl({
      path: join(process.cwd(), 'test', 'fixtures', 'patterns', 'fixture.js'),
      cwd: process.cwd(),
      base: join(process.cwd(), 'test', 'fixtures', 'patterns'),
      contents: fs.createReadStream(join('test', 'fixtures', 'patterns', 'fixture.js'))
    });
    const expectedFile = new Vinyl({
      path: join(process.cwd(), 'test', 'fixtures', 'patterns', 'expected.js'),
      cwd: process.cwd(),
      base: join(process.cwd(), 'test', 'fixtures', 'patterns'),
      contents: fs.readFileSync(join('test', 'fixtures', 'patterns', 'expected.js'))
    });
    stream.on('error', (err) => {
      assert(err);
      done();
    });
    stream.on('data', (newFile) => {
      assert(newFile);
      assert(newFile.contents);
      newFile.contents.pipe(es.wait((err, data) => {
        assert(!err);
        assert.equal(data.toString('utf-8'), String(expectedFile.contents));
        done();
      }));
    });
    stream.write(srcStream);
    stream.end();
  });

  describe('should not throw but emit error when the file has a syntax error', () => {
    it('when file is Buffer', (done) => {
      const stream = unassert();
      const srcFile = new Vinyl({
        path: join(process.cwd(), 'test', 'fixtures', 'syntax-error', 'fixture.js'),
        cwd: process.cwd(),
        base: join(process.cwd(), 'test', 'fixtures', 'syntax-error'),
        contents: fs.readFileSync(join('test', 'fixtures', 'syntax-error', 'fixture.js'))
      });
      assert.doesNotThrow(() => {
        stream.on('error', (err) => {
          assert(err);
          done();
        });
        stream.write(srcFile);
        stream.end();
      });
    });
    it('when file is Stream', (done) => {
      const stream = unassert();
      const srcStream = new Vinyl({
        path: join(process.cwd(), 'test', 'fixtures', 'syntax-error', 'fixture.js'),
        cwd: process.cwd(),
        base: join(process.cwd(), 'test', 'fixtures', 'syntax-error'),
        contents: fs.createReadStream(join('test', 'fixtures', 'syntax-error', 'fixture.js'))
      });
      assert.doesNotThrow(() => {
        stream.on('error', (err) => {
          assert(err);
          done();
        });
        stream.write(srcStream);
        stream.end();
      });
    });
  });

  it('custom options', (done) => {
    const stream = unassert({
      modules: [
        'node:assert',
        'node:assert/strict',
        'power-assert',
        'invariant',
        'nanoassert',
        'uvu/assert'
      ]
    });
    const fixturePath = join(process.cwd(), 'test', 'fixtures', 'custom_modules_mjs', 'fixture.mjs');
    const srcFile = new Vinyl({
      path: fixturePath,
      cwd: process.cwd(),
      base: dirname(fixturePath),
      contents: fs.readFileSync(fixturePath)
    });
    const expectedFilePath = join(process.cwd(), 'test', 'fixtures', 'custom_modules_mjs', 'expected.mjs');
    const expectedFile = new Vinyl({
      path: expectedFilePath,
      cwd: process.cwd(),
      base: dirname(expectedFilePath),
      contents: fs.readFileSync(expectedFilePath)
    });
    stream.on('error', (err) => {
      assert(err);
      done(err);
    });
    stream.on('data', (newFile) => {
      assert(newFile);
      assert(newFile.contents);
      assert.equal(String(newFile.contents) + '\n', String(expectedFile.contents));
      done();
    });
    stream.write(srcFile);
    stream.end();
  });

  describe('SourceMap support', () => {
    it('with initial sourceMap created by gulp-sourcemaps', (done) => {
      const stream = unassert();
      const srcFileContents = fs.readFileSync(join('test', 'fixtures', 'patterns', 'fixture.js'));
      const srcFile = new Vinyl({
        path: join(process.cwd(), 'test', 'fixtures', 'patterns', 'fixture.js'),
        cwd: process.cwd(),
        base: join(process.cwd(), 'test', 'fixtures', 'patterns'),
        contents: srcFileContents
      });
      // simulate initial raw map created by gulp-sourcemaps
      srcFile.sourceMap = {
        version: 3,
        file: srcFile.relative,
        names: [],
        mappings: '',
        sources: [srcFile.relative],
        sourcesContent: [srcFileContents.toString('utf8')]
      };
      stream.on('error', (err) => {
        assert(err);
        done(err);
      });
      stream.on('data', (newFile) => {
        assert(newFile);
        assert(newFile.contents);
        const expectedContent = fs.readFileSync(join('test', 'fixtures', 'patterns', 'expected.js'), 'utf8');
        assert.equal(newFile.contents.toString(), expectedContent);
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
          sourcesContent: [srcFileContents.toString('utf8')]
        });
        done();
      });
      stream.write(srcFile);
      stream.end();
    });

    it('with upstream sourceMap', (done) => {
      const stream = unassert();
      const originalFileContents = fs.readFileSync(join(process.cwd(), 'test', 'fixtures', 'coffee', 'fixture.coffee'), 'utf8');
      const srcFile = new Vinyl({
        path: join(process.cwd(), 'test', 'fixtures', 'coffee', 'fixture.js'),
        cwd: process.cwd(),
        base: join(process.cwd(), 'test', 'fixtures', 'coffee'),
        contents: fs.readFileSync(join(process.cwd(), 'test', 'fixtures', 'coffee', 'fixture.js'))
      });
      srcFile.sourceMap = {
        version: 3,
        sources: ['fixture.coffee'],
        names: [],
        mappings: 'AAAA,IAAA;;AAAA,MAAA,GAAS,OAAA,CAAQ,QAAR;;AAET,GAAA,GAAM,SAAC,CAAD,EAAI,CAAJ;EACJ,OAAO,CAAC,MAAR,CAAe,OAAO,CAAP,KAAY,QAA3B;EACA,MAAA,CAAO,CAAC,KAAA,CAAM,CAAN,CAAR;EACA,MAAM,CAAC,KAAP,CAAa,OAAO,CAApB,EAAuB,QAAvB;EACA,MAAM,CAAC,EAAP,CAAU,CAAC,KAAA,CAAM,CAAN,CAAX;SACA,CAAA,GAAI;AALA',
        file: 'fixture.js',
        sourceRoot: '',
        sourcesContent: [originalFileContents]
      };
      stream.on('error', (err) => {
        assert(err);
        done(err);
      });
      stream.on('data', (newFile) => {
        assert(newFile);
        assert(newFile.contents);
        const expectedContent = fs.readFileSync(join(process.cwd(), 'test', 'fixtures', 'coffee', 'expected.js'), 'utf8');
        assert.equal(newFile.contents.toString() + '\n', expectedContent);
        assert(newFile.sourceMap, 'push file.sourceMap to downstream');
        assert.deepEqual(newFile.sourceMap, {
          version: 3,
          sources: ['fixture.coffee'],
          names: [],
          mappings: 'AAAA,IAAA,GAAA,EAAA,MAAA;AAEA,GAAA,GAAM,UAAC,CAAD,EAAI,CAAJ,EAAA;AAAA,WAKJ,CAAA,GAAI,EALA;AAAA,CAAN',
          file: 'fixture.js',
          sourceRoot: '',
          sourcesContent: [originalFileContents]
        });
        done();
      });
      stream.write(srcFile);
      stream.end();
    });
  });
});
