var nop = function() {};
if (!navigator.geolocation) {
    navigator.geolocation = {};
}
if (!navigator.geolocation.getCurrentPosition) {
    navigator.geolocation.getCurrentPosition = nop;
}

/////////////////////////////////////////////////
var map;
function initialize() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var mapOptions = {
            zoom: 8,
            center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    });

    console.log(map);
    // mobile specific style
    detectBrowser();
}
google.maps.event.addDomListener(window, 'load', initialize);

function detectBrowser() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map_canvas");

    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '600px';
        mapdiv.style.height = '800px';
    }
}
