/* eslint-disable no-warning-comments */
const check = require('check-types');
const Expander = require('./expander');

const assert = check.assert;

const schemaDuck = {
  $schema: 'http://json-schema.org/schema#'
};

let expanders = new WeakMap();

/**
 * A Condensed JSON Schema Parser.
 * @class Parser
 */
class Parser {

  /**
   * Creates a Parser instance.
   * @constructor
   * @param {object} config - A configuration object.
   */
  constructor(config) {
    if (check.null(config) || check.undefined(config)) {
      assert(false, `Parser.constructor: 'config' must be an object with an 'expander' property [config-invalid]`, TypeError);
    }
    assert.like(config, {
      expander: new Expander()
    }, `Parser.constructor: 'config' must be an object with an 'expander' property [config-invalid]`);
    expanders.set(this, config.expander);
  }

  parse(shorthand, base) {
    assert.maybe.object(base, `Parser.parse: 'base' must be an object [base-invalid]`);
    if (check.object(shorthand)) {
      return this.parseObject(shorthand, base);
    }
    if (check.array(shorthand)) {
      return this.parseArray(shorthand, base);
    }

    assert(false, `Parser.parse: 'shorthand' must be an object or an array [shorthand-invalid]`, TypeError);
  }

  parseObject(shorthand, base) {
    assert.maybe.object(base, `Parser.parse: 'base' must be an object [base-invalid]`);
    if (check.like(shorthand, schemaDuck)) {
      return shorthand;
    }

    return Object.assign(createBaseSchema(base), expanders.get(this).expandObject(shorthand));
  }

  parseArray(shorthand, base) {
    assert.maybe.object(base, `Parser.parse: 'base' must be an object [base-invalid]`);
    assert.array.of.string(shorthand, `Parser.parse: 'shorthand' array must consist of strings only [shorthand-array-invalid]`);

    return Object.assign(createBaseSchema(base), expanders.get(this).getExpansionForValue(shorthand));
  }
}

function createBaseSchema(base = {}) {
  return Object.assign({
    $schema: 'http://json-schema.org/schema#'
  }, base);
}

module.exports = Parser;
