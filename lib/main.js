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

    loadStyles();
    rangy.init();
    var dialog = new Dialog();

    var omu = function(e) {
      var selection = rangy.getSelection(),
          selected = selection.anchorOffset !== selection.focusOffset;
      

      if (selected) {
        var node = e.currentTarget.id;
        
        // Begin Experiment
        // TODO see if the target's pop exists
        // display it or add it and display it
        var range = selection.getRangeAt(0).cloneRange();
        var rect = range.nativeRange.getClientRects()[0];
        var container = range.startContainer;
        console.log(rect);
        console.log(selection);
        var div = document.createElement('div');
        div.innerHTML = CMNTTMPL['templates/pop.html'];
        div.style.position = "absolute";
        div.style.top = rect.top - (rect.height * 2);
        div.style.left = rect.left + (rect.width/2);
        document.body.appendChild(div);
        return;
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
        dialog.hide();
      }
    };

    var idArr = commentables.replace(/ /g, '').split(',');
    for (var i=0; i < idArr.length; i++) {
      var section = document.getElementById(idArr[i]),
          position = section.style.position;

      if (position != "relative") {
        if (console) {
          console.warn([idArr[i], 'not commentable. Position must be relative.'].join(' '));
        }
      } else {
        section.onmouseup = omu;
      }
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
