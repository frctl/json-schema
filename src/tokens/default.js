module.exports = function defaultToken() {
  return {
    match: function match(value) {
      return /^string$|^boolean$|^number$|^integer$|^object$|^array$|^null$/.test(value);
    },
    expand: function defaultExpansion(value) {
      return {
        type: value
      };
    }
  };
};
