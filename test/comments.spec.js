
describe('comments', function() {
  var Comment, comments, sock, server_e;

  beforeEach(function() {
    Comment = commentator.Comment;
    comments = commentator.comments;
    sock = commentator.sock;
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
