/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

const Parser = require('../src/parser');
const Expander = require('../src/expander');

const basicExpander = new Expander();
const basicConfig = {
  expander: basicExpander
};

const {baseSchema} = require('./support/utils');

describe('Parser', function () {
  describe('constructor', function () {
    it(`only accepts valid config arguments`, function () {
      for (const config of ['string', [], 123, null, undefined]) {
        const fr = () => (new Parser(config));
        expect(fr).to.throw(TypeError, `[config-invalid]`);
      }
      for (const config of [basicConfig]) {
        const fr = () => (new Parser(config));
        expect(fr).to.not.throw();
      }
    });
  });
  describe('parse()', function () {
    it(`only accepts valid shorthand arguments`, function () {
      const fr = value => {
        return () => {
          const parser = new Parser(basicConfig);
          parser.parse(value);
        };
      };
      for (const value of ['string', 123, ['one', 'two']]) {
        expect(fr(value)).to.throw(TypeError, `[shorthand-invalid]`);
      }
      for (const value of [{}]) {
        expect(fr(value)).to.not.throw();
      }
    });

    it(`only accepts valid base arguments`, function () {
      const fr = value => {
        return () => {
          const parser = new Parser(basicConfig);
          parser.parse({}, value);
        };
      };
      for (const value of ['value', 123]) {
        expect(fr(value)).to.throw(TypeError, `[base-invalid]`);
      }
      for (const value of [{}, {id: 'value'}]) {
        expect(fr(value)).to.not.throw();
      }
    });

    it(`returns an already qualified Schema unmodified`, function () {
      const parser = new Parser(basicConfig);
      let base = baseSchema();
      const result = parser.parse(base);
      expect(result).to.deep.equal(base);
    });

    it(`returns a valid but empty Schema, if provided with a valid but empty argument`, function () {
      for (const value of [{}]) {
        const parser = new Parser(basicConfig);
        const result = parser.parse(value);
        const expanded = baseSchema();
        expect(result).to.be.an('object');
        expect(result.$schema).to.equal(expanded.$schema);
        expect(result.type).to.exist;
      }
    });

    it(`assigns 'id' correctly`, function () {
      for (const value of [{}]) {
        const parser = new Parser(basicConfig);
        const expanded = baseSchema({id: '@component'});
        const result = parser.parse(value, {id: '@component'});
        expect(result).to.be.an('object');
        expect(result.id).to.equal(expanded.id);
      }
    });

    it(`assigns '$schema' correctly`, function () {
      for (const value of [{}]) {
        const parser = new Parser(basicConfig);
        const expanded = baseSchema();
        expanded.$schema = 'http://json-schema.org/hyper-schema#';
        const result = parser.parse(value, {$schema: 'http://json-schema.org/hyper-schema#'});
        expect(result).to.be.an('object');
        expect(result.$schema).to.equal(expanded.$schema);
      }
    });
  });
});
