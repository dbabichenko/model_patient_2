function fullScreenToggle() { 
  var browser = document.documentElement;
  if (1 >= window.outerHeight - window.innerHeight){
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  else{
    if (browser.requestFullscreen) {
      browser.requestFullscreen();
    } else if (browser.mozRequestFullScreen) { /* Firefox */
      browser.mozRequestFullScreen();
    } else if (browser.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      browser.webkitRequestFullscreen();
    } else if (browser.msRequestFullscreen) { /* IE/Edge */
      browser.msRequestFullscreen();
    }
  }
}

$(document).ready(function () {
  $("#content-panel").height($("#main").outerHeight(false) - $("#tabs").outerHeight(false) - $("#tab-content").outerHeight(false));
  $("#application").height($("#display").outerHeight(false) - $("#content-title").outerHeight(false));
  $(window).resize(function () {
    $("#content-panel").height($("#main").outerHeight(false) - $("#tabs").outerHeight(false) - $("#tab-content").outerHeight(false));
    $("#application").height($("#display").outerHeight(false) - $("#content-title").outerHeight(false));
  }).resize();
});



