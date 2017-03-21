const _ = require('lodash');

function expand(key, val) {
  if (val) {
    return val.map(ref => ({
      $ref: ref
    }));
  }

  return [];
}

function generate(propsExpander, base, remainder) {
  if (remainder.$include) {
    let list = _.flatten(Object.keys(remainder)
      .filter(key => {
        return key === '$include';
      })
      .map(key => {
        let allOf = expand(key, remainder[key]);
        delete remainder[key];
        return allOf;
      }));

    let expandedProps = propsExpander.generate(base, remainder);

    if (expandedProps && !_.isEmpty(expandedProps)) {
      list.push({
        properties: expandedProps
      });
      Object.keys(remainder).forEach(key => (delete remainder[key]));
    }

    return list;
  }
}

module.exports = function (propsExpander, boundObjectExpander) {
  return {
    key: 'allOf',
    generate: generate.bind(null, propsExpander(boundObjectExpander))
  };
};
