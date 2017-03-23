const _ = require('lodash');

const defaultReduce = (memo, val) => {
  return Object.assign({}, memo, val);
};

function expand(key, val) {
  if (val) {
    return {
      [key]: [].concat(val)
    };
  }
  return;
}

function generate(base, remainder) {
  return Object.keys(remainder)
    .filter(key => {
      let $deps = remainder[key] && remainder[key].$dependencies;
      return _.isString($deps) || _.isArray($deps);
    })
    .map(key => {
      let deps = expand(key, remainder[key].$dependencies);
      delete remainder[key].$dependencies;
      return deps;
    })
    .reduce(defaultReduce, {});
}

module.exports = function () {
  return {
    key: 'dependencies',
    generate: generate
  };
};
