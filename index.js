var selectable = require('selectable');

module.exports = Commentator;

function Commentator() {
  var template = require('./template');
  var selection = selectable('#content'),
      d = document,
      div = d.createElement('div');

  div.innerHTML = template;
  var templ = div.firstChild;

  selection.on('change', function(e){
    var popover = d.getElementById('commentator');
    if (popover) {
      d.body.removeChild(templ);
    };

    var text = window.getSelection().toString();
    if (text) {
      div.innerHTML = template;
      d.body.appendChild(templ);
    };
    console.log(e);
  });
}
