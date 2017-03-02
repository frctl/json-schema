// const check = require('check-types');

module.exports = function (/* expandPropertyObject */) {
  return {
    match: function match(type) {
      return /^string$|^boolean$|^object$/.test(type);
    },
    expand: function defaultExpansion(value) {
      return {
        type: value
      };
    }
  };
};
