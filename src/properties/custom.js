const check = require('check-types');

const defaultExpansion = require('../tokens/default')().expand;

const assert = check.assert;

const defaultReduce = (memo, val) => {
  return Object.assign({}, memo, val);
};

let tokens = new WeakMap();

class CustomProperties {
  constructor(opts = {}) {
    this.key = 'properties';
    tokens.set(this, []);

    if (opts.tokens) {
      this.registerTokens(opts.tokens);
    }
  }

  get tokensLength() {
    return tokens.get(this).length;
  }

  registerTokens(tokenOrList) {
    const errorMsg = `CustomProperties.registerTokens: 'tokenOrList' must be an object or array of objects, each with 'match' and 'expand' methods [tokens-invalid]`;

    assert(Boolean(tokenOrList), errorMsg, TypeError);
    tokenOrList = [].concat(tokenOrList);

    let vals = check.all(tokenOrList.map(gen => {
      return check.object(gen) && check.all(check.map(gen, {
        match: check.function,
        expand: check.function
      }));
    }));

    assert(vals, errorMsg, TypeError);

    tokens.set(this, tokens.get(this).concat(tokenOrList));
  }

  getExpansionForValue(value, parent) {
    let expansion = tokens.get(this)
      .filter(token => token.match(value))
      .map(token => token.expand)
      .reduce((m, value) => value, '');

    if (check.string(value) && check.emptyString(expansion)) {
      console.warn(`CustomProperties.getExpansionForValue: No token was found for '${value.toString()}'; reverting to 'default'`);
    }
    expansion = expansion || defaultExpansion;

    return expansion(value, parent);
  }

  expand(key, value = 'string') {
    return {
      [key]: this.getExpansionForValue(value)
    };
  }

  generate(base, remainder) {
    return Object.keys(remainder)
      .map(key => this.expand(key, remainder[key]))
      .reduce(defaultReduce, {});
  }
}

module.exports = function ({tokens}) {
  const propertyGenerator = new CustomProperties({
    tokens
  });
  return propertyGenerator;
};
