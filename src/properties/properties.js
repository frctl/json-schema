const check = require('check-types');

const defaultExpansion = require('../tokens/default')().expand;

const assert = check.assert;

const defaultReduce = (memo, val) => {
  return Object.assign({}, memo, val);
};

let tokens = new WeakMap();

class PropertyGenerator {
  constructor(opts = {}) {
    this.key = 'properties';
    tokens.set(this, []);
    assert.function(opts.expandObject);

    if (opts.expandObject) {
      this.expandObject = opts.expandObject;
    }
    if (opts.tokens) {
      this.registerTokens(opts.tokens);
    }
  }

  get tokensLength() {
    return tokens.get(this).length;
  }

  registerTokens(tokenOrList) {
    if (!(check.array.of.function(tokenOrList) || check.function(tokenOrList))) {
      assert(false, `PropertyGenerator.registerTokens: 'tokenOrList' must be a function or array of functions that return an object with 'match' and 'expand' methods [tokens-invalid]`, TypeError);
    }
    let localTokens = [].concat(tokenOrList).map(token => token(this.expandObject));
    tokens.set(this, tokens.get(this).concat(localTokens));
  }

  getExpansionForValue(value, parent) {
    let expansion = tokens.get(this)
      .filter(token => token.match(value))
      .map(token => token.expand)
      .reduce((m, value) => value, '');

    if (check.string(value) && check.emptyString(expansion)) {
      console.warn(`PropertyGenerator.getExpansionForValue: No token was found for '${value.toString()}'`);
    }
    expansion = expansion || defaultExpansion;

    return expansion(value, parent);
  }

  expandForProperty(key, value = 'string') {
    return {
      [key]: this.getExpansionForValue(value)
    };
  }

  generate(base, remainder) {
    return Object.keys(remainder)
      .map(key => this.expandForProperty(key, remainder[key]))
      .reduce(defaultReduce, {});
  }
}

module.exports = function (tokens, expandObject) {
  const propertyGenerator = new PropertyGenerator({
    expandObject,
    tokens
  });
  return propertyGenerator;
};
