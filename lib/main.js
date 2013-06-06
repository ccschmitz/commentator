// Persistency
// Store URL with Comments
// Timestamps
// Store user email address in localStore
// One level nested comments

var commentator = {};

commentator.Commentator = function(commentables) {
  rangy.init();
  var dialog = new commentator.Dialog();

  var omu = function(e) {
    var selection = rangy.getSelection(),
        selected = selection.anchorOffset !== selection.focusOffset;

    if (selected) {
      var node = e.currentTarget.id;

      var ranges = selection.saveCharacterRanges(this);
      if (commentator.utils.overlaps_comment(ranges[0].characterRange, node, commentator.comments)) {
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
};
