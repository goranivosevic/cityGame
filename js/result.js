

//get paramether from url
var url_string = window.location.href;
var url = new URL(url_string);
var percentage = url.searchParams.get("percentage");
document.getElementById("proc").innerHTML = percentage;
document.getElementById("bigger_proc").innerHTML = percentage;


// create percentage green bar
var elem = document.getElementById("myBar");
var width = 1;
var id = setInterval(frame, 10);

function frame() {
    //animate to percentage from url
    if (width >= percentage) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
    }
}