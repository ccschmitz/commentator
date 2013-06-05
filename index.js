// Persistency
// Store URL with Comments
// Timestamps
// Store user email address in localStore
// One level nested comments

module.exports = Commentator;

require('sockjs');
require('./vendor/rangy-core');
require('./vendor/rangy-cssclassapplier');
require('./vendor/rangy-highlighter');
require('./vendor/rangy-textrange');

var Dialog = require('./lib/dialog'),
    Comment = require('./lib/comments'),
    comments = require('./lib/comments').comments,
    utils = require('./lib/utils');

rangy.init();

function Commentator(commentables) {
  var dialog = new Dialog();

  var omu = function(e) {
    var selection = rangy.getSelection(),
        selected = selection.anchorOffset !== selection.focusOffset;

    if (selected) {
      var node = e.currentTarget.id;

      var ranges = selection.saveCharacterRanges(this);
      if (utils.overlaps_comment(ranges[0].characterRange, node, comments)) {
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
