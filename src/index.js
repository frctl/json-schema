const Expander = require('./expander');
const Parser = require('./parser');

const defaultTokenFactory = require('./tokens/default');
const objectTokenFactory = require('./tokens/object');
const enumTokenFactory = require('./tokens/enum');

const propertiesGenFactory = require('./properties/properties');
const dependenciesGenFactory = require('./properties/dependencies');
const typeGenFactory = require('./properties/type');

module.exports = function () {
  const propsGenFactory = propertiesGenFactory.bind(null, [defaultTokenFactory, objectTokenFactory, enumTokenFactory]);
  const expander = new Expander({generators: [dependenciesGenFactory, propsGenFactory, typeGenFactory]});
  return new Parser({expander});
};
