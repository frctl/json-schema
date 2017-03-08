/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

// const getParser = require('../src');
const Expander = require('../src/expander');

describe('Expander', function () {
  describe('constructor', function () {
    it(`only accepts valid arguments`);
  });
  describe('registerTokens()', function () {
    it('only accepts valid arguments', function () {
      for (const value of [123, '345', {}, undefined]) {
        const fr = () => {
          const expander = new Expander();
          expander.registerTokens(value);
        };
        expect(fr).to.throw(TypeError, `[tokens-invalid]`);
      }
      expect(() => {
        const expander = new Expander();
        expander.registerTokens(function () {});
      }).to.not.throw();
    });
    it('successfully adds a single valid token', function () {
      const expander = new Expander();
      expect(expander.tokensLength).to.equal(0);
      expander.registerTokens(function () {});
      expect(expander.tokensLength).to.equal(1);
    });
    it('successfully adds an array of tokens', function () {
      const expander = new Expander();
      expect(expander.tokensLength).to.equal(0);
      expander.registerTokens([function () {}, function () {}, function () {}]);
      expect(expander.tokensLength).to.equal(3);
    });
  });
});
