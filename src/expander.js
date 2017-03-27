/* eslint-disable no-warning-comments */
const check = require('check-types');
const _ = require('lodash');

const assert = check.assert;

const namespaced = ['$id', '$description', '$title', '$default', '$enum', '$type', // generic keywords
  '$multipleOf', '$minimum', '$maximum', '$exclusiveMinimum', '$exclusiveMaximum', // numeric keywords
  '$minLength', '$maxLength', '$format', '$pattern', // string keywords
  '$properties', '$additionalProperties', '$minProperties', '$maxProperties', '$patternProperties', '$required', '$dependencies', // object keywords
  '$items', '$minItems', '$maxItems', '$uniqueItems' // array keywords
];
const reserved = ['$schema'];

let generators = new WeakMap();

class Expander {

  constructor(opts = {}) {
    assert.maybe.object(opts, `Expander.constructor: 'opts' must be an object [opts-invalid]`, TypeError);

    generators.set(this, []);

    if (opts && opts.generators) {
      this.registerGenerators(opts.generators);
    }
  }

  get generatorsLength() {
    return generators.get(this).length;
  }

  registerGenerators(generatorOrList) {
    const errorMsg = `Expander.registerGenerators: 'generatorOrList' must be an object or array of objects, each with a 'key' property and 'generate' method [generators-invalid]`;

    assert(Boolean(generatorOrList), errorMsg, TypeError);
    generatorOrList = [].concat(generatorOrList);

    let vals = check.all(generatorOrList.map(gen => {
      return check.object(gen) && check.all(check.map(gen, {
        key: check.string,
        generate: check.function
      }));
    }));

    assert(vals, errorMsg, TypeError);

    generators.set(this, generators.get(this).concat(generatorOrList));
  }

  getBaseObject(base) {
    return Object.assign({}, base);
  }

  assignProperty(ob, key, value) {
    if (value && !_.isEmpty(value)) {
      return Object.assign({}, ob, {
        [key]: value
      });
    }
    return ob;
  }

  processRecursive(initial) {
    return Object.keys(initial).reduce((memo, key) => {
      const newKey = key.replace('$', '');
      const value = initial[key];
      if (check.object(value)) {
        memo[newKey] = this.processRecursive(value);
      } else if (check.array(value)) {
        memo[newKey] = value.map(item => {
          if (check.object(item)) {
            return this.processRecursive(item);
          }
          return item;
        });
      } else {
        memo[newKey] = value;
      }

      return memo;
    }, {});
  }
  getExpandMethod() {
    return this.expandObject.bind(this);
  }
  expandObject(object, _memo = {}) {
    const reserved = this.onlyReservedProps(object);
    const initial = this.onlyReservedAndReplProps(object);
    const remainder = this.withoutReservedProps(object);

    const processed = this.processRecursive(initial);

    const base = Object.assign({}, reserved, processed);

    const additionalProps = generators.get(this);

    let expanded = additionalProps
      .map(generator => {
        let val = generator.generate(base, remainder);
        return this.assignProperty({}, generator.key, val);
      })
      .reduce(defaultReduce, {});

    return Object.assign(_memo, base, expanded);
  }

  withoutReservedProps(obj) {
    return _.omit(obj, [].concat(namespaced, reserved));
  }

  onlyReservedProps(obj) {
    return _.pick(obj, reserved);
  }

  onlyReservedAndReplProps(obj) {
    return _.pick(obj, namespaced);
  }

}

const defaultReduce = (memo, val) => {
  return Object.assign({}, memo, val);
};

module.exports = Expander;
