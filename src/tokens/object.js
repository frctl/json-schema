const check = require('check-types');
const _ = require('lodash');

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
