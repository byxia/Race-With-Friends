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
        var startCoord = new google.maps.LatLng(position.coords.latitude, 
                                                position.coords.longitude);
        var mapOptions = {
            zoom: 20,
            center: startCoord,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        that.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        // start marker, can bounce when you click it
        var startMarker = new google.maps.Marker({
            map: this.map,
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

        // init run path
        var runPathOptions = {
            strokeColor: "#3E7BED",
            strokeOpacity: 0.8,
            strokeWeight: 6
        }
        that.runPath = new google.maps.Polyline(runPathOptions);
        that.runPath.setMap(that.map);
        // debug
        google.maps.event.addListener(that.map, 'click', that.addLatLng.bind(that));

        // timer
        that.timer();
    });
}

/**
 * Handles click events on a map, and adds a new point to the Polyline.
 * @param {MouseEvent} mouseEvent
 */
geo.prototype.addLatLng = function(event) {
    console.log(this);
    var path = this.runPath.getPath();

    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear
    path.push(event.latLng);

    // Add a new marker at the new plotted point on the polyline.
    var marker = new google.maps.Marker({
        position: event.latLng,
        title: '#' + path.getLength(),
        map: this.map
    });
}

geo.prototype.timer = function() {
    var that = this;

    setInterval(function() {
        navigator.geolocation.getCurrentPosition(function(position) {

            var path = that.runPath.getPath();
            console.log(path);
            path.push(new google.maps.LatLng(position.coords.latitude, 
                                             position.coords.longitude));
        });
    }, 1000);
}

new geo();
