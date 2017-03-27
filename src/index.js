const Expander = require('./expander');
const SchemaExpander = require('./schema-expander');

const tokens = require('./tokens');
const properties = require('./properties');

module.exports = function () {
  const expander = new Expander();
  const expandMethod = expander.getExpandMethod();

  const defaultToken = tokens.default();
  const arrayToken = tokens.array();
  const enumToken = tokens.enum();
  const refsToken = tokens.refs();
  const objectToken = tokens.object(expandMethod);

  const dependenciesGenerator = properties.dependencies();
  const requiredGenerator = properties.required();
  const typeGenerator = properties.type();
  const customPropertiesGenerator = properties.custom({tokens: [defaultToken, arrayToken, enumToken, refsToken, objectToken]});
  const includeGenerator = properties.include(customPropertiesGenerator);
  // Order dependent
  expander.registerGenerators([dependenciesGenerator, requiredGenerator, includeGenerator, customPropertiesGenerator, typeGenerator]);

  return new SchemaExpander({expander});
};
