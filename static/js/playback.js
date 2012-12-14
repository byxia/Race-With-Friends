var playback = function(argJson) {
    // TODO edge cases ??

    // instance variables
    this.type = argJson.type;
    this.ownerColor = argJson.ownerColor;
    this.ownerRoute = argJson.ownerRoute;
    this.ownerDuration = argJson.ownerDuration;
    this.opponentColor = argJson.opponentColor;
    this.opponentRoute = argJson.opponentRoute;
    this.opponentDuration = argJson.opponentDuration;

    // go onload
    google.maps.event.addDomListener(window, 'load', this.go.bind(this));
}

playback.prototype.go = function() {

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
    // show the maps
    if (this.type === "solo") {
        this.soloMapHelper("map00");
    } else if (this.type === "same"){
        this.sameMapHelper();
    } else { // diff
        this.diffMapHelper();
    }
}

playback.prototype.soloMapHelper = function(htmlId) {
    // dummy
    this.ownerRoute = [{lat: 40.44350962488237, lon: -79.94512796401978}, 
                        {lat: 40.44360760645317, lon: -79.94475245475769},
                        {lat: 40.44394645828453, lon: -79.94463980197906},
                        {lat: 40.444154667598696, lon: -79.94502067565918},
                        {lat: 40.44429347344985, lon: -79.94556248188019},
                        {lat: 40.44426081327539, lon: -79.94597554206848}];

    /////////////////////////// 1st MAP ////////////////////////////////
    var pt = this.ownerRoute[0];
    var startCoord = new google.maps.LatLng(pt.lat, pt.lon);

    var mapOptions = {
        zoom: 18,
        center: startCoord,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById(htmlId), mapOptions);

    ///////////////////////// 1st MARKER /////////////////////////////
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

    var finishMarker = new google.maps.Marker({
        map: map,
        draggable: false,
        icon: this.endImage,
        shadow: this.shadow,
        animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(finishMarker, 'click', bounce);
    function bounce() {
        finishMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() { finishMarker.setAnimation(null);}, 500);
    }
    
    ///////////////////////// 1st PATH ////////////////////////////////
    var runPathOptions = {
        strokeColor: this.ownerColor,
        strokeOpacity: 0.6,
        strokeWeight: 6
    };
    var runPath = new google.maps.Polyline(runPathOptions);
    runPath.setMap(map);
    var mapBounds = new google.maps.LatLngBounds();

    // show entire route before playback
    var path = runPath.getPath();
    for (var i=0; i<this.ownerRoute.length; i++) {
        var coord = new google.maps.LatLng(this.ownerRoute[i].lat, this.ownerRoute[i].lon);
        path.push(coord); 
        mapBounds.extend(coord);
        map.fitBounds(mapBounds);
        if (i === this.ownerRoute.length-1) {
            finishMarker.setPosition(coord);
            finishMarker.setMap(map);
        }
    }
    
    ///////////////////////// 1st TIMER ////////////////////////////////
    var that = this;
    $("#same-play-btn").click(function() {
        $("#same-play-btn").hide();
        path.clear();
        path.push(new google.maps.LatLng(that.ownerRoute[0].lat, that.ownerRoute[0].lon));
        finishMarker.setMap(null);
        that.timer({
            map: map,
            mapBounds: mapBounds,
            route: that.ownerRoute,
            runPath: runPath,
            interval: 10/that.ownerDuration,
            marker: finishMarker,
            cnt: 1,
            who: "owner",
            btnName: "#same-play-btn"
        });
    });

    return map;
}

playback.prototype.sameMapHelper = function() {

    // dummy
    this.opponentRoute = [{lat: 40.44350962488237, lon: -79.94512796401978}, 
                        {lat: 40.44360760645317, lon: -79.94475245475769},
                        {lat: 40.44394645828453, lon: -79.94463980197906},
                        {lat: 40.444154667598696, lon: -79.94502067565918},
                        {lat: 40.44429347344985, lon: -79.94556248188019},
                        {lat: 40.44426081327539, lon: -79.94597554206848},
                        {lat: 40.44526081327536, lon: -79.94697554206848}];
                        
    // draw owners map, which is also opponent's map since same map
    var map = this.soloMapHelper("map00");

    var pt = this.opponentRoute[0];
    var startCoord = new google.maps.LatLng(pt.lat, pt.lon);

    ///////////////////////// 2nd MARKER ////////////////////////////
    var finishMarker = new google.maps.Marker({
        map: map,
        draggable: false,
        icon: this.endImage,
        shadow: this.shadow,
        animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(finishMarker, 'click', bounce);
    function bounce() {
        finishMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() { finishMarker.setAnimation(null);}, 500);
    }

    /////////////////////// 2nd PATH ////////////////////////////////
    var runPathOptions = {
        strokeColor: this.opponentColor,
        strokeOpacity: 0.6,
        strokeWeight: 6
    };
    var runPath = new google.maps.Polyline(runPathOptions);
    runPath.setMap(map);
    var mapBounds = new google.maps.LatLngBounds();

    // show entire route before playback
    var path = runPath.getPath();
    for (var i=0; i<this.opponentRoute.length; i++) {
        var coord = new google.maps.LatLng(this.opponentRoute[i].lat, this.opponentRoute[i].lon);
        path.push(coord); 
        mapBounds.extend(coord);
        map.fitBounds(mapBounds);
        if (i === this.opponentRoute.length-1) {
            finishMarker.setPosition(coord);
            finishMarker.setMap(map);
        }
    }

    ///////////////////////// 2nd TIMER /////////////////////////////
    var that = this;
    $("#same-play-btn").click(function() {
        $("#same-play-btn").hide();
        path.clear();
        path.push(new google.maps.LatLng(that.opponentRoute[0].lat, that.opponentRoute[0].lon));
        finishMarker.setMap(null);
        that.timer({
            map: map,
            mapBounds: mapBounds,
            route: that.opponentRoute,
            runPath: runPath,
            interval: 10/that.opponentDuration,
            marker: finishMarker,
            cnt: 1,
            who: "opponent",
            btnName: "#same-play-btn"
        });
    });
}

playback.prototype.diffMapHelper = function() {

    // dummy
    this.opponentRoute = [{lat: 40.44350962488237, lon: -79.94512796401978}, 
                        {lat: 40.44360760645317, lon: -79.94475245475769},
                        {lat: 40.44394645828453, lon: -79.94463980197906},
                        {lat: 40.444154667598696, lon: -79.94502067565918},
                        {lat: 40.44429347344985, lon: -79.94556248188019},
                        {lat: 40.44426081327539, lon: -79.94597554206848},
                        {lat: 40.44526081327536, lon: -79.94697554206848}];
                        
    // draw owners map, which is not opponent's map
    this.soloMapHelper("map01");

    /////////////////////////// 2nd MAP /////////////////////////////
    var pt = this.opponentRoute[0];
    var startCoord = new google.maps.LatLng(pt.lat, pt.lon);
    var mapOptions = {
        zoom: 18,
        center: startCoord,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map02"), mapOptions);

    //////////////////////////// 2nd MARKERs /////////////////////////
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

    var finishMarker = new google.maps.Marker({
        map: map,
        draggable: false,
        icon: this.endImage,
        shadow: this.shadow,
        animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(finishMarker, 'click', bounce);
    function bounce() {
        finishMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() { finishMarker.setAnimation(null);}, 500);
    }

    /////////////////////////// 2nd PATH //////////////////////////////
    var runPathOptions = {
        strokeColor: this.opponentColor,
        strokeOpacity: 0.6,
        strokeWeight: 6
    };
    var runPath = new google.maps.Polyline(runPathOptions);
    runPath.setMap(map);
    var mapBounds = new google.maps.LatLngBounds();

    // show entire route before playback
    var path = runPath.getPath();
    for (var i=0; i<this.opponentRoute.length; i++) {
        var coord = new google.maps.LatLng(this.opponentRoute[i].lat, this.opponentRoute[i].lon);
        path.push(coord);
        mapBounds.extend(coord);
        map.fitBounds(mapBounds);
        if (i === this.opponentRoute.length-1) {
            finishMarker.setPosition(coord);
            finishMarker.setMap(map);
        }
    }

    ///////////////////////// 2nd Timer /////////////////////////////////
    var that = this;
    $("#diff-play-btn").click(function() {
        path.clear();
        path.push(new google.maps.LatLng(that.opponentRoute[0].lat, that.opponentRoute[0].lon));
        finishMarker.setMap(null);
        that.timer({
            map: map,
            mapBounds: mapBounds,
            route: that.ownerRoute,
            runPath: runPath,
            interval: 10/that.opponentDuration,
            marker: finishMarker,
            cnt: 1,
            who: "opponent",
            btnName: "diff-play-btn"
        });
    });
}

playback.prototype.timer = function(arg) {
    var that = this;
    var timerId = setInterval(function() {
        var path = arg.runPath.getPath();
        if (arg.cnt < arg.route.length) {
            // push subsequent point in the route and update the map
            var pt = arg.route[arg.cnt];
            var ptCoord = new google.maps.LatLng(pt.lat, pt.lon);
            path.push(ptCoord); 
            // last point drop a finish pin
            if (arg.cnt === arg.route.length-1) {
                arg.marker.setMap(arg.map);
                clearInterval(timerId);
                if (arg.who === "owner" && that.ownerDuration < that.opponentDuration) {
                    $(arg.btnName).show();
                }
                if (arg.who === "opponent" && that.opponentDuration < that.ownerDuration) {
                    $(arg.btnName).show();
                }
            }
        }
        arg.cnt ++;
    }, arg.interval*1000);
}

////////////////////////
var playbackJson = {
    type: "same",
    ownerColor: "#ed3e7c",
    ownerRoute: [],
    ownerDuration: 10,
    opponentColor: "#37c874",
    opponentRoute: [],
    opponentDuration: 100
};

new playback(playbackJson);
