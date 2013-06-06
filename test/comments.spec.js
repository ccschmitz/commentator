
describe('comments', function() {
  var Comment, comments, sock, server_e;

  beforeEach(function() {
    var CMNT = window.CMNT;
    Comment = CMNT.Comment;
    comments = CMNT.comments;
    sock = CMNT.sock;
    server_e = {
      data: '{"context":"[{\"characterRange\":{\"start\":0,\"end\":5},\"backward\":false}]","text":"asdf\n","node":"content"}',
      type: 'message'
    };
  });

  it('defines the variables', function() {
    expect(Comment).toBeDefined();
    expect(comments).toBeDefined();
    expect(sock).toBeDefined();
    expect(sock.onmessage).toBeDefined();
  });

});
