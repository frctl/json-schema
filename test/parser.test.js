/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

const Parser = require('../src');

const baseSchema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object'
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
      for (const value of [['string', 123]]) {
        expect(fr(value)).to.throw(TypeError, `[shorthand-array-invalid]`);
      }
      for (const value of [{}, ['string1']]) {
        expect(fr(value)).to.not.throw();
      }
    });
    it(`returns an already qualified Schema unmodified`, function () {
      const parser = new Parser();
      const result = parser.parse(baseSchema);
      expect(result).to.deep.equal(baseSchema);
    });
    it(`returns a valid but empty Schema, if provided with a valid but empty argument`, function () {
      for (const value of [[], {}]) {
        const parser = new Parser();
        const result = parser.parse(value);
        expect(JSON.stringify(result)).to.equal(JSON.stringify(baseSchema));
      }
    });
    it(`successfully expands array shorthand notation`, function () {
      const parser = new Parser();

      const shorthand = ['title', 'text'];
      const expanded = {
        $schema: 'http://json-schema.org/schema#',
        type: 'object',
        properties: {
          title: {
            type: 'string'
          },
          text: {
            type: 'string'
          }
        }
      };

      const result = parser.parse(shorthand);
      expect(JSON.stringify(result)).to.equal(JSON.stringify(expanded));
    });
  });
});
