var playback = function(argJson) {
    // edge cases ??

    // instance variables
    this.type = argJson.type;
    this.ownerColor = argJson.owner_color;
    this.ownerRoute = argJson.owner_route;
    this.ownerDuration = argJson.owner_duration;
    this.opponentColor = argJson.opponent_color;
    this.opponentRoute = argJson.opponent_route;
    this.opponentDuration = argJson.opponent_duration;

    // go onload
    google.maps.event.addDomListener(window, 'load', this.go.bind(this));
}

playback.prototype.go = function() {

    // debug dummy
    this.ownerRoute = [{lat: 40.44350962488237, lon: -79.94512796401978}, 
                        {lat: 40.44360760645317, lon: -79.94475245475769},
                        {lat: 40.44394645828453, lon: -79.94463980197906},
                        {lat: 40.444154667598696, lon: -79.94502067565918},
                        {lat: 40.44429347344985, lon: -79.94556248188019},
                        {lat: 40.44426081327539, lon: -79.94597554206848}];

    // image for the map pins
    this.startImage = new google.maps.MarkerImage('images/geo/start.png',
            // XXX this is wrong, but give it 19x33 cuts it a little
            new google.maps.Size(19, 33),  // size of pic
            new google.maps.Point(0, 0),   // origin
            new google.maps.Point(9, 32)); // anchor
    this.endImage = new google.maps.MarkerImage('images/geo/end.png',
            new google.maps.Size(19, 33),
            new google.maps.Point(0, 0),
            new google.maps.Point(9, 32));
    this.shadow = new google.maps.MarkerImage('images/geo/pin_shadow.png',
            new google.maps.Size(26, 17),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 17));

    $.mobile.hidePageLoadingMsg();
    this.showMap();
}

playback.prototype.showMap = function() {
    if (this.type === "solo") {
        this.mapHelper(this.ownerRoute, "map00", "owner");
    } else {
        this.show2Map();
    }
}

playback.prototype.mapHelper = function(route, htmlId, who) {
    var pt = route.pop();
    var startCoord = new google.maps.LatLng(pt.lat, pt.lon);

    ///////////////////////// MAP ////////////////////////////////
    var mapOptions = {
        zoom: 18,
        center: startCoord,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById(htmlId), mapOptions);

    ///////////////////////// MARKER ////////////////////////////////
    var startMarker = new google.maps.Marker({
        map: map,
        draggable: false,
        icon: this.startImage,
        shadow: this.shadow,
        animation: google.maps.Animation.DROP,
        position: startCoord
    });
    startMarker.setMap(map);
    google.maps.event.addListener(startMarker, 'click', bounce);
    function bounce() {
        startMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() { startMarker.setAnimation(null);}, 500);
    }
    
    ///////////////////////// PATH ////////////////////////////////

    var routeColor;
    if (who === "owner") {
        routeColor = this.ownerColor;
    } else {
        routeColor = this.opponentColor;
    }
    var runPathOptions = {
        strokeColor: routeColor,
        strokeOpacity: 0.6,
        strokeWeight: 6
    }

    var runPath = new google.maps.Polyline(runPathOptions);
    runPath.setMap(map);
    runPath.getPath().push(startCoord);
    var mapBounds = new google.maps.LatLngBounds();

    var that = this;
    $("#same-play-btn").click(function() {
        that.timerId = setInterval(function() {
            var path = runPath.getPath();

            console.log(runPathOptions);
            if (route.length !== 0) { 
                // push subsequent point in the route and update the map
                var pt = route.pop();
                var ptCoord = new google.maps.LatLng(pt.lat, pt.lon);
                map.setCenter(ptCoord);
                path.push(ptCoord); 
                mapBounds.extend(ptCoord);
                map.fitBounds(mapBounds);
                // last point drop a finish pin
                if (route.length === 0) {
                    var finishMarker = new google.maps.Marker({
                        map: map,
                        draggable: false,
                        icon: that.endImage,
                        shadow: that.shadow,
                        animation: google.maps.Animation.DROP,
                        position: ptCoord
                    });
                    finishMarker.setMap(map);
                    google.maps.event.addListener(finishMarker, 'click', bounce);
                    function bounce() {
                        finishMarker.setAnimation(google.maps.Animation.BOUNCE);
                        setTimeout(function() { finishMarker.setAnimation(null);}, 500);
                    }
                }
            }
        }, 1000);
    });
}


////////////////////////
var playbackJson = {
    type: "solo",
    owner_color: "#ed3e7c",
    owner_route: [],
    owner_duration: 100
    // opponentColor: "#37c874",
};

new playback(playbackJson);
