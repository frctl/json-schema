const Expander = require('./expander');
const Parser = require('./parser');

const defaultTokenFactory = require('./tokens/default');
const arrayTokenFactory = require('./tokens/array');
const objectTokenFactory = require('./tokens/object');
const enumTokenFactory = require('./tokens/enum');
const refsTokenFactory = require('./tokens/refs');

const propertiesGenFactory = require('./properties/properties');
const requiredGenerator = require('./properties/required');
const dependenciesGenerator = require('./properties/dependencies');
const typeGenerator = require('./properties/type');
const includeGenFactory = require('./properties/include');

module.exports = function () {
  const propsGenerator = propertiesGenFactory.bind(null, [defaultTokenFactory, arrayTokenFactory, enumTokenFactory, refsTokenFactory, objectTokenFactory]);
  const includeGenerator = includeGenFactory.bind(null, propsGenerator);
  const expander = new Expander({generators: [dependenciesGenerator, requiredGenerator, includeGenerator, propsGenerator, typeGenerator]});
  return new Parser({expander});
};
