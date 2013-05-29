require('./vendor/rangy-core');  // Just a shim, so we get a 'rangy' global object
require('./vendor/rangy-cssclassapplier');
require('./vendor/rangy-highlighter');
require('./vendor/rangy-textrange');

module.exports = Commentator;

function Commentator() {
  var template = require('./template');
  var d = document,
      div = d.createElement('div');

  div.innerHTML = template;
  var templ = div.firstChild;

  rangy.init();

  var highlighter = rangy.createHighlighter(document, 'TextRange');
  var classApplier = rangy.createCssClassApplier('someClass', {ignoreWhiteSpace: false, normalize: true})
  highlighter.addClassApplier(classApplier);
  highlighter.deserialize('type:TextRange|457$668$1$someClass$')

  d.body.onmouseup = function(e) {
    var popover = d.getElementById('commentator');
    if (popover) {
      d.body.removeChild(templ);
    }
    highlighter.highlightSelection('someClass');
    console.log(highlighter.serialize());
    var text = rangy.getSelection().toString();
    d.body.appendChild(templ);
    console.log(e);
  };
}
