const regex = /^(\w*)\[\]$|^array$/;

module.exports = function defaultToken() {
  return {
    match: function match(type) {
      return regex.test(type);
    },
    expand: function defaultExpansion(value) {
      const [, itemType] = regex.exec(value);
      const itemsObj = itemType ? {
        items: {
          type: itemType
        }
      } : {};

      return Object.assign({
        type: 'array'
      }, itemsObj);
    }
  };
};
