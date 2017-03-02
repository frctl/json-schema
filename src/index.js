/* eslint-disable no-warning-comments */
const check = require('check-types');
const expander = require('./expander')();
// const objectExpansion = require('./tokens').objectExpansion;
// const arrayExpansion = require('./tokens').arrayExpansion;

const assert = check.assert;

const schemaDuck = {
  $schema: 'http://json-schema.org/schema#'
};

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
    assert.maybe.object(config, `Parser.constructor: 'config' must be an object [config-invalid]`);
  }

  parse(shorthand, id) {
    assert.maybe.string(id, `Parser.parse: 'id' must be a string [id-invalid]`);
    if (check.object(shorthand)) {
      return this.parseObject(shorthand, id);
    }
    if (check.array(shorthand)) {
      return this.parseArray(shorthand, id);
    }

    assert(false, `Parser.parse: 'shorthand' must be an object or an array [shorthand-invalid]`, TypeError);
  }

  parseObject(shorthand, id) {
    assert.maybe.string(id, `Parser.parse: 'id' must be a string [id-invalid]`);
    if (check.like(shorthand, schemaDuck)) {
      return shorthand;
    }

    return Object.assign(createBaseSchema(id), expander.objectExpansion(shorthand));
  }

  parseArray(shorthand, id) {
    assert.maybe.string(id, `Parser.parse: 'id' must be a string [id-invalid]`);
    assert.array.of.string(shorthand, `Parser.parse: 'shorthand' array must consist of strings only [shorthand-array-invalid]`);

    return Object.assign(createBaseSchema(id), expander.arrayExpansion(shorthand));
  }
}

function createBaseSchema(id) {
  let schema = {
    $schema: 'http://json-schema.org/schema#'
  };
  if (id) {
    schema.id = id;
  }
  return schema;
}

module.exports = Parser;
