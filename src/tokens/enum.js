const _ = require('lodash');

module.exports = function arrayEnumToken() {
  return {
    match: function match(value) {
      return _.isArray(value);
    },
    expand: function arrayEnumExpansion(array) {
      const type = array.map(item => typeof item)
        .reduce((lastType, currentType) => lastType === currentType ? currentType : null);
      const typeOb = type ? {
        type: type
      } : {};
      return Object.assign({}, typeOb, {
        enum: array
      });
    }
  };
};
