(function() {
  var Toolbar = function() {
    var template = CMNTTMPL['templates/pop.html'],
        div = document.createElement('div');

    div.innerHTML = template;
    div.style.position = "absolute";
    div.style.display = "hidden";
    document.body.appendChild(div);
    this.div = div;
  };

  Toolbar.prototype.hide = function() {
    this.div.style.display = "none";
  };

  /**
   * Displays toolbar at given position
   * @param {Array} [top, left]
   * @param {String} nodeId
   */
  Toolbar.prototype.show = function(l, nodeId) {
    console.log(nodeId);
    this.div.style.top = l[0];
    this.div.style.left = l[1];
    this.div.style.display = "block";
    // TODO set click handlers
  };
  window.CMNT.Toolbar = Toolbar;
})();
