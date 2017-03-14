const Expander = require('./expander');
const Parser = require('./parser');

const defaultToken = require('./tokens/default');
const objectToken = require('./tokens/object');
const enumToken = require('./tokens/enum');

module.exports = function () {
  const expander = new Expander({tokens: [defaultToken, objectToken, enumToken]});
  return new Parser({expander});
};
