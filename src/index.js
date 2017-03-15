const Expander = require('./expander');
const Parser = require('./parser');

const defaultTokenFactory = require('./tokens/default');
const arrayTokenFactory = require('./tokens/array');
const objectTokenFactory = require('./tokens/object');
const enumTokenFactory = require('./tokens/enum');
const refsTokenFactory = require('./tokens/refs');

const propertiesGenFactory = require('./properties/properties');
const requiredGenFactory = require('./properties/required');
const dependenciesGenFactory = require('./properties/dependencies');
const typeGenFactory = require('./properties/type');

module.exports = function () {
  const propsGenFactory = propertiesGenFactory.bind(null, [defaultTokenFactory, arrayTokenFactory, enumTokenFactory, refsTokenFactory, objectTokenFactory]);
  const expander = new Expander({generators: [dependenciesGenFactory, requiredGenFactory, propsGenFactory, typeGenFactory]});
  return new Parser({expander});
};
