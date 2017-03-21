/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

const getParser = require('../src');
const {
  baseSchema
} = require('./support/utils');

describe('Configured Parser', function () {
  describe('parse()', function () {
    it(`successfully expands simple object shorthand notation`, function () {
      const shorthand = {
        title: 'string',
        disabled: 'boolean'
      };
      const expanded = {
        properties: {
          title: {
            type: 'string'
          },
          disabled: {
            type: 'boolean'
          }
        }
      };

      const base = {
        id: '@component'
      };
      testParser(shorthand, expanded, base);
    });

    it(`reverts to default type expander if unknown type is supplied`, function () {
      const shorthand = {
        title: 'unknown'
      };
      const expanded = {
        properties: {
          title: {
            type: 'unknown'
          }
        }
      };

      const base = {
        id: '@component'
      };
      testParser(shorthand, expanded, base);
    });

    describe(`successfully expands object with 'enum' shorthand when shorthand`, function () {
      it(`has values of the same type`, function () {
        const shorthand = {
          title: 'string',
          modifiers: ['primary', 'secondary', 'tertiary']
        };

        const expanded = {
          properties: {
            title: {
              type: 'string'
            },
            modifiers: {
              type: 'string',
              enum: ['primary', 'secondary', 'tertiary']
            }
          }
        };

        const base = {
          id: '@component'
        };
        testParser(shorthand, expanded, base);
      });
      it(`has values of different types`, function () {
        const shorthand = {
          title: 'string',
          modifiers: ['primary', 23, false]
        };

        const expanded = {
          properties: {
            title: {
              type: 'string'
            },
            modifiers: {
              enum: ['primary', 23, false]
            }
          }
        };

        const base = {
          id: '@component'
        };
        testParser(shorthand, expanded, base);
      });
    });

    describe(`successfully expands object with 'array' shorthand when shorthand`, function () {
      it(`is a typeless explicit array ('array')`, function () {
        const shorthand = {
          list: 'array'
        };
        const expanded = {
          properties: {
            list: {
              type: 'array'
            }
          }
        };

        const base = {
          id: '@component'
        };
        testParser(shorthand, expanded, base);
      });

      it(`is a typeless implicit array ('[]')`, function () {
        const shorthand = {
          list: '[]'
        };
        const expanded = {
          properties: {
            list: {
              type: 'array'
            }
          }
        };

        const base = {
          id: '@component'
        };
        testParser(shorthand, expanded, base);
      });

      it(`is an array with type ('string[]')`, function () {
        const shorthand = {
          list: 'string[]'
        };
        const expanded = {
          properties: {
            list: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        };

        const base = {
          id: '@component'
        };
        testParser(shorthand, expanded, base);
      });
    });

    describe(`successfully expands object with 'ref' shorthand when shorthand`, function () {
      it(`contains a component reference`, function () {
        const shorthand = {
          pill: '@pill'
        };
        const expanded = {
          properties: {
            pill: {
              $ref: '@pill'
            }
          }
        };

        testParser(shorthand, expanded, {});
      });
    });

    it(`successfully expands object with nested object shorthand notation`, function () {
      const shorthand = {
        title: 'string',
        img: {
          modifiers: 'string',
          disabled: 'boolean',
          alt: 'string'
        }
      };

      const expanded = {
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
      };

      const base = {
        id: '@component'
      };
      testParser(shorthand, expanded, base);
    });

    describe(`successfully expands object with 'dependencies' property when object`, function () {
      it('has no type', function () {
        const shorthand = {
          iconName: 'string',
          disabled: 'boolean',
          iconClasses: {
            dependencies: 'iconName'
          }
        };

        const expanded = {
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
        };

        const base = {
          id: '@component'
        };

        testParser(shorthand, expanded, base);
      });

      it('has a type', function () {
        const shorthand = {
          iconName: 'string',
          disabled: 'boolean',
          iconClasses: {
            type: 'boolean',
            dependencies: 'iconName'
          }
        };

        const expanded = {
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
        };

        const base = {
          id: '@component'
        };

        testParser(shorthand, expanded, base);
      });

      it(`has multiple 'dependencies'`, function () {
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

        const expanded = {
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
        };

        const base = {
          id: '@component'
        };

        testParser(shorthand, expanded, base);
      });

      it(`has objects with nested 'dependencies'`, function () {
        const base = {
          id: '@component'
        };
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
        const expanded = {
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
        };
        testParser(shorthand, expanded, base);
      });
    });

    describe(`successfully expands object with 'required' property when object`, function () {
      it('has no type', function () {
        const shorthand = {
          iconName: {
            required: true
          },
          disabled: 'boolean',
          iconClasses: 'string'
        };

        const expanded = {
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
        };
        const base = {
          id: '@component'
        };

        testParser(shorthand, expanded, base);
      });

      it('has a type', function () {
        const shorthand = {
          iconName: {
            type: 'boolean',
            required: true
          },
          disabled: 'boolean',
          iconClasses: 'string'
        };

        const expanded = {
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
        };

        const base = {
          id: '@component'
        };

        testParser(shorthand, expanded, base);
      });

      it(`has multiple 'required's`, function () {
        const shorthand = {
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

        const expanded = {
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
        };

        const base = {
          id: '@component'
        };

        testParser(shorthand, expanded, base);
      });

      it(`has objects with nested 'required's`, function () {
        const shorthand = {
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

        const expanded = {
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
        };

        const base = {
          id: '@component'
        };

        testParser(shorthand, expanded, base);
      });
    });

    describe(`successfully expands object with '$include' property when it`, function () {

    });

    describe.skip(`successfully expands object with '$include' property when it`, function () {
      it(`is the only property present`, function () {
        const shorthand = {
          $include: ['@label', '@form-unit']
        };

        const expanded = {
          allOf: [{
            $ref: '@label'
          },
          {
            $ref: '@form-unit'
          }]
        };

        testParser(shorthand, expanded, {});
      });

      it(`is not the only property present`, function () {
        const shorthand = {
          $include: ['@label', '@form-unit'],
          placeholder: 'string',
          inputClass: ['inline', 'constrained'],
          inputId: {
            type: 'string',
            required: true
          }
        };

        const expanded = {
          allOf: [{
            $ref: '@label'
          },
          {
            $ref: '@form-unit'
          },
          {
            properties: {
              placeholder: {
                type: 'string'
              },
              inputClass: {
                type: 'string',
                enum: ['inline', 'constrained']
              },
              inputId: {
                type: 'string'
              }
            }
          }
          ],
          required: ['inputId']
        };

        testParser(shorthand, expanded, {});
      });
    });
  });
});

function testParser(shorthand, expected, base) {
  const parser = getParser();
  const result = parser.parse(shorthand, base);
  const expanded = Object.assign({}, baseSchema(base), expected);
  expect(result).to.deep.equal(expanded);
}
