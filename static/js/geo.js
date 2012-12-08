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
    this.route = [];
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

/**
 * change the map's view depending on the device
 */
geo.prototype.detectBrowser = function() {
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map_canvas");

    // if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    //     mapdiv.style.width = '100%';
    //     mapdiv.style.height = '100%';
    // }
    // else {
    //     mapdiv.style.width = '600px';
    //     mapdiv.style.height = '800px';
    // }
}

/**
 * initialize the map, the starter maker, the the route for later use
 */
geo.prototype.initialize = function() {

    $.mobile.hidePageLoadingMsg();

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

        $('#finish-run-btn').hide();
        $('#stop-run-btn').hide();
        $('#arrive-instruction').hide();


        $("#start-run-btn").click(function(){
            alert("hehe");
            $("#start-run-btn").hide();
            $("#finish-run-btn").show();
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
            that.route.push({
                lat: startCoord.$a,
                lon: startCoord.ab
            });

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
        });

        $("#finish-run-btn").click(function() {
            // stop tracking
            clearInterval(that.intervalId);
            
            var finishMarker = new google.maps.Marker({
                map: that.map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            });
            finishMarker.setMap(that.map);
            google.maps.event.addListener(finishMarker, 'click', bounce);
            function bounce() {
                finishMarker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() { finishMarker.setAnimation(null);}, 500);
            }
        });

    }, this.errCallBack, this.geoOptions);
}

/**
 * Handle updating the user's runnning route every T = 1s interval
 */
geo.prototype.timer = function() {
    var that = this;
    that.intervalId = setInterval(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            that.time ++;
            var path = that.runPath.getPath();
            // TODO real
            // var pt = new google.maps.LatLng(position.coords.latitude, 
            //                                  position.coords.longitude));
            // that.map.setCenter(pt);
            // path.push(pt);
            // that.route.push({
            //     lat: pt.$a,
            //     lon: pt.ab
            // });
            
            // TODO dummy
            if (that.arr.length !== 0) { 
                var pt = that.arr.pop();
                that.map.setCenter(pt);
                path.push(pt); 
                that.route.push({
                    lat: pt.$a,
                    lon: pt.ab
                });
                that.distance += that.delta2Pts(that.route[that.route.length-2], that.route[that.route.length-1]);
            }
            
        }, that.errCallBack, that.geoOptions);
    }, 1000);
}

/**
 * Calculate distance between 2 (latitude, longitude) pairs 
 * From http://www.movable-type.co.uk/scripts/latlong.html
 * This function is not very accurate.
 */
geo.prototype.delta2Pts = function(a, b) {
    // Converts numeric degrees to radians
    if (typeof Number.prototype.toRad == 'undefined') {
        Number.prototype.toRad = function() {
            return this * Math.PI / 180;
        }
    }
    // me 
    var lat1 = a.lat;
    var lat2 = b.lat;
    var lon1 = a.lon;
    var lon2 = b.lon;
    // theirs
    var R = 6371000; // km
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();
    
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

    // console.log(R * c);
    return R * c;
}

// new instance of geo and start running
new geo();
