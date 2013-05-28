require('./vendor/rangy-core');  // Just a shim, so we get a 'rangy' global object
require('./vendor/rangy-cssclassapplier');
require('./vendor/rangy-highlighter');

module.exports = Commentator;

function Commentator(rootNodeId) {
  var template = require('./template');
  var d = document,
      div = d.createElement('div');

  div.innerHTML = template;
  var templ = div.firstChild;

  rangy.init();

  var highlighter = rangy.createHighlighter();
  var classApplier = rangy.createCssClassApplier('someClass', {ignoreWhiteSpace: false, normalize: true})
  highlighter.addClassApplier(classApplier);
  highlighter.deserialize('type:textContent|87$285$1$someClass$')

  d.body.onmouseup = function(e) {
    var popover = d.getElementById('commentator');
    if (popover) {
      d.body.removeChild(templ);
    }
    highlighter.highlightSelection('someClass');
    var text = rangy.getSelection().toString();
    d.body.appendChild(templ);
    console.log(e);
  };
}
