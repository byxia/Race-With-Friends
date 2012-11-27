// latitude, longitude: horizontal, vertical (x,y)
// altitude, altitudeAccuracy
// accuracy, speed
// heading

var nop = function() {};
if (!navigator.geolocation) {
    navigator.geolocation = {};
}
if (!navigator.geolocation.getCurrentPosition) {
    navigator.geolocation.getCurrentPosition = nop;
}

var points = [];
var distance = 0;

// optional for geolocation.watchPosition
var options = { 
    enableHighAccuracy: true,
    maximumAge: 250,
    timeout: 10000
};

$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        debug(position.coords);
    });

    // TODO, use getCurrentPosition with setInterval
    var watchId;
    $("#run-button").click(function() {
        var text = $("#run-button-text").html();
        if (text == "Start") {
            $("#run-button-text").html("Finish");
            watchId = navigator.geolocation.watchPosition(successCallback, errCallback, options);
            points = [];
        } else {
            $("#run-button-text").html("Start");
            navigator.geolocation.clearWatch(watchId);
        }
    });

    /** Converts numeric degrees to radians */
    if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        }
    }

});

function successCallback(position) {
    debug(position.coords);
}

function calculateDistance(a, b) {

    var lat1 = a.latitude;
    var lon1 = a.longitude;
    var lat2 = b.latitude;
    var lon2 = b.longitude;
    var R = 6371; // km
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
}

// code = 0 => UNKNOWN_ERROR, 
//        1 => PERMISSION_DENIED, 
//        2 => POSITION_UNAVAILABLE, 
//        3 => TIMEOUT
function errCallback(err) {
    var message = err.message;
    var code = err.code;
    alert("Erorr: " + code + ", " + err.message);
}

function debug(coords) {
    console.log(coords);
    var latitude = coords.latitude;
    var longitude = coords.longitude;
    var toInsert = "<li>" + latitude + ", " + longitude;
    var delta;

    points.push(coords);
    if (points.length >= 2) {
        delta = calculateDistance(points[points.length-2], points[points.length-1]);
        distance += delta;
        console.log(delta, distance);
    }

    toInsert += " --" + delta + "</li>";
    $("#geo-list").prepend(toInsert);
    $("#geo-list").listview("refresh");
}
