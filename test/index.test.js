/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

const getParser = require('../src');
const {
  baseSchema
} = require('./support/utils');

describe('Configured Parser', function () {
  describe('parse()', function () {
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

    describe(`successfully expands object with 'enum' shorthand when shorthand`, function () {
      it(`has values of the same type`, function () {
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
      it(`has values of different types`, function () {
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

    describe(`successfully expands object with 'array' shorthand when shorthand`, function () {
      it(`is a typeless explicit array ('array')`, function () {
        const parser = getParser();

        const shorthand = {
          list: 'array'
        };
        const expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            list: {
              type: 'array'
            }
          }
        });

        const result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });

      it(`is a typeless implicit array ('[]')`, function () {
        const parser = getParser();

        const shorthand = {
          list: '[]'
        };
        const expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            list: {
              type: 'array'
            }
          }
        });

        const result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });

      it(`is an array with type ('string[]')`, function () {
        const parser = getParser();

        const shorthand = {
          list: 'string[]'
        };
        const expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            list: {
              type: 'array',
              items: {
                type: 'string'
              }
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

    describe(`successfully expands object with 'dependencies' property when object`, function () {
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

      it('has a type', function () {
        const parser = getParser();
        const shorthand = {
          iconName: 'string',
          disabled: 'boolean',
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

      it(`has multiple 'dependencies'`, function () {
        const parser = getParser();
        const shorthand = {
          disabled: 'boolean',
          iconName: {
            type: 'string',
            dependencies: ['disabled', 'iconName']
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
            disabled: {
              type: 'boolean'
            },
            iconClasses: {
              type: 'boolean'
            },
            iconName: {
              type: 'string'
            }
          },
          dependencies: {
            iconClasses: ['iconName'],
            iconName: ['disabled', 'iconName']
          }
        });

        const result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });

      it(`has objects with nested 'dependencies'`, function () {
        const parser = getParser();
        const shorthand = {
          iconName: 'string',
          disabled: {
            other: 'string',
            inner: {
              dependencies: 'other'
            }
          },
          iconClasses: 'string'
        };

        const expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            iconName: {
              type: 'string'
            },
            iconClasses: {
              type: 'string'
            },
            disabled: {
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
          }
        });

        const result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });
    });

    describe(`successfully expands object with 'required' property when object`, function () {
      it('has no type', function () {
        const parser = getParser();

        let shorthand = {
          iconName: {
            required: true
          },
          disabled: 'boolean',
          iconClasses: 'string'
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
          required: ['iconName']
        });

        let result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });

      it('has a type', function () {
        const parser = getParser();

        let shorthand = {
          iconName: {
            type: 'boolean',
            required: true
          },
          disabled: 'boolean',
          iconClasses: 'string'
        };

        let expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            iconName: {
              type: 'boolean'
            },
            disabled: {
              type: 'boolean'
            },
            iconClasses: {
              type: 'string'
            }
          },
          required: ['iconName']
        });

        let result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });

      it(`has multiple 'required's`, function () {
        const parser = getParser();

        let shorthand = {
          iconName: {
            type: 'boolean',
            required: true
          },
          disabled: {
            type: 'boolean',
            required: true
          },
          iconClasses: 'string'
        };

        let expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            iconName: {
              type: 'boolean'
            },
            disabled: {
              type: 'boolean'
            },
            iconClasses: {
              type: 'string'
            }
          },
          required: ['iconName', 'disabled']
        });

        let result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });

      it(`has objects with nested 'required's`, function () {
        const parser = getParser();

        let shorthand = {
          iconName: {
            type: 'boolean',
            required: true
          },
          disabled: {
            type: 'boolean',
            required: true
          },
          img: {
            src: {
              type: 'boolean',
              required: true
            },
            alt: {
              required: true
            }
          },
          iconClasses: 'string'
        };

        let expanded = Object.assign({}, baseSchema({
          id: '@component'
        }), {
          properties: {
            iconName: {
              type: 'boolean'
            },
            disabled: {
              type: 'boolean'
            },
            img: {
              type: 'object',
              properties: {
                src: {
                  type: 'boolean'
                },
                alt: {
                  type: 'string'
                }
              },
              required: ['src', 'alt']
            },
            iconClasses: {
              type: 'string'
            }
          },
          required: ['iconName', 'disabled']
        });

        let result = parser.parse(shorthand, {
          id: '@component'
        });
        expect(result).to.deep.equal(expanded);
      });
    });
  });
});
