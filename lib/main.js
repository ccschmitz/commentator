// Persistency
// Store URL with Comments
// Timestamps
// Store user email address in localStore
// One level nested comments

(function() {
  var Commentator = function(commentables) {
    var CMNT = window.CMNT,
        comments = CMNT.comments,
        utils = CMNT.utils;
    CMNT.dialog = new CMNT.Dialog();
    CMNT.toolbar = new CMNT.Toolbar();

    loadStyles();
    rangy.init();

    var omu = function(e) {
      var selection = rangy.getSelection(),
          selected = selection.anchorOffset !== selection.focusOffset;
      console.log(utils.getCurrentRange());
      

      if (selected) {
        var node = e.currentTarget.id;
        
        // Begin Experiment
        // TODO see if the target's pop exists
        // display it or add it and display it
        toolbar.show(utils.getToolbarLocation(utils.getCurrentRange()));
        // End Experiment

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
        toolbar.hide();
        dialog.hide();
      }
    };

    var idArr = commentables.replace(/ /g, '').split(',');
    for (var i=0; i < idArr.length; i++) {
      var section = document.getElementById(idArr[i]),
          position = section.style.position;

      if (position != "relative") {
        if (console) {
          throw [idArr[i], 'not commentable. Position must be relative'].join(' ');
        }
      } else {
        section.onmouseup = nodeMouseUp;
      }
    }
  };

  var nodeMouseUp = function(e) {
    var toolbar = CMNT.toolbar,
        dialog = CMNT.dialog,
        utils = CMNT.utils,
        nodeId = this.id,
        range = utils.getCurrentRange();
    if (range.startOffset !== range.endOffset) {
      toolbar.show(utils.getToolbarLocation(range), nodeId, dialog);
    } else {
      toolbar.hide();
      dialog.hide();
    }
  };

  var loadStyles = function() {
    var s = document.createElement("style");
    s.innerHTML = CMNTTMPL['css/main.css'];
    document.getElementsByTagName("head")[0].appendChild(s);
  };

  window.Commentator = Commentator;
  window.CMNT = {};
})();
