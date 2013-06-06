commentator.comments = {};

commentator.sock = new SockJS('http://localhost:9999/sock');
commentator.sock.onopen = function() {
  // TODO load all comments from this page
  console.log('connected');
};
commentator.sock.onmessage = function(e) {
  console.log(e);
  var data = JSON.parse(e.data);
  var ranges = JSON.parse(data.context);
  console.log(data);
  var c = new commentator.Comment(ranges, data.text, data.node);
  commentator.comments[c.nodeId] = c;
};

commentator.Comment = function Comment(ranges, text, node) {
  var highlighter = rangy.createHighlighter(document, 'TextRange');
  this.text = text;
  this.context = ranges;
  this.node = node;
  this.start = ranges[0].characterRange.start;
  this.end = ranges[0].characterRange.end;
  this.nodeId = ['commentator-', this.start, '-', this.end, '-', this.node].join('');

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
};

commentator.Comment.prototype.send = function() {
  commentator.sock.send(JSON.stringify({
    context: JSON.stringify(this.context),
    text: this.text,
    node: this.node
  }));
};
