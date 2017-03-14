/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

const getParser = require('../src');
const {
  baseSchema
} = require('./support/utils');

describe('Configured Parser', function () {
  describe('parse()', function () {
    // it(`successfully expands array shorthand notation`, function () {
    //   const parser = getParser();
    //
    //   const shorthand = ['title', 'text'];
    //   const expanded = Object.assign({}, baseSchema({id: '@component'}), {
    //     properties: {
    //       title: {
    //         type: 'string'
    //       },
    //       text: {
    //         type: 'string'
    //       }
    //     }
    //   });
    //
    //   const result = parser.parse(shorthand, {id: '@component'});
    //   expect(result).to.deep.equal(expanded);
    // });

    it(`successfully expands simple object shorthand notation`, function () {
      const parser = getParser();

      const shorthand = {
        title: 'string',
        disabled: 'boolean'
      };
      const expanded = Object.assign({}, baseSchema({
        id: '@component'
      }), {
        properties: {
          title: {
            type: 'string'
          },
          disabled: {
            type: 'boolean'
          }
        }
      });

      const result = parser.parse(shorthand, {
        id: '@component'
      });
      expect(result).to.deep.equal(expanded);
    });

    it(`reverts to default type expander if unknown type is supplied`, function () {
      const parser = getParser();

      const shorthand = {
        title: 'unknown'
      };
      const expanded = Object.assign({}, baseSchema({
        id: '@component'
      }), {
        properties: {
          title: {
            type: 'unknown'
          }
        }
      });

      const result = parser.parse(shorthand, {
        id: '@component'
      });
      expect(result).to.deep.equal(expanded);
    });

    describe(`successfully expands object with nested array enum notation when enum`, function () {
      it(`has values with the same type`, function () {
        const parser = getParser();

        const shorthand = {
          title: 'string',
          modifiers: ['primary', 'secondary', 'tertiary']
        };

        const expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            title: {
              type: 'string'
            },
            modifiers: {
              type: 'string',
              enum: ['primary', 'secondary', 'tertiary']
            }
          }
        });

        const result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });
      it(`has values with different types`, function () {
        const parser = getParser();

        const shorthand = {
          title: 'string',
          modifiers: ['primary', 23, false]
        };

        const expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            title: {
              type: 'string'
            },
            modifiers: {
              enum: ['primary', 23, false]
            }
          }
        });

        const result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });
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

      const expanded = Object.assign({}, baseSchema({
        id: '@component'
      }), {
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

      const result = parser.parse(shorthand, {
        id: '@component'
      });
      expect(result).to.deep.equal(expanded);
    });

    describe(`successfully expands object with dependencies when object`, function () {
      it('has no type', function () {
        const parser = getParser();

        let shorthand = {
          iconName: 'string',
          disabled: 'boolean',
          iconClasses: {
            dependencies: 'iconName'
          }
        };

        let expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            iconName: {
              type: 'string'
            },
            disabled: {
              type: 'boolean'
            },
            iconClasses: {
              type: 'string'
            }
          },
          dependencies: {
            iconClasses: ['iconName']
          }
        });

        let result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });

      it('has type', function () {
        const parser = getParser();
        const shorthand = {
          iconName: 'string',
          disabled: 'boolean',
          test: {
            other: 'string',
            inner: {
              dependencies: 'other'
            }
          },
          iconClasses: {
            type: 'boolean',
            dependencies: 'iconName'
          }
        };

        const expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            iconName: {
              type: 'string'
            },
            disabled: {
              type: 'boolean'
            },
            iconClasses: {
              type: 'boolean'
            },
            test: {
              type: 'object',
              properties: {
                other: {
                  type: 'string'
                },
                inner: {
                  type: 'string'
                }
              },
              dependencies: {
                inner: ['other']
              }
            }
          },
          dependencies: {
            iconClasses: ['iconName']
          }
        });

        const result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });
      it('has multiple dependencies');
    });
  });
});
