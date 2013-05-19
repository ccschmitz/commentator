$(function() {

  var $content = $('main');

  $content.on('mouseup', function(e) {
    closeComments();

    var text = window.getSelection().toString(),
        $comments = $('<div id="commentator"><div class="comments"><div class="comment"><p>I think this warrants further discussion!</p><span>Posted 5 hours ago by <a href="#">Chris Schmitz</a></span></div><div class="comment"><p>Well I think you\'re an idiot...</p><span>Posted 4 hours ago by <a href="#">Zach Gohr</a></div></div><form class="comment-box"><textarea placeholder="Enter your comment..." rows="1"></textarea><button type="submit">Submit Comment</button></form></div>');

    $comments.find('textarea').css('overflow', 'hidden').autogrow({
      animate: false
    });

    if (text) {
      $comments.appendTo('body').css({
        display: 'none',
        position: 'absolute',
        top: (e.pageY - 15) + 'px',
        left: e.pageX + 'px'
      }).fadeIn('fast');
    }

    // override form submission
    $comments.find('form').on('submit', function(e) {
      var $this = $(this);

      $comments.find('.comments').append('<div style="display: none;" class="comment"><p>'+ $this.find('textarea').val() +'</p><span>Posted just now by <a href="#">You</a></span></div>');
      $this.fadeOut('fast', function() {
        $comments.find('.comment:last').fadeIn('fast');
      });

      return false;
    });
  });

  // close the comments
  function closeComments() {
    var $comments = $('#commentator');

    if ($comments) {
      $comments.remove();
    }
  }

});