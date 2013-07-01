(function() {
  var CMNT = window.CMNT;
  var utils = CMNT.utils = {
    overlaps_comment: function(characterRange, node, comments) {
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
        if (new_start >= old_start && new_start < old_end) {
          return true;
        }
        //   |-----|
        // |---|
        // End between old start and end
        if (new_end > old_start && new_end <= old_end) {
          return true;
        }
        return false;
      }
    },
    escapeSpecialChars: function(str) {
      return str
        .replace(/[\\]/g, '\\\\')
        .replace(/[\"]/g, '\\\"')
        .replace(/[\/]/g, '\\/')
        .replace(/[\b]/g, '\\b')
        .replace(/[\f]/g, '\\f')
        .replace(/[\n]/g, '\\n')
        .replace(/[\r]/g, '\\r')
        .replace(/[\t]/g, '\\t');
    },
    host: function() {
      return location.host;
    },
    pathname: function() {
      return location.pathname;
    },
    getCurrentRange: function() {
      return rangy.getSelection().getRangeAt(0).cloneRange();
    },
    /**
     * Returns where the toolbar should get placed
     * based off of the given range
     * @param {Object} range
     * @return {Array} [top, left]
     */
    getToolbarLocation: function(range) {
      // TODO for IE
      var rect = range.nativeRange.getClientRects()[0];
      return [rect.top - (rect.height * 2), rect.left + (rect.width / 2)];
    }
  };
})();
