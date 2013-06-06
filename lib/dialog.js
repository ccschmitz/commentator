commentator.Dialog = function() {
  // TODO don't hard code this ID
  this.id = 'commentator';
  var template = CMNTTMPL['lib/template.html'],
      div = document.createElement('div');
  div.id = this.id;
  div.innerHTML = template;

  this.templ = div;
};

commentator.Dialog.prototype.show = function(e) {
  var self = this;
  if (e) {
    this.templ.style.top = e.pageY - 11;
    this.templ.style.left = e.pageX + 4;
  }

  document.body.appendChild(this.templ);

  setupCommentEventHandlers();

  document.getElementById('commentator-ta').onkeyup = function(e) {
    e = e || window.event;

    if (e.keyCode == 13) {
      var rangesEle = document.getElementById('commentator-ranges');
      var nodeEle = document.getElementById('commentator-node');

      var ranges = JSON.parse(rangesEle.value);
      var node = nodeEle.value;

      var c = new commentator.Comment(ranges, this.value, node);
      c.send();
      commentator.comments[c.nodeId] = c;

      this.value = '';
      self.hide();
      return false;
    }
  };
};

commentator.Dialog.prototype.getElement = function() {
  return (document.getElementById(this.id));
};

commentator.Dialog.prototype.hide = function () {
  if (this.getElement()) {
    document.body.removeChild(this.templ);
  }
};

function setupCommentEventHandlers() {
  var commentLinks = document.querySelectorAll('.comment-reply-link, .comment-new-link');

  var cmc = function(e) {
    displayLogin();
    return false;
  };

  for (var i=0; i < commentLinks.length; i++) {
    commentLinks[i].onclick = cmc;
  }
}

function displayLogin() {
  var loginPanel = document.getElementById('commentator-login'),
      loginPanelClass = loginPanel.className,
      loginButton = document.getElementById('commentator-login-button'),
      commentForm = document.getElementById('commentator-comment-form'),
      commentator = document.getElementById('commentator');

  console.log(commentForm.style.display);

  if (commentForm.style.display != 'block') {
    loginPanel.className += ' open';
    commentator.scrollTop = 0;

    loginButton.onclick = function() {
      loginPanel.className = loginPanelClass;
      var loginLink = document.getElementsByClassName('comment-new-link')[0];
      loginLink.parentNode.removeChild(loginLink);
      commentForm.style.display = 'block';
      // TODO: Scroll to and focus on the comment form
      // TODO: Put the comment for underneath the comment that is being replied to
    };
  } else {
    commentForm.getElementsByTagName('textarea')[0].focus();
  }
}
