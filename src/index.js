const Expander = require('./expander');
const Parser = require('./parser');

const defaultToken = require('./tokens/default');
const objectToken = require('./tokens/object');
const arrayToken = require('./tokens/array');

module.exports = function () {
  const expander = new Expander({tokens: [defaultToken, objectToken, arrayToken]});
  return new Parser({expander});
};
