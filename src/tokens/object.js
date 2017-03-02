const check = require('check-types');

module.exports = function (expandPropertyObject) {
  return {
    match: function match(type) {
      return check.object(type);
    },
    expand: function objectExpansion(value) {
      let expanded = {
        type: 'object'
      };
      let props = expandPropertyObject(value, {});
      if (!check.emptyObject(props)) {
        expanded.properties = props;
      }
      return expanded;
    }
  };
};
