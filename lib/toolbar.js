(function() {
  var Toolbar = function() {
    var template = CMNTTMPL['templates/pop.html'],
        div = document.createElement('div');

    div.innerHTML = template;
    div.style.position = "absolute";
    div.style.display = "none";
    document.body.appendChild(div);

    var hide = this.hide = function() {
      div.style.display = "none";
    };

    this.comment = function(e) {
      dialog.show(e);
      hide();
    };

    this.div = div;
    /**
     * Displays toolbar at given position
     * @param {Array} [top, left]
     * @param {String} nodeId
     */
    this.show = function(l, nodeId, d) {
      this.div.style.top = l[0];
      this.div.style.left = l[1];
      this.div.style.display = "block";
      this.div.onclick = this.comment;
      dialog = d;
      // TODO set click handlers
    };
  };

  window.CMNT.Toolbar = Toolbar;
})();
