commentator.utils = {
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
  }
};
