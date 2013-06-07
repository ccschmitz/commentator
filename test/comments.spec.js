
describe('comments', function() {
  var Comment, comments, sock, server_e;

  beforeEach(function() {
    var CMNT = window.CMNT;
    Comment = CMNT.Comment;
    comments = CMNT.comments;
    sock = CMNT.sock;
    
    // Create necessary node to apply selection to 
    var div = document.createElement('div');
    div.id = 'content';
    div.innerText = 'TEST TEXT';
    document.body.appendChild(div);
    
    server_e = {
      data: '{"type":"new-comment","context":[{"characterRange":{"start":1,"end":5},"backward":false}],"text":"a\\n","node":"content"}',
      type: 'message'
    };
  });

  it('defines the variables', function() {
    expect(Comment).toBeDefined();
    expect(comments).toBeDefined();
    expect(sock).toBeDefined();
    expect(sock.onmessage).toBeDefined();
  });

  it('adds a comment on sock event new-comment', function(){
    expect(comments).toEqual({});
    sock.onmessage(server_e);
    expect(comments['commentator-1-5-content']).toBeDefined();
  });

});
