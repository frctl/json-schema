/* eslint-disable no-warning-comments */
const check = require('check-types');
const Expander = require('./expander');

const assert = check.assert;

const schemaDuck = {
  $schema: 'string'
};

let expanders = new WeakMap();

/**
 * A Condensed JSON Schema Expander.
 * @class SchemaExpander
 */
class SchemaExpander {

  /**
   * Creates a SchemaExpander instance.
   * @constructor
   * @param {object} config - A configuration object.
   */
  constructor(config) {
    if (check.null(config) || check.undefined(config)) {
      assert(false, `SchemaExpander.constructor: 'config' must be an object with an 'expander' property [config-invalid]`, TypeError);
    }
    assert.like(config, {
      expander: new Expander()
    }, `SchemaExpander.constructor: 'config' must be an object with an 'expander' property [config-invalid]`);
    expanders.set(this, config.expander);
  }

  expand(shorthand, base) {
    assert.maybe.object(base, `SchemaExpander.parse: 'base' must be an object [base-invalid]`);
    assert.object(shorthand, `SchemaExpander.parse: 'shorthand' must be an object [shorthand-invalid]`, TypeError);

    if (check.like(shorthand, schemaDuck)) {
      return shorthand;
    }
    return expanders.get(this).expandObject(Object.assign(createBaseSchema(base), shorthand));
  }
}

function createBaseSchema(base = {}) {
  return Object.assign({
    $schema: 'http://json-schema.org/schema#',
    $type: 'object'
  }, base);
}

module.exports = SchemaExpander;
