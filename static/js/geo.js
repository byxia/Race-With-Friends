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

    // send these to server in a json
    this._id = getUrlVars().raceId;
    this.route = [];
    this.distance = 0;
    this.start_date;
    this.finish_date;
    this.duration = 0;
    this.pace = 0;

    this.geoOptions = {
        enableHighAccuracy: true,
        maximumAge: 250,
        timeout: 10000
    };

    this.centerMarker = null;

    google.maps.event.addDomListener(window, 'load', this.go.bind(this));
}

/**
 * error call back for geolocation service
 * code: 0 => UNKNOWN_ERROR, 1 => PERMISSION_DENIED, 2 => POSITION_UNAVALIABLE, 3 => TIMEOUT
 */
geo.prototype.errCallBack = function(err) {
    var message = err.message;
    var code = err.code;
    alert("Error: " + code + ", " + err.message);
}

/**
 * start the tasks of the race
 */
geo.prototype.go = function() {

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
            new google.maps.Point(0, 0), // origin
            new google.maps.Point(9, 32) // anchor
            );
    this.shadow = new google.maps.MarkerImage('images/geo/pin_shadow.png',
            new google.maps.Size(26, 17),
            new google.maps.Point(0, 0),
            new google.maps.Point(0, 17)
            );

    $.mobile.hidePageLoadingMsg();
    this.showMap();
    this.startButton();
    this.finishButton();
}

/*
 * Initialize the map centered at the user's current position
 */
geo.prototype.showMap = function() {
    var that = this;
    navigator.geolocation.getCurrentPosition(function(position) {
        that.startCoord = new google.maps.LatLng(position.coords.latitude, 
            position.coords.longitude);
        var mapOptions = {
            zoom: 18,
            center: that.startCoord,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        that.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    }, that.errCallBack, that.geoOptions);

    // track current location
    that.preTimer();
}

/**
 * When user press start, drop the start pin and start tracking the user's run
 */
geo.prototype.startButton = function() {
    var that = this;

    $("#start-run-btn").click(function(){
        $("#start-run-btn").hide();
        $("#finish-run-btn").show();
        $('#rec-icon').show();
        clearInterval(that.preTimerId);
        that.start_date = new Date();

        //////////////////////////// START MARKER ////////////////////////////
        navigator.geolocation.getCurrentPosition(function(position) {
            var startMarker = new google.maps.Marker({
                map: that.map,
                draggable: false,
                icon: that.startImage,
                shadow: that.shadow,
                animation: google.maps.Animation.DROP,
                position: that.startCoord
            });
            startMarker.setMap(that.map);
            google.maps.event.addListener(startMarker, 'click', bounce);
            function bounce() {
                startMarker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() { startMarker.setAnimation(null);}, 500);
            }
        }, that.errCallBack, that.geoOptions);

        ////////////////////////////// RUN PATH //////////////////////////////
        var runPathOptions = {
            strokeColor: "#3E7BED",
            strokeOpacity: 0.8,
            strokeWeight: 6
        }
        that.runPath = new google.maps.Polyline(runPathOptions);
        that.runPath.setMap(that.map);
        that.runPath.getPath().push(that.startCoord);
        that.route.push({
            lat: that.startCoord.$a,
            lon: that.startCoord.ab
        });
        that.mapBounds = new google.maps.LatLngBounds();
        that.mapBounds.extend(that.startCoord);

        // debug dummy
        that.arr = [new google.maps.LatLng(40.44350962488237, -79.94512796401978),
            new google.maps.LatLng(40.44360760645317, -79.94475245475769),
            new google.maps.LatLng(40.44394645828453, -79.94463980197906),
            new google.maps.LatLng(40.444154667598696, -79.94502067565918),
            new google.maps.LatLng(40.44429347344985, -79.94556248188019),
            new google.maps.LatLng(40.44426081327539, -79.94597554206848),
            new google.maps.LatLng(0, 0)
                ];

        that.timer();
    });
}

/**
 * This timer track the users position before the race starts.
 * Hence pre-Timer
 * It keeps a marker at the user's current location,
 * and the current location updates itself very T=500 ms
 */
geo.prototype.preTimer = function() {
    var that = this;
    that.preTimerId = setInterval(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            // update
            if (that.centerMarker !== null) {
                that.centerMarker.setMap(null);
            }
            that.centerMarker = new google.maps.Marker({
                map: that.map,
                draggable: false,
                icon: 'images/geo/curr.png',
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            });
            that.centerMarker.setMap(that.map);

            that.map.setCenter(
                new google.maps.LatLng(position.coords.latitude, 
                    position.coords.longitude)
            );
        }, that.errCallBack, that.geoOptions);
    }, 500);
}

/**
 * finish the race, send server the racing data
 */
geo.prototype.finishButton = function() {
    var that = this;
    $("#finish-run-btn").click(function() {
        $('#rec-icon').hide();
        // stop tracking
        clearInterval(that.timerId);
        navigator.geolocation.getCurrentPosition(function(position) {
            // TODO, possible bug here, what if a finish is pressed before any timer fire
            var finishMarker = new google.maps.Marker({
                map: that.map,
                draggable: false,
                icon: that.endImage,
                shadow: that.shadow,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            });
            finishMarker.setMap(that.map);
            google.maps.event.addListener(finishMarker, 'click', bounce);
            function bounce() {
                finishMarker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() { finishMarker.setAnimation(null);}, 500);
            }
        }, that.errCallBack, that.geoOptions);

        vars = getUrlVars();

        // send to server
        var raceJson = {
            // _id: that._id,

            // route: that.route,
            distance: that.distance,
            start_date: that.start_date,
            finish_date: new Date(),
            duration: that.duration,
            pace: that.duration/that.distance,
            owner_id: vars.owner_id,
            owner_first_name: vars.owner_first,
            owner_last_name: vars.owner_last,
            opponent_id: vars.opponent_id,
            opponent_first_name: vars.opp_first,
            opponent_last_name: vars.opp_last
        };

        if(vars.source === 'new-race'){
            raceJson.owner_route = JSON.stringify({
                    route: that.route
            });
            raceJson.owner_distance = that.distance;
            raceJson.status = "waiting";
        }
        else if(vars.source === 'active'){
            raceJson.opponent_route = JSON.stringify({
                    route: that.route
            });
            raceJson.opponent_distance = that.distance;
            raceJson.status = "finished";
        }
                //         var race = {
                //     owner_id: me.id,
                //     owner_first_name: me.name.givenName,
                //     owner_last_name: me.name.familyName,
                //     opponent_id: object.id,
                //     opponent_first_name: friendFirst,
                //     opponent_last_name: friendLast,
                //     status: "waiting",
                // };
        console.log(raceJson);

        if(vars.source === 'new-race'){
            createRace(raceJson, function(object){
                log("success craete race");
                log(object);
                log(JSON.parse(object.owner_route).route);
                $.mobile.changePage("/static/details.html?race=" + object._id+"&source=active");

            },function(err){
                log("err create race");
                log(err);
            });
        }
        else if(vars.source === 'active'){
            updateRace(raceJson, function(object){
                log(object);
                $.mobile.changePage("/static/details.html?race=" + object._id+"&source=finished"); 
            },function(err){
                log("err update race");
                log(err);
            });
        }

        // race = {

        // };

        // createRace(race,function(newRace){
        //     if(newRace){

        //     }
        // });
        // updateRace(raceJson, that.ajaxSuccess, that.ajaxFailure);

        // redirect to race details after finish

    });
}

geo.prototype.ajaxSuccess = function() {
    console.log("ajax success");
}

geo.prototype.ajaxFailure = function() {
    console.log("ajax failure");
}

/**
 * Handle updating the user's runnning route every T = 1s interval
 */
geo.prototype.timer = function() {
    var that = this;
    that.timerId = setInterval(function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("timer", that.duration);
            that.duration ++;
            var path = that.runPath.getPath();
            // TODO real
            var pt = new google.maps.LatLng(position.coords.latitude, 
                                             position.coords.longitude);
            that.map.setCenter(pt);
            path.push(pt);
            that.mapBounds.extend(pt);
            that.map.fitBounds(that.mapBounds);
            that.route.push({
                lat: pt.$a,
                lon: pt.ab
            });
            that.distance += that.delta2Pts(that.route[that.route.length-2], that.route[that.route.length-1]);
            
            // TODO dummy
            // if (that.arr.length !== 0) { 
            //     var pt = that.arr.pop();
            //     that.map.setCenter(pt);
            //     path.push(pt); 
            //     that.mapBounds.extend(pt);
            //     that.map.fitBounds(that.mapBounds);
            //     that.route.push({
            //         lat: pt.$a,
            //         lon: pt.ab
            //     });
            //     that.distance += that.delta2Pts(that.route[that.route.length-2], that.route[that.route.length-1]);
            // }
        }, that.errCallBack, that.geoOptions);
    }, 1000);
}

/**
 * Calculate distance between 2 (latitude, longitude) pairs 
 * From http://www.movable-type.co.uk/scripts/latlong.html
 * This function is not very accurate.
 */
geo.prototype.delta2Pts = function(a, b) {
    var lat1 = a.lat;
    var lat2 = b.lat;
    var lon1 = a.lon;
    var lon2 = b.lon;

    var R = 6371000; // km
    var dLat = this.toRad(lat2-lat1);
    var dLon = this.toRad(lon2-lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);
    
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 

    return R * c;
}

geo.prototype.toRad = function(number) {
    return number * Math.PI / 180;
}

// HERE WE GO
new geo();
