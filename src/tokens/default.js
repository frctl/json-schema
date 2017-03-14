module.exports = function defaultToken() {
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
