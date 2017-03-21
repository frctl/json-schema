/* eslint-disable no-warning-comments */
const check = require('check-types');
const _ = require('lodash');

const assert = check.assert;

const reserved = ['type', 'properties', 'dependencies', '$schema', 'id'];

let generators = new WeakMap();

class Expander {

  constructor(opts = {}) {
    generators.set(this, []);

    if (opts.generators) {
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

  expandObject(object, _memo = {}) {
    const initial = this.onlyReservedProps(object);
    const remainder = this.withoutReservedProps(object);
    let expanded = {};

    const additionalProps = generators.get(this);

    expanded = additionalProps
      .map(generator => {
        let val = generator.generate(initial, remainder);
        return this.assignProperty({}, generator.key, val);
      })
      .reduce(defaultReduce, expanded);

    return Object.assign(_memo, initial, expanded);
  }

  withoutReservedProps(obj) {
    return _.omit(obj, reserved);
  }

  onlyReservedProps(obj) {
    return _.pick(obj, reserved);
  }

}

const defaultReduce = (memo, val) => {
  return Object.assign({}, memo, val);
};

module.exports = Expander;
