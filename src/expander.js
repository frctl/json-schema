/* eslint-disable no-warning-comments */
// const check = require('check-types');

let tokens = new WeakMap();

class Expander {

  constructor(opts = {}) {
    tokens.set(this, []);

    if (opts.tokens) {
      this.addTokens(opts.tokens);
    }
  }

  addTokens(token) {
    // TODO: error handling
    let boundPropertyExpander = this.expandPropertyObject.bind(this);
    let localTokens = [].concat(token).map(token => token(boundPropertyExpander));
    tokens.set(this, tokens.get(this).concat(localTokens));
  }

  getExpansionForValue(value) {
    let expansion = tokens.get(this)
      .filter(token => token.match(value))
      .map(token => token.expand)
      .reduce((m, value) => value, '');

    expansion = expansion || this.defaultExpansion;
    // TODO: warn if token not found

    return expansion(value);
  }

  expandSingleProperty(key, value = 'string') {
    return {
      [key]: this.getExpansionForValue(value)
    };
  }

  expandPropertyObject(object, _memo) {
    return Object.keys(object)
      .map(key => this.expandSingleProperty(key, object[key]))
      .reduce((memo, value) => {
        return Object.assign(memo, value);
      }, _memo);
  }

  defaultExpansion(type) {
    return {
      type: type
    };
  }
}

module.exports = Expander;
