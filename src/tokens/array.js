const check = require('check-types');
const object = require('./object');

function convertArrayToObject(array) {
  return array
    .map(property => ({
      [property]: 'string'
    }))
    .reduce((memo, value) => (Object.assign(memo, value)), {});
}

module.exports = function (expandPropertyObject) {
  return {
    match: function match(type) {
      return check.array(type);
    },
    expand: function arrayExpansion(value) {
      const objectExpansion = object(expandPropertyObject).expand;
      return objectExpansion(convertArrayToObject(value));
    }
  };
};
