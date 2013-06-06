
describe('utils', function() {
  var utils, range, node, comments;

  beforeEach(function() {
    var CMNT = window.CMNT;
    utils = CMNT.utils;
    node = 'node';
    range = {
      start: 0,
      end: 5
    };
    comments = {
      'a': {
        node: node,
        start: 10,
        end: 20
      }
    };
  });

  it('exists', function() {
    expect(utils).toBeDefined();
  });

  it('does not overlap comments', function() {
    expect(utils.overlaps_comment(range, node, comments)).toBeFalsy();
  });

  it('overlaps comments exactly', function() {
    range.start = 10;
    range.end = 20;
    expect(utils.overlaps_comment(range, node, comments)).toBeTruthy();
  });

  it('doesn\'t overlap with different node', function() {
    range.start = 10;
    range.end = 20;
    range.node = 'different';
    expect(utils.overlaps_comment(range, node, comments)).toBeTruthy();
  });

  it('overlaps left', function() {
    range.end = 15;
    expect(utils.overlaps_comment(range, node, comments)).toBeTruthy();
  });

  it('overlaps right', function() {
    range.start = 15;
    range.end = 25;
    expect(utils.overlaps_comment(range, node, comments)).toBeTruthy();
  });

});
