var geo = function(option) {
    this.setup(option);
}

// when accepting a race, if distance left is smaller than this (meters), race is considered as finished
var finishDistTolerace = 5;

geo.prototype.setup = function(option) {
    var nop = function() {};
    if (!navigator.geolocation) {
        navigator.geolocation = {};
    }
    if (!navigator.geolocation.getCurrentPosition) {
        navigator.geolocation.getCurrentPosition = nop;
    }

    // send these to server in a json
    this.startButtonId = option.startButtonId;
    this.finishButtonId = option.finishButtonId;
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
    console.log("Error: " + code + ", " + err.message);
}


function detectPos(successCallback,errCallBack, option){
        // console.log("getPosition called once");
    var nop = function() { };
    if (!navigator.geolocation) {
        navigator.geolocation = {};
    }
    if (!navigator.geolocation.getCurrentPosition) {
        navigator.geolocation.getCurrentPosition = nop;
    }
    window.wid = navigator.geolocation.watchPosition(function(position){
        // console.log("This one : " + position.coords.latitude + "/" + position.coords.longitude);
        window.lastPosition  = position.coords.latitude + "/" + position.coords.longitude;
        window.toReturn = position;
    }, errCallBack, option);
    setTimeout( function(){
        navigator.geolocation.clearWatch(window.wid);
        // console.log("lastPosition: " + window.lastPosition);
        // $('.racing-label').html("#" + count + " : " + window.lastPosition);
        successCallback(window.toReturn);
    } ,700)
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

        // show owner route
        if (getUrlVars().mode === 'same') {
            if($('body').data('race')) {

                console.log(that.map);

                var ownerRoute = JSON.parse( $('body').data('race').owner_route).route;
                var pt = ownerRoute[0] || ownerRoute[1] || ownerRoute[2];
                var ownerStartCoord = new google.maps.LatLng(pt.lat, pt.lon);

                // show owner start marker
                var ownerStartMarker = new google.maps.Marker({
                    map: that.map,
                    draggable: false,
                    icon: that.startImage,
                    shadow: that.shadow,
                    animation: google.maps.Animation.DROP,
                    position: ownerStartCoord
                });
                ownerStartMarker.setMap(that.map);

                // show owner path
                var ownerPathOptions = {
                    strokeColor: "#ed3e7c",
                    strokeOpacity: 0.6,
                    strokeWeight: 6
                };
                var ownerPath = new google.maps.Polyline(ownerPathOptions);
                ownerPath.setMap(that.map);
                var ownerMapBounds = new google.maps.LatLngBounds();

                var path = ownerPath.getPath();
                for (var i=0; i<ownerRoute.length; i++) {
                    var coord = new google.maps.LatLng(ownerRoute[i].lat, ownerRoute[i].lon);
                    path.push(coord);
                    ownerMapBounds.extend(coord);
                    that.map.fitBounds(ownerMapBounds);
                    if (i === ownerRoute.length-1) {
                        var ownerFinishMarker = new google.maps.Marker({
                            map: that.map,
                            draggable: false,
                            icon: that.endImage,
                            shadow: that.shadow,
                            animation: google.maps.Animation.DROP,
                            position: coord
                        });
                        ownerFinishMarker.setMap(that.map);
                    }
                }
            }
        }
        // track current location
        that.preTimer();
    }, that.errCallBack, that.geoOptions);
}

/**
 * When user press start, drop the start pin and start tracking the user's run
 */
geo.prototype.startButton = function() {
    
    var that = this;

    $("#"+this.startButtonId).click(function(){
        $("#start-run-btn").hide();

        // if starting a new race, show finish button
        if(getUrlVars().source === 'new-race'){
            $("#finish-run-btn").show();
        }
        // if accepting a race, show how many mi there are left
        else{
            $('#distance-instruction').show();
            $('#distance-left').html(metersToMiles($('body').data('race').owner_distance, 3))
            // console.log($('body').data('race'));
        }
        
        $('#rec-icon').show();
        clearInterval(that.preTimerId);
        that.start_date = new Date();
        if(that.centerMarker){
            that.centerMarker.setMap(null);
        }

        //////////////////////////// START MARKER ////////////////////////////
        detectPos(function(position) {
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
        console.log(getUrlVars().source);

        // BXIA
        var color;
        if(getUrlVars().source === 'new-race'){
            color = "#ed3e7c"; // owner
        }
        else{
            color = "#37c874"; // opponent
        }

        var runPathOptions = {
            strokeColor: color,
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
        detectPos(function(position) {
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
            if(that.map)
                that.map.setCenter(
                    new google.maps.LatLng(position.coords.latitude, 
                        position.coords.longitude)
                );
            console.log("Pretimer got curr position: " + position.coords.latitude + " / " + position.coords.longitude);
        

            // BXIA
            // if accepting race with same route, activate start button only when close enough to start point
            
            // console.log(getUrlVars().mode);
            if (getUrlVars().mode === 'same') {

                // FOR DEMO ONLY: click on arrive instruction to be able to start racing anywhere
                $('#arrive-instruction').bind('click',function(){
                    $('#arrive-instruction').hide();
                    $('#start-run-btn').show();
                })

                if($('body').data('race')) {
                    var ownerRoute = JSON.parse( $('body').data('race').owner_route).route;
                    var startPoint = ownerRoute[1] || ownerRoute[2] || ownerRoute[3];
                    console.log("startPoint");
                    console.log(startPoint);
                    var distToStart = that.delta2Pts(startPoint, {lat: position.coords.latitude, lon:position.coords.longitude});
                    // var distToStart = 10000;
                    if (distToStart < finishDistTolerace) {
                        $('#arrive-instruction').hide();
                        $('#start-run-btn').show();
                    }
                    if (distToStart > 16000 * 5) {
                        alert("TOO FAR");
                    }
                }
            }
        }, that.errCallBack, that.geoOptions);

        
    }, 3000);


}

/**
 * finish the race, send server the racing data
 */
geo.prototype.finishButton = function() {
    // navigator.geolocation.clearWatch(window.wid);
    // clearInterval(window.sid);
    var that = this;
    $("#"+this.finishButtonId).click(function() {
            // console.log("clearing: " + that.timerId);

        $('#rec-icon').hide();
        // stop tracking
        clearInterval(that.timerId);
        clearInterval(that.preTimerId);
        detectPos(function(position) {
            // TODO, possible bug here, what if a finish is pressed before any timer fire
            var finishMarker = new google.maps.Marker({
                map: that.map,
                draggable: false,
                icon: that.endImage,
                shadow: that.shadow,
                // animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            });
            finishMarker.setMap(that.map);
            google.maps.event.addListener(finishMarker, 'click', bounce);
            function bounce() {
                finishMarker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() { finishMarker.setAnimation(null);}, 500);
            }
        }, that.errCallBack, that.geoOptions);


        if(that.distance < 17 ){
            alert("Your run is too short. Please try a longer run.");

            $.mobile.changePage("/static/active.html"); 
            return;
        }

        vars = getUrlVars();

        var raceJson;
        // console.log(that.route);
        if(vars.source === 'new-race'){
            raceJson = {
                owner_id: vars.owner_id,
                owner_first_name: vars.owner_first,
                owner_last_name: vars.owner_last,
                opponent_id: vars.opponent_id,
                opponent_first_name: vars.opp_first,
                opponent_last_name: vars.opp_last,
                owner_distance : that.distance || 0,
                owner_start_date : that.start_date,
                owner_finish_date : new Date(),
                // owner_pace  : that.duration/that.distance || 0,
                owner_time  : that.duration,
                owner_route : JSON.stringify({route : that.route}),
                status      : "waiting"
            }
            raceJson.owner_pace = (that.distance)? that.duration/that.distance : 0;
            console.log(raceJson);
            createRace(raceJson, function(object){
                log("success craete race");
                log(object);
                log(JSON.parse(object.owner_route).route);
                setTimeout(function(){
                    $.mobile.changePage("/static/details.html?race=" + object._id+"&source=active");
                }, 1000);
                

            },function(err){
                log("err create race");
                alert("err in creating the race.");
                $.mobile.changePage("/static/active.html");
                log(err);
            });
        }
        else if(vars.source === 'active'){
            var raceJson = $('body').data('race');
            raceJson.opponent_distance = that.distance;
            raceJson.opponent_start_date =that.start_date;
            raceJson.opponent_finish_date = new Date();
            // raceJson.opponent_pace  =that.duration/that.distance;
            raceJson.opponent_time  =that.duration;
            raceJson.opponent_route = JSON.stringify({route : that.route});
            raceJson.status      = "finished";
            raceJson.mode        = vars.mode;
            raceJson.opponent_pace = (that.distance)? that.duration/that.distance : 0;
            log("before send. front end json");
            log(raceJson);
            updateRace(raceJson, function(object){
                log("from server. backend json");
                log(object);
                $.mobile.changePage("/static/details.html?race=" + raceJson._id+"&source=finished"); 
            },function(err){
                log("err update race");
                log(err);
            });
        }
    });
}


/**
 * Handle updating the user's runnning route every T = 1s interval
 */
geo.prototype.timer = function() {
    var that = this;
    that.timerId = setInterval(function() {
        detectPos(function(position) {

            // console.log("timer", that.duration);
            // console.log(position.coords);
            // console.log((position.coords.latitude + "/"+ position.coords.longitude));

            that.duration += 2;
            var path = that.runPath.getPath();
            // TODO real
            var pt = new google.maps.LatLng(position.coords.latitude, 
                                             position.coords.longitude);
            that.map.setCenter(pt);
            path.push(pt);
            that.mapBounds.extend(pt);
            that.map.fitBounds(that.mapBounds);
            that.route.push({
                /////ZIW
                lat : pt.Ya,
                lon : pt.Za

                // lat: pt.$a,
                // lon: pt.ab
            });
            that.distance += that.delta2Pts(that.route[that.route.length-2], that.route[that.route.length-1]) || 0;
            console.log(that.delta2Pts(that.route[that.route.length-2], that.route[that.route.length-1]));
            console.log(that.distance);

            // BXIA
            // show distance left (only when accepting race)
            if(getUrlVars().source !== 'new-race'){
                var ownerDist = $('body').data('race').owner_distance;
                var distLeft = ownerDist-that.distance;
                $('#distance-left').html(metersToMiles(distLeft, 3));

                // mark race as finished if distance left is too small
                if (distLeft < finishDistTolerace){
                    $('#'+that.finishButtonId).click();
                }
            }
        }, that.errCallBack, that.geoOptions);
    }, 2000);
    console.log(that.timerId + " timer id");
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