require('sockjs');
require('./vendor/rangy-core');
require('./vendor/rangy-cssclassapplier');
require('./vendor/rangy-highlighter');
require('./vendor/rangy-textrange');

module.exports = Commentator;

function Dialog(highlighter, sock) {
  this.highlighter = highlighter;
  this.sock = sock;
  this.id = 'commentator';
  var template = require('./template'),
      div = document.createElement('div');
  div.id = this.id;
  div.innerHTML = template;

  this.templ = div;
}

Dialog.prototype.show = function(e) {
  var self = this;
  if (e) {
    this.templ.style.top = e.pageY - 11;
    this.templ.style.left = e.pageX + 4;
  }

  document.body.appendChild(this.templ);

  document.getElementById('commentator-ta').onkeyup = function(e) {
    e = e || window.event;

    if (e.keyCode == 13) {
      var rangesEle = document.getElementById('commentator-ranges');
      var nodeEle = document.getElementById('commentator-node');

      var ranges = JSON.parse(rangesEle.value);
      var node = nodeEle.value;

      new Comment(ranges, this.value, node, self.highlighter, self.sock).send();

      this.value = '';
      self.hide();
      return false;
    }
  };
};

Dialog.prototype.getElement = function() {
  return (document.getElementById(this.id));
};

Dialog.prototype.hide = function () {
  if (this.getElement()) {
    document.body.removeChild(this.templ);
  }
};

function Comment(ranges, text, node, highlighter, sock) {
  this.text = text;
  this.context = ranges;
  this.sock = sock;
  this.node = node;

  var nodeEle = document.getElementById(node);
  var selection = rangy.getSelection().restoreCharacterRanges(nodeEle, ranges);
  highlighter.highlightSelection('someClass', selection);
  rangy.getSelection().removeAllRanges();

  document.getElementById("comment-clickable").onclick = function(e) {
    console.log(e);
    // I need to tie back this event to the thread somehow
  };
}

Comment.prototype.send = function() {
  this.sock.send(JSON.stringify({
    context: JSON.stringify(this.context),
    text: this.text,
    node: this.node
  }));
};

function Commentator(idArr) {
  var sock = new SockJS('http://localhost:9999/sock');

  rangy.init();

  var highlighter = rangy.createHighlighter(document, 'TextRange'),
      classApplier = rangy.createCssClassApplier('someClass', {
        ignoreWhiteSpace: false,
        normalize: true,
        elementProperties: {
          id: "comment-clickable"
        }
      });

  var dialog = new Dialog(highlighter, sock);

  highlighter.addClassApplier(classApplier);

  var omu = function(e) {
    var selection = rangy.getSelection(),
        selected = selection.anchorOffset !== selection.focusOffset;

    if (selected) {
      dialog.show(e);

      var ranges = selection.saveCharacterRanges(this);

      var rangesEle = document.getElementById('commentator-ranges');
      var nodeEle = document.getElementById('commentator-node');

      rangesEle.value = JSON.stringify(ranges);
      nodeEle.value = e.currentTarget.id;
    } else {
      dialog.hide();
    }
  };

  for (var i=0; i < idArr.length; i++) {
    document.getElementById(idArr).onmouseup = omu;
  }


  sock.onopen = function() {
    console.log('connected');
  };

  sock.onmessage = function(e) {
    var data = JSON.parse(e.data);
    var ranges = JSON.parse(data.context);
    console.log(data);
    new Comment(ranges, data.text, data.node, highlighter, sock);
  };
}
