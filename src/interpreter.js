function attachElement(parent, element) {
  if (isString(element)) {
    parent.innerText = element;
  } else {
    parent.appendChild(element);
  }
}

function createAndAttachElement(parent, config) {
  attachElement(parent, createElement(config));
}

function createElement(config) {
  if (isString(config)) {
    return config;
  }
  var node = document.createElement(config.tag);
  if (config.id != null) {
    node.id = config.id;
  }
  if (config.classes != null) {
    for (var klass in config.classes) {
      node.classList.add(klass);
    }
  }
  if (config.attribs != null) {
    for (var attribKey in config.attribs) {
      if (attribKey !== 'style') {
        node.setAttribute(attribKey, config.attribs[attribKey]);
      }
    }
  }
  if (config.style != null) {
    for (var styleKey in config.style) {
      node.style[styleKey] = config.style[styleKey];
    }
  }
  if (config.children != null) {
    config.children.forEach(function (newConfig, index) { 
      createAndAttachElement(node, newConfig);
    });
  }
  return node;
}

function findChild(parent, config) {
  switch (config.mode) {
    case 'id':
      return document.getElementById(config.key);
    case 'class':
      return parent.getElementsByClassName(config.key.class)[config.key.index];
    case 'tag':
      return parent.getElementsByTagName(config.key.tag)[config.key.index];
    case 'query':
      return parent.querySelectorAll(config.key.query)[config.key.index];
    case 'index':
      return parent.childNodes[config.key];
    default:
      throw new Error('Invalid \"findChild\" mode');
  }
}

function findChildren(parent, config) {
  var htmlCollection;
  switch (config.mode) {
    case 'class':
      htmlCollection = parent.getElementsByClassName(config.key.class);
      break;
    case 'tag':
      htmlCollection = parent.getElementsByTagName(config.key.tag);
      break;
    case 'query':
      htmlCollection = parent.querySelectorAll(config.key.query);
      break;
    default:
      throw new Error('Invalid \"findChild\" mode');
  }
  return Array.prototype.slice.call(htmlCollection);
}

function isDiff(value) {
  return isNaN(parseInt(value, 10));
}

function isNaN(value) {
  return isNumber(value) && value !== +value;
}

function isNumber(value) {
  return {}.toString.call(value) === '[object Number]';
}

function isString(value) {
  return {}.toString.call(value) === '[object String]';
}

function modifyElement(node, patch) {
  _modifyElement(node, patch.value, patch.commands);
}

function _modifyElement(node, tree, commands) {
  for (var i = 0; i < tree.length; i++) {
    var key = tree[i].index;
    var continuation = tree[i].value;

    switch (key) {
      case 'id':
        break;

      case 'tag':
        break;

      case 'style':
        for (var styleIndex = 0; styleIndex < continuation.length; styleIndex++) {
          var style = continuation[styleIndex].index;
          var command = commands[continuation[styleIndex].value];
          switch (command[0]) {
            case 'delete':
              node.style.removeProperty(style);
              break;
            case 'replace':
            case 'setAtKey':
              node.style[style] = command[1];
              break;
          }
        }
        break;

      case 'attribs':
        for (var attribIndex = 0; attribIndex < continuation.length; attribIndex++) {
          var attrib = continuation[attribIndex].index;
          var command = commands[continuation[attribIndex].value];
          switch (command[0]) {
            case 'delete':
              node.attributes.removeNamedItem(attrib);
              break;
            case 'replace':
            case 'setAtKey':
              node.setAttribute(attrib, command[1]);
              break;
          }
        }
        break;

      case 'classes':
        for (var classIndex = 0; classIndex < continuation.length; classIndex++) {
          var _class = continuation[classIndex].index;
          var command = commands[continuation[classIndex].value];
          switch (command[0]) {
            case 'delete':
              node.classList.remove(_class);
              break;
            case 'setAtKey':
              node.classList.add(_class);
              break;
          }
        }
        break;

      case 'children':
        for (var childIndex = 0; childIndex < continuation.length; childIndex++) {
          var child = continuation[childIndex].index;
          var childContinuation = continuation[childIndex].value;
          if (isDiff(childContinuation)) {
            _modifyElement(node.childNodes[child], childContinuation, commands);
          } else {
            var command = commands[childContinuation]
            switch (command[0]) {
              case 'delete':
              case 'remove':
                removeNode(findChild(node, { mode: 'index', key: child }));
                break;
              case 'replace':     // ?
                createAndAttachElement(node, command[1]);
                break;
              case 'insertAtEnd': // ?
              case 'setAtKey':    // ?
                createAndAttachElement(node, command[1]);
                break;
            }
          }
        }
        break;
    }
  }
}

function removeNode(node) {
  node.parentNode.removeChild(node);
}

module.exports = {
  createAndAttachElement: createAndAttachElement,
  modifyElement: modifyElement,
};
