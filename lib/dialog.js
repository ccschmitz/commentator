
module.exports = Dialog;

function Dialog() {
  // TODO don't hard code this ID
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
