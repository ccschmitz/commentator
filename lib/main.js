// Persistency
// Store URL with Comments
// Timestamps
// Store user email address in localStore
// One level nested comments

(function() {
  var Commentator = function(commentables) {
    var CMNT = window.CMNT,
        Dialog = CMNT.Dialog,
        comments = CMNT.comments,
        utils = CMNT.utils;

    this.loadStyles();
    rangy.init();
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
  };

  Commentator.prototype.loadStyles = function() {
    var s = document.createElement("style");
    s.innerHTML = CMNTTMPL['css/main.css'];
    document.getElementsByTagName("head")[0].appendChild(s);
  };

  window.Commentator = Commentator;
  window.CMNT = {};
})();
