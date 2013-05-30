var io = require('./vendor/socket.io-client');
require('./vendor/rangy-core');  // Just a shim, so we get a 'rangy' global object
require('./vendor/rangy-cssclassapplier');
require('./vendor/rangy-highlighter');
require('./vendor/rangy-textrange');

module.exports = Commentator;

function Commentator() {
  var socket = io.connect('http://localhost:8080');

  var template = require('./template'),
      d = document,
      div = d.createElement('div');

  div.id = 'commentator';
  div.innerHTML = template;
  var templ = div;

  rangy.init();

  var highlighter = rangy.createHighlighter(document, 'TextRange'),
      classApplier = rangy.createCssClassApplier('someClass', {ignoreWhiteSpace: false, normalize: true});

  highlighter.addClassApplier(classApplier);
  highlighter.deserialize('type:TextRange|457$668$1$someClass$');

  d.getElementById('content').onmouseup = function(e) {
    var popover = d.getElementById('commentator');
    if (popover) {
      d.body.removeChild(templ);
    }
    highlighter.highlightSelection('someClass');
    var sel = highlighter.serialize();
    socket.emit('comment', {serialized: sel});
    //d.body.appendChild(templ);
    //templ.style.top = e.pageY - 11;
    //templ.style.left = e.pageX + 4;
    //console.log(e);
  };

  socket.on('add-comment', function(data) {
    highlighter.deserialize(data.serialized);
  });
}
