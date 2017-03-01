const check = require('check-types');

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
    let schema = createBaseSchema(id);

    if (check.emptyObject(shorthand)) {
      return schema;
    }
  }

  parseArray(shorthand, id) {
    assert.maybe.string(id, `Parser.parse: 'id' must be a string [id-invalid]`);
    assert.array.of.string(shorthand, `Parser.parse: 'shorthand' array must consist of strings only [shorthand-array-invalid]`);
    let schema = createBaseSchema(id);

    if (check.emptyArray(shorthand)) {
      return schema;
    }

    schema.properties = expandPropertyArray(shorthand);
    return schema;
  }
}

function expandProperty(key, type = 'string') {
  return {
    [key]: {
      type: type
    }
  };
}

function expandPropertyArray(array) {
  return array
    .map(key => expandProperty(key))
    .reduce((memo, value) => {
      return Object.assign({}, memo, value);
    }, {});
}

function createBaseSchema(id) {
  let schema = {
    $schema: 'http://json-schema.org/schema#',
    type: 'object'
  };
  if (id) {
    schema.id = id;
  }
  return schema;
}

module.exports = Parser;
