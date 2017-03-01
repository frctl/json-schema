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
    assert.maybe.object(config, `Parser.constructor: config must be an object [config-invalid]`);
  }

  parse(shorthand) {
    if (!(check.object(shorthand) || check.array(shorthand))) {
      assert(false, `Parser.parse: shorthand must be an object or an array [shorthand-invalid]`, TypeError);
    }

    if (check.object(shorthand)) {
      return this.parseObject(shorthand);
    }
    if (check.array(shorthand)) {
      return this.parseArray(shorthand);
    }
  }

  parseObject(shorthand) {
    if (check.like(shorthand, schemaDuck)) {
      return shorthand;
    }
    if (check.emptyObject(shorthand)) {
      return createBaseSchema();
    }
  }

  parseArray(shorthand) {
    assert.array.of.string(shorthand, `Parser.parse: shorthand array must consist of strings only [shorthand-array-invalid]`);
    if (check.emptyArray(shorthand)) {
      return createBaseSchema();
    }
    let schema = createBaseSchema();

    schema.properties = shorthand
      .map(key => ({[key]: {type: 'string'}}))
      .reduce((memo, value) => {
        return Object.assign({}, memo, value);
      }, {});

    console.log(schema);

    return schema;
  }
}

function createBaseSchema() {
  return {
    $schema: 'http://json-schema.org/schema#',
    type: 'object'
  };
}

module.exports = Parser;
