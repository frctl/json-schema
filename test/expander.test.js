/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

// const getParser = require('../src');
const Expander = require('../src/expander');

describe('Expander', function () {
  describe('constructor', function () {
    it(`only accepts valid 'opts' arguments`, function () {
      for (const opts of ['string', [], 123]) {
        const fr = () => (new Expander(opts));
        expect(fr).to.throw(TypeError, `[opts-invalid]`);
      }
      for (const opts of [{}, null, undefined]) {
        const fr = () => (new Expander(opts));
        expect(fr).to.not.throw();
      }
    });
  });
  describe('registerGenerators()', function () {
    it('only accepts valid arguments', function () {
      for (const value of [123, '345', function () {}, {}, null, undefined]) {
        const fr = () => {
          const expander = new Expander();
          expander.registerGenerators(value);
        };
        expect(fr).to.throw(TypeError, `[generators-invalid]`);
      }
      expect(() => {
        const expander = new Expander();
        expander.registerGenerators({key: 'key', generate: function () {}});
      }).to.not.throw();
    });
    it('successfully adds a single valid token', function () {
      const expander = new Expander();
      expect(expander.generatorsLength).to.equal(0);
      expander.registerGenerators({key: 'key', generate: function () {}});
      expect(expander.generatorsLength).to.equal(1);
    });
    it('successfully adds an array of generators', function () {
      const expander = new Expander();
      expect(expander.generatorsLength).to.equal(0);
      expander.registerGenerators([{key: 'key', generate: function () {}}, {key: 'key', generate: function () {}}, {key: 'key', generate: function () {}}]);
      expect(expander.generatorsLength).to.equal(3);
    });
  });
});
