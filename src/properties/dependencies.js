const defaultReduce = (memo, val) => {
  return Object.assign({}, memo, val);
};

function expandForDependency(key, val) {
  if (val) {
    return {
      [key]: [].concat(val)
    };
  }
  return;
}

function getDependencies(base, remainder) {
  return Object.keys(remainder)
    .filter(key => {
      return remainder[key] && remainder[key].dependencies;
    })
    .map(key => {
      let deps = expandForDependency(key, remainder[key].dependencies);
      delete remainder[key].dependencies;
      return deps;
    })
    .reduce(defaultReduce, {});
}

module.exports = function () {
  return {
    key: 'dependencies',
    generate: getDependencies
  };
};
