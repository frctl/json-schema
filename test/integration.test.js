/* eslint-disable no-unused-expressions */
const expect = require('@frctl/utils/test').expect;

const getParser = require('../src');
const {
  baseExpandedSchema
} = require('./support/utils');

describe('Configured Parser', function () {
  describe('parse()', function () {
    it(`expands simple object shorthand notation`, function () {
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

      testParser(shorthand, expanded);
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

      testParser(shorthand, expanded);
    });

    describe(`expands object with 'enum' shorthand when shorthand`, function () {
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

        testParser(shorthand, expanded);
      });
      it(`has values of different types`, function () {
        const shorthand = {
          title: 'string',
          modifiers: ['primary', '23', 2]
        };

        const expanded = {
          properties: {
            title: {
              type: 'string'
            },
            modifiers: {
              enum: ['primary', '23', 2]
            }
          }
        };

        testParser(shorthand, expanded);
      });
    });

    describe(`expands object with 'array' shorthand when shorthand`, function () {
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

        testParser(shorthand, expanded);
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

        testParser(shorthand, expanded);
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

        testParser(shorthand, expanded);
      });
    });

    describe(`expands object with 'ref' shorthand when shorthand`, function () {
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

        testParser(shorthand, expanded);
      });
    });

    it(`expands object with nested object shorthand notation`, function () {
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

      testParser(shorthand, expanded);
    });

    describe(`expands object with '$dependencies' shorthand when object`, function () {
      it('has no type', function () {
        const shorthand = {
          iconName: 'string',
          disabled: 'boolean',
          iconClasses: {
            $dependencies: 'iconName'
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
            iconClasses: {}
          },
          dependencies: {
            iconClasses: ['iconName']
          }
        };

        testParser(shorthand, expanded);
      });

      it('has a type', function () {
        const shorthand = {
          iconName: 'string',
          disabled: 'boolean',
          iconClasses: {
            $type: 'boolean',
            $dependencies: 'iconName'
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

        testParser(shorthand, expanded);
      });

      it(`has multiple '$dependencies'`, function () {
        const shorthand = {
          disabled: 'boolean',
          iconName: {
            $type: 'string',
            $dependencies: ['disabled', 'iconName']
          },
          iconClasses: {
            $type: 'boolean',
            $dependencies: 'iconName'
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

        testParser(shorthand, expanded);
      });

      it(`has objects with nested '$dependencies'`, function () {
        const shorthand = {
          iconName: 'string',
          disabled: {
            other: 'string',
            inner: {
              $dependencies: 'other'
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
                inner: {}
              },
              dependencies: {
                inner: ['other']
              }
            }
          }
        };
        testParser(shorthand, expanded);
      });
    });

    describe(`expands object with a '$required' property when object`, function () {
      it('has no type', function () {
        const shorthand = {
          iconName: {
            $required: true
          },
          disabled: 'boolean',
          iconClasses: 'string'
        };

        const expanded = {
          properties: {
            iconName: {},
            disabled: {
              type: 'boolean'
            },
            iconClasses: {
              type: 'string'
            }
          },
          required: ['iconName']
        };

        testParser(shorthand, expanded);
      });

      it('has a type', function () {
        const shorthand = {
          iconName: {
            $type: 'boolean',
            $required: true
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

        testParser(shorthand, expanded);
      });

      it(`has multiple '$required's`, function () {
        const shorthand = {
          iconName: {
            $type: 'boolean',
            $required: true
          },
          disabled: {
            $type: 'boolean',
            $required: true
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

        testParser(shorthand, expanded);
      });

      it(`has objects with nested '$required's`, function () {
        const shorthand = {
          iconName: {
            $type: 'boolean',
            $required: true
          },
          disabled: {
            $type: 'boolean',
            $required: true
          },
          img: {
            $required: true,
            src: {
              $type: 'boolean',
              $required: true
            },
            alt: {
              $required: true
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
                alt: {}
              },
              required: ['src', 'alt']
            },
            iconClasses: {
              type: 'string'
            }
          },
          required: ['iconName', 'disabled', 'img']
        };

        testParser(shorthand, expanded);
      });
    });

    describe(`expands object with an '$include' property when it`, function () {
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

        testParser(shorthand, expanded);
      });

      it(`is not the only property present`, function () {
        const shorthand = {
          $include: ['@label', '@form-unit'],
          placeholder: 'string',
          inputClass: ['inline', 'constrained'],
          inputId: {
            $type: 'string',
            $required: true
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
          }],
          required: ['inputId']
        };

        testParser(shorthand, expanded, {});
      });
    });

    describe(`expands object with 'generic' JSON Schema keywords when keyword`, function () {
      it(`is 'id', 'title', 'description', 'type', or 'default'`, function () {
        const shorthand = {
          $id: '@component',
          $title: 'My Component',
          $description: 'A lovely component',
          $default: 'The default value',
          $type: 'object'
        };
        const expanded = {
          id: '@component',
          title: 'My Component',
          description: 'A lovely component',
          default: 'The default value',
          type: 'object'
        };
        testParser(shorthand, expanded);
      });
      it(`is 'enum'`, function () {
        const shorthand = {
          modifiers1: {
            $enum: ['red', 'green', 23]
          },
          modifiers2: {
            $enum: ['red', 'green', '23']
          },
          modifiers3: {
            $type: 'number',
            $enum: [23, 55, 123]
          }
        };
        const expanded = {
          properties: {
            modifiers1: {
              enum: ['red', 'green', 23]
            },
            modifiers2: {
              enum: ['red', 'green', '23']
            },
            modifiers3: {
              type: 'number',
              enum: [23, 55, 123]
            }
          }
        };
        testParser(shorthand, expanded);
      });
    });

    describe(`expands object with 'string' JSON Schema keywords when keyword`, function () {
      it(`is 'minLength', 'maxLength', 'pattern' or 'format'`, function () {
        const shorthand = {
          strings1: {
            $type: 'string',
            $minLength: 4,
            $maxLength: 24
          },
          strings2: {
            $type: 'string',
            $pattern: '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$'
          },
          strings3: {
            $type: 'string',
            $format: 'email'
          }
        };
        const expanded = {
          properties: {
            strings1: {
              type: 'string',
              minLength: 4,
              maxLength: 24
            },
            strings2: {
              type: 'string',
              pattern: '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$'
            },
            strings3: {
              type: 'string',
              format: 'email'
            }
          }
        };
        testParser(shorthand, expanded);
      });
    });

    describe(`expands object with 'numeric' JSON Schema keywords when keyword`, function () {
      it(`is 'multipleOf', 'minimum', 'maximum', 'exclusiveMinimum' or 'exclusiveMaximum'`, function () {
        const shorthand = {
          numbers1: {
            $type: 'integer',
            $multipleOf: 4
          },
          numbers2: {
            $type: 'integer',
            $minimum: 3,
            $maximum: 5
          },
          numbers3: {
            $type: 'integer',
            $minimum: 2,
            $maximum: 6,
            $exclusiveMinimum: true,
            $exclusiveMaximum: true
          }
        };
        const expanded = {
          properties: {
            numbers1: {
              type: 'integer',
              multipleOf: 4
            },
            numbers2: {
              type: 'integer',
              minimum: 3,
              maximum: 5
            },
            numbers3: {
              type: 'integer',
              minimum: 2,
              maximum: 6,
              exclusiveMinimum: true,
              exclusiveMaximum: true
            }
          }
        };
        testParser(shorthand, expanded);
      });
    });
    describe(`expands object with 'object' JSON Schema keywords when keyword`, function () {
      it(`is 'properties', 'additionalProperties', 'minProperties', 'maxProperties', 'patternProperties', 'dependencies', or 'required'`, function () {
        const shorthand = {
          $properties: {
            label: {
              $type: 'string'
            },
            modifiers: {
              $enum: ['large', 'small']
            }
          },
          $patternProperties: {
            '^S_': {
              $type: 'string'
            },
            '^I_': {
              $type: 'integer'
            }
          },
          $additionalProperties: false,
          $required: ['label'],
          $minProperties: 2,
          $maxProperties: 3,
          $dependencies: {
            modifiers: ['label']
          }
        };
        const expanded = {

          properties: {
            label: {
              type: 'string'
            },
            modifiers: {
              enum: ['large', 'small']
            }
          },
          patternProperties: {
            '^S_': {
              type: 'string'
            },
            '^I_': {
              type: 'integer'
            }
          },
          additionalProperties: false,
          required: ['label'],

          minProperties: 2,
          maxProperties: 3,
          dependencies: {
            modifiers: ['label']
          }

        };
        testParser(shorthand, expanded);
      });
      it(`has nested 'properties', 'additionalProperties', 'minProperties', 'maxProperties', 'patternProperties', 'dependencies', or 'required'`, function () {
        const shorthand = {
          objects1: {
            $properties: {
              label: {
                $type: 'string'
              }
            },
            $additionalProperties: false,
            $required: ['label']
          },
          objects2: {
            $properties: {
              label: {
                $type: 'string'
              },
              modifiers: {
                $enum: ['large', 'small']
              }
            },
            $minProperties: 2,
            $maxProperties: 3,
            $dependencies: {
              modifiers: ['label']
            }
          },
          objects3: {
            $patternProperties: {
              '^S_': {
                $type: 'string'
              },
              '^I_': {
                $type: 'integer'
              }
            }
          }
        };
        const expanded = {
          properties: {
            objects1: {
              properties: {
                label: {
                  type: 'string'
                }
              },
              additionalProperties: false,
              required: ['label']
            },
            objects2: {
              properties: {
                label: {
                  type: 'string'
                },
                modifiers: {
                  enum: ['large', 'small']
                }
              },
              minProperties: 2,
              maxProperties: 3,
              dependencies: {
                modifiers: ['label']
              }
            },
            objects3: {
              patternProperties: {
                '^S_': {
                  type: 'string'
                },
                '^I_': {
                  type: 'integer'
                }
              }
            }
          }
        };
        testParser(shorthand, expanded);
      });
    });
    describe(`expands object with 'array' JSON Schema keywords when keyword`, function () {
      it(`is 'items', 'minItems', 'maxItems', or 'uniqueItems'`);
    });
  });
});

function testParser(shorthand, expected, base = {}) {
  const parser = getParser();
  const result = parser.parse(shorthand, base);
  // console.log(result);
  const expanded = Object.assign({}, baseExpandedSchema(base), expected);
  expect(result).to.deep.equal(expanded);
}
