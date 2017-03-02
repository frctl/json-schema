/* eslint-disable no-warning-comments */
const check = require('check-types');

let tokens = new WeakMap();

class Expander {

  constructor() {
    let tkns = [];
    tkns.push({
      match: function (type) {
        return /^string$|^boolean$|^object$/.test(type);
      },
      expand: this.defaultExpansion
    });
    tkns.push({
      match: function (type) {
        return check.array(type);
      },
      expand: this.arrayExpansion.bind(this)
    });
    tkns.push({
      match: function (type) {
        return check.object(type);
      },
      expand: this.objectExpansion.bind(this)
    });
    this.addTokens(tkns);
  }

  addTokens(token) {
    // TODO: error handling
    tokens.set(this, (tokens.get(this) || []).concat([].concat(token)));
  }

  getExpansionForType(type) {
    let expansion = tokens.get(this)
      .filter(token => token.match(type))
      .map(token => token.expand)
      .reduce((m, value) => value, '');

    expansion = expansion || this.defaultExpansion;
    // TODO: warn if token not found

    return expansion(type);
  }

  expandSingleProperty(key, value = 'string') {
    return {
      [key]: this.getExpansionForType(value)
    };
  }

  expandPropertyObject(object, _memo) {
    return Object.keys(object)
      .map(key => this.expandSingleProperty(key, object[key]))
      .reduce((memo, value) => {
        return Object.assign(memo, value);
      }, _memo);
  }

  convertArrayToObject(array) {
    return array
      .map(property => ({
        [property]: 'string'
      }))
      .reduce((memo, value) => (Object.assign(memo, value)), {});
  }

  defaultExpansion(type) {
    return {
      type: type
    };
  }

  objectExpansion(value) {
    let expanded = {
      type: 'object'
    };
    let props = this.expandPropertyObject(value, {});
    if (!check.emptyObject(props)) {
      expanded.properties = props;
    }
    return expanded;
  }

  arrayExpansion(value) {
    return this.objectExpansion(this.convertArrayToObject(value));
  }

}

module.exports = function (options) {
  return new Expander(options);
};
