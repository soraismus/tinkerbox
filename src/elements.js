function createElement(tag) {
  return function (config) {
    if (config == null) {
      config = {};
    }
    var element = { tag: tag };
    for (var key in config) {
      if (key === 'classes') {
        element.classes = config.classes;
      }
      if (key === 'style') {
        element.style = config.style;
      }
      if (key === 'attribs') {
        element.attribs = config.attribs;
      }
    }
    if (arguments.length > 1) {
      element.children = [].concat.apply([], [].slice.call(arguments, 1))
          
    }
    return element;
  };
}

var tags = {
  'A': true,
  'BUTTON': true,
  'CANVAS': true,
  'CODE': true,
  'DIV': true,
  'FOOTER': true,
  'FORM': true,
  'H1': true,
  'H2': true,
  'H3': true,
  'H4': true,
  'H5': true,
  'H6': true,
  'HEADER': true,
  'IMG': true,
  'LABEL': true,
  'LI': true,
  'LINK': true,
  'NAV': true,
  'NOSCRIPT': true,
  'OPTGROUP': true,
  'OPTION': true,
  'OUTPUT': true,
  'P': true,
  'PARAM': true,
  'PRE': true,
  'SCRIPT': true,
  'SECTION': true,
  'SELECT': true,
  'SOURCE': true,
  'SPAN': true,
  'STYLE': true,
  'TEXTAREA': true
};

var elementFactories = {};

for (var tagName in tags) {
  elementFactories[tagName] = createElement(tagName);
}

module.exports = elementFactories;
