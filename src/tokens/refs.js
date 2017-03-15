const regex = /^@[\w-#/]+$/;

module.exports = function defaultToken() {
  return {
    match: function match(type) {
      return regex.test(type);
    },
    expand: function defaultExpansion(value) {
      return {
        $ref: value
      };
    }
  };
};
