var playback = function() {
    this.setup();
}

playback.prototype.setup = function() {
    google.maps.event.addDomListener(window, 'load', this.go.bind(this));
}

playback.prototype.go = function() {

    // debug dummy
    this.jsonArr = [{lat: 40.44350962488237, lon: -79.94512796401978}, 
                    {lat: 40.44360760645317, lon: -79.94475245475769},
                    {lat: 40.44394645828453, lon: -79.94463980197906},
                    {lat: 40.444154667598696, lon: -79.94502067565918},
                    {lat: 40.44429347344985, lon: -79.94556248188019},
                    {lat: 40.44426081327539, lon: -79.94597554206848}];

    /*
     * images for the map pins
     */
    this.startImage = new google.maps.MarkerImage('images/geo/start.png',
            new google.maps.Size(19, 33), // XXX this is wrong, but give it 19x33 cuts it a little
            new google.maps.Point(0, 0), // origin
            new google.maps.Point(9, 32) // anchor
            );
    this.endImage = new google.maps.MarkerImage('images/geo/end.png',
            new google.maps.Size(19, 33),
            new google.maps.Point(0, 0),
            new google.maps.Point(9, 32));
    this.shadow = new google.maps.MarkerImage('images/geo/pin_shadow.png',
            new google.maps.Size(26, 17),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 17));

    // $.mobile.hidePageLoadingMsg();
    this.showMap();
}

playback.prototype.showMap = function() {
    var pt = this.jsonArr.pop();
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
    this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    ///////////////////////// MARKER ////////////////////////////////
    var startMarker = new google.maps.Marker({
        map: this.map,
        draggable: false,
        icon: this.startImage,
        shadow: this.shadow,
        animation: google.maps.Animation.DROP,
        position: startCoord
    });
    startMarker.setMap(this.map);
    google.maps.event.addListener(startMarker, 'click', bounce);
    function bounce() {
        startMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() { startMarker.setAnimation(null);}, 500);
    }
    
    ///////////////////////// PATH ////////////////////////////////
    var runPathOptions = {
        strokeColor: "#3E7BED",
        strokeOpacity: 0.8,
        strokeWeight: 6
    }

    this.runPath = new google.maps.Polyline(runPathOptions);
    this.runPath.setMap(this.map);
    this.runPath.getPath().push(startCoord);
    this.mapBounds = new google.maps.LatLngBounds();

    this.timer();
}

playback.prototype.timer = function() {
    var that = this;

    that.timerId = setInterval(function() {
        var path = that.runPath.getPath();

        if (that.jsonArr.length !== 0) { 
            var pt = that.jsonArr.pop();
            var ptCoord = new google.maps.LatLng(pt.lat, pt.lon);
            that.map.setCenter(ptCoord);
            path.push(ptCoord); 
            that.mapBounds.extend(ptCoord);
            that.map.fitBounds(that.mapBounds);
            if (that.jsonArr.length === 0) {
                var finishMarker = new google.maps.Marker({
                    map: that.map,
                    draggable: false,
                    icon: that.endImage,
                    shadow: that.shadow,
                    animation: google.maps.Animation.DROP,
                    position: ptCoord
                });
                finishMarker.setMap(that.map);
                google.maps.event.addListener(finishMarker, 'click', bounce);
                function bounce() {
                    finishMarker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() { finishMarker.setAnimation(null);}, 500);
                }
            }
        }
    }, 1000);
}

new playback();
