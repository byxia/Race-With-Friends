var geo = function() {
    this.setup();
}

geo.prototype.setup = function() {
    var nop = function() {};
    if (!navigator.geolocation) {
        navigator.geolocation = {};
    }
    if (!navigator.geolocation.getCurrentPosition) {
        navigator.geolocation.getCurrentPosition = nop;
    }

    this.distance = 0;
    this.time = 0;
    this.geoOptions = {
        enableHighAccuracy: true,
        maximumAge: 250,
        timeout: 10000
    };

    google.maps.event.addDomListener(window, 'load', this.initialize.bind(this));
}

// code: 0 => UNKNOWN_ERROR, 1 => PERMISSION_DENIED, 2 => POSITION_UNAVALIABLE, 3 => TIMEOUT
geo.prototype.errCallBack = function(err) {
    var message = err.message;
    var code = err.code;
    alert("Error: " + code + ", " + err.message);
}

geo.prototype.detectBrowser = function() {
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

geo.prototype.initialize = function() {
    // mobile specific style
    this.detectBrowser();
    var that = this;

    navigator.geolocation.getCurrentPosition(function(position) {
        ///////////////////////////// INIT MAP //////////////////////////////
        var startCoord = new google.maps.LatLng(position.coords.latitude, 
                                                position.coords.longitude);
        var mapOptions = {
            zoom: 18,
            center: startCoord,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        that.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        ////////////////////////// START MARKER //////////////////////////////
        var startMarker = new google.maps.Marker({
            map: that.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: startCoord
        });
        startMarker.setMap(that.map);
        google.maps.event.addListener(startMarker, 'click', bounce);
        function bounce() {
            startMarker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() { startMarker.setAnimation(null);}, 500);
        }

        //////////////////////////// RUN PATH //////////////////////////////
        var runPathOptions = {
            strokeColor: "#3E7BED",
            strokeOpacity: 0.8,
            strokeWeight: 6
        }
        that.runPath = new google.maps.Polyline(runPathOptions);
        that.runPath.setMap(that.map);
        that.runPath.getPath().push(startCoord);
        
        // debug
        that.arr = [
            new google.maps.LatLng(40.44350962488237, -79.94512796401978),
            new google.maps.LatLng(40.44360760645317, -79.94475245475769),
            new google.maps.LatLng(40.44394645828453, -79.94463980197906),
            new google.maps.LatLng(40.444154667598696, -79.94502067565918),
            new google.maps.LatLng(40.44429347344985, -79.94556248188019),
            new google.maps.LatLng(40.44426081327539, -79.94597554206848)
                ];

        that.timer();

    }, this.errCallBack, this.geoOptions);
}

geo.prototype.timer = function() {
    var that = this;
    setInterval(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            this.time ++;
            var path = that.runPath.getPath();
            // TODO real
            // console.log(path.b[path.b.length-1]);
            // path.push(new google.maps.LatLng(position.coords.latitude, 
            //                                  position.coords.longitude));
            // TODO dummy
            if (that.arr.length !== 0) { 
                console.log(that.arr);
                path.push(that.arr.pop()); 
            }

        }, that.errCallBack, that.geoOptions);
    }, 1000);
}

new geo();
