function generate(base, remainder) {
  let type = base.type || 'string';
  if (Object.keys(remainder).length > 0 && !base.type) {
    type = 'object';
  }
  return type;
}

module.exports = function () {
  return {
    key: 'type',
    generate: generate
  };
};
