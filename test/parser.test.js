/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

const Parser = require('../src');

const baseSchema = id => {
  let schema = {
    $schema: 'http://json-schema.org/schema#'
  };
  if (id) {
    schema.id = id;
  }
  schema.type = 'object';
  return schema;
};

describe('Parser', function () {
  describe('constructor()', function () {
    it(`only accepts valid config arguments`, function () {
      for (const type of ['string', [], 123]) {
        const fr = () => (new Parser(type));
        expect(fr).to.throw(TypeError, `[config-invalid]`);
      }
      for (const type of [{}, null]) {
        const fr = () => (new Parser(type));
        expect(fr).to.not.throw();
      }
    });
  });
  describe('parse()', function () {
    it(`only accepts valid shorthand arguments`, function () {
      const fr = value => {
        return () => {
          const parser = new Parser();
          parser.parse(value);
        };
      };
      for (const value of ['string', 123]) {
        expect(fr(value)).to.throw(TypeError, `[shorthand-invalid]`);
      }
      for (const value of [
          ['string', 123]
      ]) {
        expect(fr(value)).to.throw(TypeError, `[shorthand-array-invalid]`);
      }
      for (const value of [{},
          ['string1']
      ]) {
        expect(fr(value)).to.not.throw();
      }
    });

    it(`only accepts valid id arguments`, function () {
      const fr = value => {
        return () => {
          const parser = new Parser();
          parser.parse({}, value);
        };
      };
      for (const value of [{}, 123]) {
        expect(fr(value)).to.throw(TypeError, `[id-invalid]`);
      }
      for (const value of ['id1', 'id2']) {
        expect(fr(value)).to.not.throw();
      }
    });

    it(`returns an already qualified Schema unmodified`, function () {
      const parser = new Parser();
      let base = baseSchema();
      const result = parser.parse(base);
      expect(result).to.deep.equal(base);
    });

    it(`returns a valid but empty Schema, if provided with a valid but empty argument`, function () {
      for (const value of [[], {}]) {
        const parser = new Parser();
        const result = parser.parse(value);
        expect(JSON.stringify(result)).to.equal(JSON.stringify(baseSchema()));
      }
    });

    it(`assigns 'id' correctly`, function () {
      for (const value of [[], {}]) {
        const parser = new Parser();
        const expanded = baseSchema('@component');
        const result = parser.parse(value, '@component');
        expect(JSON.stringify(result)).to.equal(JSON.stringify(expanded));
      }
    });

    it(`successfully expands array shorthand notation`, function () {
      const parser = new Parser();

      const shorthand = ['title', 'text'];
      const expanded = Object.assign({}, baseSchema('@component'), {
        properties: {
          title: {
            type: 'string'
          },
          text: {
            type: 'string'
          }
        }
      });

      const result = parser.parse(shorthand, '@component');
      expect(JSON.stringify(result)).to.equal(JSON.stringify(expanded));
    });

    it(`successfully expands simple object shorthand notation`, function () {
      const parser = new Parser();

      const shorthand = {
        title: 'string',
        disabled: 'boolean'
      };
      const expanded = Object.assign({}, baseSchema('@component'), {
        properties: {
          title: {
            type: 'string'
          },
          disabled: {
            type: 'boolean'
          }
        }
      });

      const result = parser.parse(shorthand, '@component');
      expect(JSON.stringify(result)).to.equal(JSON.stringify(expanded));
    });
  });
});
