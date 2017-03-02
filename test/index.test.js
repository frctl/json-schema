/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

const getParser = require('../src');

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
  describe('parse()', function () {
    it(`successfully expands array shorthand notation`, function () {
      const parser = getParser();

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
      const parser = getParser();

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

    it(`reverts to default type expander if unknown type is supplied`, function () {
      const parser = getParser();

      const shorthand = {
        title: 'unknown'
      };
      const expanded = Object.assign({}, baseSchema('@component'), {
        properties: {
          title: {
            type: 'unknown'
          }
        }
      });

      const result = parser.parse(shorthand, '@component');
      expect(JSON.stringify(result)).to.equal(JSON.stringify(expanded));
    });

    it(`successfully expands object with nested array shorthand notation`, function () {
      const parser = getParser();

      const shorthand = {
        title: 'string',
        img: [
          'modifiers',
          'src',
          'alt'
        ]
      };

      const expanded = Object.assign({}, baseSchema('@component'), {
        properties: {
          title: {
            type: 'string'
          },
          img: {
            type: 'object',
            properties: {
              modifiers: {
                type: 'string'
              },
              src: {
                type: 'string'
              },
              alt: {
                type: 'string'
              }
            }
          }
        }
      });

      const result = parser.parse(shorthand, '@component');
      expect(JSON.stringify(result)).to.equal(JSON.stringify(expanded));
    });

    it(`successfully expands object with nested object shorthand notation`, function () {
      const parser = getParser();

      const shorthand = {
        title: 'string',
        img: {
          modifiers: 'string',
          disabled: 'boolean',
          alt: 'string'
        }
      };

      const expanded = Object.assign({}, baseSchema('@component'), {
        properties: {
          title: {
            type: 'string'
          },
          img: {
            type: 'object',
            properties: {
              modifiers: {
                type: 'string'
              },
              disabled: {
                type: 'boolean'
              },
              alt: {
                type: 'string'
              }
            }
          }
        }
      });

      const result = parser.parse(shorthand, '@component');
      expect(JSON.stringify(result)).to.equal(JSON.stringify(expanded));
    });
  });
});
