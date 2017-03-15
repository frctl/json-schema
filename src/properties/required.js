const defaultReduce = (memo, val) => {
  return memo.concat(val);
};

// function expand(key, val) {
//   if (val) {
//     return {
//       [key]: [].concat(val)
//     };
//   }
//   return;
// }

function generate(base, remainder) {
  return Object.keys(remainder)
    .filter(key => {
      return remainder[key] && remainder[key].required;
    })
    .map(key => {
      // let deps = expand(key, remainder[key].required);
      delete remainder[key].required;
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
