function setButtonFanOut() {
  var radius = 60;
  var circleRatio = 3/7;
  var center = {
    right : 15,
    bottom : 15
  };
  var offset = -Math.PI/6

  var items = document.querySelectorAll('.circle a');
  for(var i = 0, l=items.length; i<l; i++) {

    items[i].style.right = (center.right + radius*Math.cos(offset + (i/(l-1))*circleRatio*2*Math.PI)).toFixed(4) + "px";
    items[i].style.bottom = (center.bottom + radius*Math.sin(offset + (i/(l-1))*circleRatio*2*Math.PI)).toFixed(4) + "px";
  }
};

window.onload = function () {
  setTimeout(setButtonFanOut, 1000)
};
