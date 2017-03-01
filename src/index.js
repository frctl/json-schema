/* eslint-disable no-warning-comments */
const check = require('check-types');

const assert = check.assert;

const schemaDuck = {
  $schema: 'http://json-schema.org/schema#'
};

const defaultObject = type => ({
  type: type
});

let tokens = [];
tokens.push({
  match: '^string$|^boolean$|^object$',
  expansion: defaultObject
});

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
    let schema = Object.assign(createBaseSchema(id), createBaseObject());

    if (check.emptyObject(shorthand)) {
      return schema;
    }

    schema.properties = expandPropertyObject(shorthand, {});
    return schema;
  }

  parseArray(shorthand, id) {
    assert.maybe.string(id, `Parser.parse: 'id' must be a string [id-invalid]`);
    assert.array.of.string(shorthand, `Parser.parse: 'shorthand' array must consist of strings only [shorthand-array-invalid]`);

    if (check.emptyArray(shorthand)) {
      return Object.assign(createBaseSchema(id), createBaseObject());
    }
    return this.parseObject(expandArrayToObject(shorthand), id);
  }
}

function getObjectForType(type) {
  let expansion;
  let token = tokens
    .filter(token => new RegExp(token.match).test(type))
    .reduce((m, value) => value, {});

  expansion = token.expansion;

  if (!expansion) {
    expansion = defaultObject;
    // TODO: warn that token not found
  }

  return expansion(type);
}

function expandProperty(key, type = 'string') {
  return {
    [key]: getObjectForType(type)
  };
}

function expandPropertyObject(object, _memo) {
  return Object.keys(object)
    .map(key => expandProperty(key, object[key]))
    .reduce((memo, value) => {
      return Object.assign({}, memo, value);
    }, _memo);
}

function expandArrayToObject(array) {
  return array
    .map(property => ({
      [property]: 'string'
    }))
    .reduce((memo, value) => (Object.assign(memo, value)), {});
}

function createBaseObject() {
  return {
    type: 'object'
  };
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
