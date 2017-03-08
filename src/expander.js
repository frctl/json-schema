/* eslint-disable no-warning-comments */
const check = require('check-types');
const _ = require('lodash');
const defaultExpansion = require('./tokens/default')().expand;

const assert = check.assert;

const reserved = ['type', 'properties', 'dependencies'];

let tokens = new WeakMap();

class Expander {

  constructor(opts = {}) {
    tokens.set(this, []);

    if (opts.tokens) {
      this.registerTokens(opts.tokens);
    }
  }

  get tokensLength() {
    return tokens.get(this).length;
  }

  registerTokens(tokenOrList) {
    if (!(check.array.of.function(tokenOrList) || check.function(tokenOrList))) {
      assert(false, `Expander.addTokens: 'tokenOrList' must be a function or array of functions that return an object with 'match' and 'expand' methods [tokens-invalid]`, TypeError);
    }
    let boundPropertyExpander = this.expandObject.bind(this);
    let localTokens = [].concat(tokenOrList).map(token => token(boundPropertyExpander));
    tokens.set(this, tokens.get(this).concat(localTokens));
  }

  getExpansionForValue(value, parent) {
    let expansion = tokens.get(this)
      .filter(token => token.match(value))
      .map(token => token.expand)
      .reduce((m, value) => value, '');

    if (check.string(value) && check.emptyString(expansion)) {
      console.warn(`Expander.getExpansionForValue: No token was found for '${value.toString()}'`);
    }
    expansion = expansion || defaultExpansion;

    return expansion(value, parent);
  }

  expandForDependency(key, val) {
    if (val) {
      return {
        [key]: [].concat(val)
      };
    }
    return;
  }

  expandForProperty(key, value = 'string') {
    return {
      [key]: this.getExpansionForValue(value)
    };
  }

  getBaseObject(base) {
    return Object.assign({}, base);
  }

  getDependencies(base, remainder) {
    return Object.keys(remainder)
      .filter(key => {
        return remainder[key] && remainder[key].dependencies;
      })
      .map(key => {
        let deps = this.expandForDependency(key, remainder[key].dependencies);
        delete remainder[key].dependencies;
        return deps;
      })
      .reduce(defaultReduce, {});
  }

  getProperties(base, remainder) {
    return Object.keys(remainder)
      .map(key => this.expandForProperty(key, remainder[key]))
      .reduce(defaultReduce, {});
  }

  getType(base, remainder) {
    let type = base.type || 'string';
    if (Object.keys(remainder).length > 0 && !base.type) {
      type = 'object';
    }
    return type;
  }

  assignProperty(ob, key, value) {
    if ((value && !check.object(value)) || check.nonEmptyObject(value)) {
      return Object.assign({}, ob, {
        [key]: value
      });
    }
    return ob;
  }

  expandObject(object, _memo = {}) {
    const base = this.onlyReservedProps(object);
    const remainder = this.withoutReservedProps(object);

    const additionalProps = [{
      key: 'dependencies',
      generate: this.getDependencies.bind(this)
    },
    {
      key: 'properties',
      generate: this.getProperties.bind(this)
    },
    {
      key: 'type',
      generate: this.getType.bind(this)
    }
    ];

    let obb = this.getBaseObject(base);

    obb = additionalProps
      .map(generator => {
        let val = generator.generate(base, remainder, obb);
        return this.assignProperty({}, generator.key, val);
      })
      .reduce(defaultReduce, obb);

    return Object.assign(_memo, obb);
  }

  withoutReservedProps(obj) {
    return _.omit(obj, [].concat(reserved));
  }

  onlyReservedProps(obj) {
    return _.pick(obj, reserved);
  }

}

const defaultReduce = (memo, val) => {
  return Object.assign({}, memo, val);
};

module.exports = Expander;
