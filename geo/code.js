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
    google.maps.event.addDomListener(window, 'load', this.initialize.bind(this));
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
        that.startCoord = new google.maps.LatLng(position.coords.latitude, 
                                                position.coords.longitude);
        var mapOptions = {
            zoom: 20,
            center: that.startCoord,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        that.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        var startMarker = new google.maps.Marker({
            map: this.map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: that.startCoord
        });
        startMarker.setMap(that.map);
        google.maps.event.addListener(startMarker, 'click', bounce);

        // timer
        that.timer();

        function bounce() {
            startMarker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() { startMarker.setAnimation(null);}, 500);
        }
    });
}

geo.prototype.timer = function() {
    var that = this;

    var runPathCoords = [that.startCoord]; // preload starting point
    var runPath;

    setInterval(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            runPathCoords.push(new google.maps.LatLng(position.coords.latitude, 
                                                        position.coords.longitude));

            console.log([runPathCoords[runPathCoords.length-2], 
                        runPathCoords[runPathCoords.length-1]]);

            var runPath = new google.maps.Polyline({
                path: [runPathCoords[runPathCoords.length-2], 
                        runPathCoords[runPathCoords.length-1]],
                strokeColor: "#3E7BED",
                strokeOpacity: 0.8,
                strokeWeight: 6,
            });
            // map new 2 points 
            runPath.setMap(that.map); 
        });
    }, 1000);
}

new geo();
