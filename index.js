require('sockjs');
require('./vendor/rangy-core');
require('./vendor/rangy-cssclassapplier');
require('./vendor/rangy-highlighter');
require('./vendor/rangy-textrange');

module.exports = Commentator;

function Commentator() {
  var sock = new SockJS('http://localhost:9999/sock'),
      template = require('./template'),
      d = document,
      div = d.createElement('div');

  div.id = 'commentator';
  div.innerHTML = template;
  var templ = div;

  rangy.init();

  var highlighter = rangy.createHighlighter(document, 'TextRange'),
      classApplier = rangy.createCssClassApplier('someClass', {ignoreWhiteSpace: false, normalize: true});

  highlighter.addClassApplier(classApplier);

  d.getElementById('content').onmouseup = function(e) {
    var selection = rangy.getSelection(),
        selected = selection.anchorOffset !== selection.focusOffset;

    if (selected) {
      highlighter.highlightSelection('someClass', selection);
      var serialized = highlighter.serialize(selection);

      d.body.appendChild(templ);
      templ.style.top = e.pageY - 11;
      templ.style.left = e.pageX + 4;

      document.getElementById('commentator-ta').onkeyup = function(e) {
        e = e || window.event;

        if (e.keyCode == 13) {
          d.body.removeChild(templ);

          sock.send(JSON.stringify({selection: serialized,
                                    comment: this.value}));
          this.value = '';
          return false;
        }
      };
    }
  };

  sock.onopen = function() {
    console.log('connected');
  };

  sock.onmessage = function(e) {
    console.log(JSON.parse(e.data));
    highlighter.deserialize(JSON.parse(e.data).selection);
  };
}
