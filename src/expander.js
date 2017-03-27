/* eslint-disable no-warning-comments */
const check = require('check-types');
const _ = require('lodash');

const assert = check.assert;

const reservedAndRepl = ['$id', '$description', '$title', '$default', '$enum', '$type', // generic keywords
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
    if (!(check.array.of.function(generatorOrList) || check.function(generatorOrList))) {
      assert(false, `Expander.registerGenerators: 'generatorOrList' must be a function or array of functions that return an object with a 'key' property and 'generate' method [generators-invalid]`, TypeError);
    }
    let boundExpander = this.expandObject.bind(this);
    let localGenerators = [].concat(generatorOrList).map(generator => generator(boundExpander));
    generators.set(this, generators.get(this).concat(localGenerators));
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

    // console.log(`
    //     reserved: ${JSON.stringify(reserved)}
    //     initial: ${JSON.stringify(initial)}
    //     processed: ${JSON.stringify(processed)}
    //     remainder: ${JSON.stringify(remainder)}
    //     expanded: ${JSON.stringify(expanded)}
    //     `);

    return Object.assign(_memo, base, expanded);
  }

  withoutReservedProps(obj) {
    return _.omit(obj, [].concat(reservedAndRepl, reserved));
  }

  onlyReservedProps(obj) {
    return _.pick(obj, reserved);
  }

  onlyReservedAndReplProps(obj) {
    return _.pick(obj, reservedAndRepl);
  }

}

const defaultReduce = (memo, val) => {
  return Object.assign({}, memo, val);
};

module.exports = Expander;
