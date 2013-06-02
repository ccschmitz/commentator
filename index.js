require('sockjs');
require('./vendor/rangy-core');
require('./vendor/rangy-cssclassapplier');
require('./vendor/rangy-highlighter');
require('./vendor/rangy-textrange');

module.exports = Commentator;

function Dialog() {
  this.id = 'commentator';
  var template = require('./template'),
      div = document.createElement('div');
  div.id = this.id;
  div.innerHTML = template;

  this.templ = div;
}

Dialog.prototype.show = function(e) {
  if (e) {
    this.templ.style.top = e.pageY - 11;
    this.templ.style.left = e.pageX + 4;
  }
  document.body.appendChild(this.templ);
};

Dialog.prototype.getElement = function() {
  return (document.getElementById(this.id));
};

Dialog.prototype.hide = function () {
  if (this.getElement()) {
    document.body.removeChild(this.templ);
  }
};

function Comment(selection, text, highlighter, sock) {
  this.text = text;
  this.selection = selection;
  this.sock = sock;
  highlighter.deserialize(selection);
  document.getElementById("comment-clickable").onclick = function(e) {
    console.log(e);
    // I need to tie back this event to the thread somehow
  };
}

Comment.prototype.send = function() {
  this.sock.send(JSON.stringify({
    selection: this.selection,
    comment: this.text
  }));
};

function Commentator() {
  var sock = new SockJS('http://localhost:9999/sock'),
      dialog = new Dialog();

  rangy.init();

  var highlighter = rangy.createHighlighter(document, 'TextRange'),
      classApplier = rangy.createCssClassApplier('someClass', {
        ignoreWhiteSpace: false,
        normalize: true,
        elementProperties: {
          id: "comment-clickable"
        }
      });

  highlighter.addClassApplier(classApplier);

  document.getElementById('content').onmouseup = function(e) {
    var selection = rangy.getSelection(),
        selected = selection.anchorOffset !== selection.focusOffset;

    var ranges = selection.saveCharacterRanges(this);

    if (selected) {
      dialog.show(e);

      highlighter.highlightSelection('someClass', selection);
      var serialized = highlighter.serialize(selection);
      highlighter.unhighlightSelection(selection);

      var selNode = document.getElementById('commentator-selection');
      selNode.value = serialized;

      document.getElementById('commentator-ta').onkeyup = function(e) {
        e = e || window.event;

        if (e.keyCode == 13) {
          dialog.hide();

          console.log(selNode.value);
          new Comment(selNode.value, this.value, highlighter, sock).send();

          this.value = '';
          return false;
        }
      };
    } else {
      dialog.hide();
    }
  };

  sock.onopen = function() {
    console.log('connected');
  };

  sock.onmessage = function(e) {
    var data = JSON.parse(e.data);
    console.log(data);
    new Comment(data.selection, data.comment, highlighter, sock);
  };
}
