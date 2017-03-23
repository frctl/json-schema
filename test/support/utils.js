const baseSchema = base => {
  return Object.assign({
    $schema: 'http://json-schema.org/schema#'
  }, base, {
    $type: 'object'
  });
};
const baseExpandedSchema = base => {
  return Object.assign({
    $schema: 'http://json-schema.org/schema#'
  }, base, {
    type: 'object'
  });
};

module.exports = {
  baseSchema,
  baseExpandedSchema
};
