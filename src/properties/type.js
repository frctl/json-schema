function generate(base, remainder) {
  let type = base.type || '';
  if (Object.keys(remainder).length > 0 && !type) {
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
