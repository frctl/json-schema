const defaultReduce = (memo, val) => {
  return memo.concat(val);
};

function generate(base, remainder) {
  return Object.keys(remainder)
    .filter(key => {
      return remainder[key] && remainder[key].$required && remainder[key].$required === true;
    })
    .map(key => {
      delete remainder[key].$required;
      return key;
    })
    .reduce(defaultReduce, []);
}

module.exports = function () {
  return {
    key: 'required',
    generate: generate
  };
};
