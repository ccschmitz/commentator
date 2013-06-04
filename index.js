// Persistency
// Store URL with Comments
// Timestamps
// Store user email address in localStore
// One level nested comments
// 

require('sockjs');
require('./vendor/rangy-core');
require('./vendor/rangy-cssclassapplier');
require('./vendor/rangy-highlighter');
require('./vendor/rangy-textrange');

module.exports = Commentator;

var sock = new SockJS('http://localhost:9999/sock');
sock.onopen = function() {
  // TODO load all comments from this page
  console.log('connected');
};
sock.onmessage = function(e) {
  var data = JSON.parse(e.data);
  var ranges = JSON.parse(data.context);
  console.log(data);
  var c = new Comment(ranges, data.text, data.node, sock);
  comments[c.nodeId] = c;
};

var comments = {};

var util = {
  overlaps_comment: function(characterRange, node) {
    var new_start = characterRange.start,
        new_end = characterRange.end;
    for (var id in comments) {
      if (comments[id].node !== node) {
        return false;
      }
      var old_start = comments[id].start,
          old_end = comments[id].end;
      // |---|
      // |---|
      // Start and ends both equal
      if (new_start == old_start && new_end == old_end) {
        return true;
      }
      // |-----|
      //   |--|
      // Start between old start and end
      if (new_start > old_start && new_start < old_end) {
        return true;
      }
      //   |-----|
      // |---|
      // End between old start and end
      if (new_end > old_start && new_end < old_end) {
        return true;
      }
      return false;
    }
  }
};

rangy.init();
var highlighter = rangy.createHighlighter(document, 'TextRange');

function Dialog() {
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

      var c = new Comment(ranges, this.value, node);
      c.send();
      comments[c.nodeId] = c;

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

function Comment(ranges, text, node) {
  this.text = text;
  this.context = ranges;
  this.node = node;
  this.start = ranges[0].characterRange.start;
  this.end = ranges[0].characterRange.end;
  this.nodeId = ['commentator-', this.start, '-', this.end, '-', this.node].join('');

  console.log(ranges);
  var nodeEle = document.getElementById(node);
  var selection = rangy.getSelection().restoreCharacterRanges(nodeEle, ranges);

  var classApplier = rangy.createCssClassApplier('has-comment', {
    ignoreWhiteSpace: false,
    normalize: true,
    elementProperties: {
      id: this.nodeId
    }
  });
  highlighter.addClassApplier(classApplier);

  highlighter.highlightSelection('has-comment', selection);
  rangy.getSelection().removeAllRanges();

  document.getElementById(this.nodeId).onclick = function(e) {
    console.log(e);
    // I need to tie back this event to the thread somehow
  };
}

Comment.prototype.send = function() {
  sock.send(JSON.stringify({
    context: JSON.stringify(this.context),
    text: this.text,
    node: this.node
  }));
};

function Commentator(commentables) {
  var dialog = new Dialog();

  var omu = function(e) {
    var selection = rangy.getSelection(),
        selected = selection.anchorOffset !== selection.focusOffset;

    if (selected) {
      var node = e.currentTarget.id;

      var ranges = selection.saveCharacterRanges(this);
      if (util.overlaps_comment(ranges[0].characterRange, node)) {
        return;
      }

      dialog.show(e);

      var rangesEle = document.getElementById('commentator-ranges');
      var nodeEle = document.getElementById('commentator-node');

      rangesEle.value = JSON.stringify(ranges);
      nodeEle.value = node;
    } else {
      dialog.hide();
    }
  };

  var idArr = commentables.replace(/ /g, '').split(',');
  for (var i=0; i < idArr.length; i++) {
    document.getElementById(idArr[i]).onmouseup = omu;
  }
}
