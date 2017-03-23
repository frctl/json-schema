const check = require('check-types');

module.exports = function objectToken(expandObject) {
  return {
    match: function match(type) {
      return check.object(type);
    },
    expand: function objectExpansion(value) {
      return expandObject(value, {});
    }
  };
};
