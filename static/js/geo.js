var geo = function(option) {
    this.setup(option);
}

var testRoute = [
                {
                    lat: 40.444584,
                        lon: -79.942907
                },
                {
                    lat: 40.444574,
                    lon: -79.942912
                },
                {
                    lat: 40.444561,
                    lon: -79.942918
                },
                {
                    lat: 40.444538,
                    lon: -79.942929
                },
                {
                    lat: 40.444516,
                    lon: -79.942937
                },
                {
                    lat: 40.444497,
                    lon: -79.942945
                },
                {
                    lat: 40.444475,
                    lon: -79.942961
                },
                {
                    lat: 40.444449,
                    lon: -79.942969
                },
                {
                    lat: 40.444418,
                    lon: -79.942993
                },
                {
                    lat: 40.444389,
                    lon: -79.943012
                },
                {
                    lat: 40.444357,
                    lon: -79.943023
                },
                {
                    lat: 40.444314,
                    lon: -79.943028
                },
                {
                    lat: 40.444259,
                    lon: -79.943041
                },
                {
                    lat: 40.444212,
                    lon: -79.943057
                },
                {
                    lat: 40.444181,
                    lon: -79.943068
                },
                {
                    lat: 40.444134,
                    lon: -79.943095
                },
                {
                    lat: 40.444083,
                    lon: -79.943106
                },
                {
                    lat: 40.444003,
                    lon: -79.943128
                },
                {
                    lat: 40.44393,
                    lon: -79.943154
                },
                {
                    lat: 40.443848,
                    lon: -79.943181
                },
                {
                    lat: 40.443787,
                    lon: -79.943197
                },
                {
                    lat: 40.44372,
                    lon: -79.943219
                },
                {
                    lat: 40.443673,
                    lon: -79.94323
                },
                {
                    lat: 40.443623,
                    lon: -79.943251
                },
                {
                    lat: 40.443582,
                    lon: -79.943264
                },
                {
                    lat: 40.443542,
                    lon: -79.94328
                },
                {
                    lat: 40.443503,
                    lon: -79.94331
                },
                {
                    lat: 40.443468,
                    lon: -79.94332
                },
                {
                    lat: 40.443419,
                    lon: -79.943339
                },
                {
                    lat: 40.443384,
                    lon: -79.943369
                },
                {
                    lat: 40.443336,
                    lon: -79.94337
                },
                {
                    lat: 40.443289,
                    lon: -79.943359
                },
                {
                    lat: 40.443221,
                    lon: -79.943354
                },
                {
                    lat: 40.443191,
                    lon: -79.943351
                },
                {
                    lat: 40.443162,
                    lon: -79.943316
                },
                {
                    lat: 40.443148,
                    lon: -79.943263
                },
                {
                    lat: 40.443128,
                    lon: -79.943196
                },
                {
                    lat: 40.443117,
                    lon: -79.943115
                },
                {
                    lat: 40.443095,
                    lon: -79.943035
                },
                {
                    lat: 40.443085,
                    lon: -79.942951
                },
                {
                    lat: 40.443079,
                    lon: -79.942876
                },
                {
                    lat: 40.443064,
                    lon: -79.942809
                },
                {
                    lat: 40.443054,
                    lon: -79.942734
                },
                {
                    lat: 40.44303,
                    lon: -79.942675
                },
                {
                    lat: 40.442999,
                    lon: -79.94264
                },
                {
                    lat: 40.442977,
                    lon: -79.942587
                },
                {
                    lat: 40.442968,
                    lon: -79.942493
                },
                {
                    lat: 40.442962,
                    lon: -79.94242
                },
                {
                    lat: 40.442952,
                    lon: -79.942345
                },
                {
                    lat: 40.44294,
                    lon: -79.94227
                },
                {
                    lat: 40.442919,
                    lon: -79.942208
                },
                {
                    lat: 40.442887,
                    lon: -79.942168
                },
                {
                    lat: 40.442856,
                    lon: -79.942131
                },
                {
                    lat: 40.442842,
                    lon: -79.94204
                },
                {
                    lat: 40.442839,
                    lon: -79.941955
                },
                {
                    lat: 40.442824,
                    lon: -79.941842
                },
                {
                    lat: 40.442809,
                    lon: -79.941786
                },
                {
                    lat: 40.442783,
                    lon: -79.941738
                },
                {
                    lat: 40.44276,
                    lon: -79.941695
                },
                {
                    lat: 40.442734,
                    lon: -79.941652
                },
                {
                    lat: 40.442701,
                    lon: -79.941585
                },
                {
                    lat: 40.442672,
                    lon: -79.941534
                },
                {
                    lat: 40.442687,
                    lon: -79.941424
                },
                {
                    lat: 40.44276,
                    lon: -79.941413
                },
                {
                    lat: 40.44284,
                    lon: -79.941408
                },
                {
                    lat: 40.442895,
                    lon: -79.94137
                },
                {
                    lat: 40.442944,
                    lon: -79.941311
                },
                {
                    lat: 40.443015,
                    lon: -79.941338
                },
                {
                    lat: 40.443072,
                    lon: -79.941317
                },
                {
                    lat: 40.44314,
                    lon: -79.941341
                },
                {
                    lat: 40.44323,
                    lon: -79.94136
                },
                {
                    lat: 40.443293,
                    lon: -79.941378
                },
                {
                    lat: 40.443358,
                    lon: -79.941354
                },
                {
                    lat: 40.443422,
                    lon: -79.941378
                },
                {
                    lat: 40.443464,
                    lon: -79.941338
                },
                {
                    lat: 40.443536,
                    lon: -79.941343
                },
                {
                    lat: 40.443613,
                    lon: -79.94133
                },
                {
                    lat: 40.443658,
                    lon: -79.94136
                },
                {
                    lat: 40.443703,
                    lon: -79.941392
                },
                {
                    lat: 40.443732,
                    lon: -79.94144
                },
                {
                    lat: 40.443754,
                    lon: -79.941475
                },
                {
                    lat: 40.443773,
                    lon: -79.941518
                },
                {
                    lat: 40.443789,
                    lon: -79.941555
                },
                {
                    lat: 40.443793,
                    lon: -79.941604
                },
                {
                    lat: 40.443803,
                    lon: -79.941665
                },
                {
                    lat: 40.443809,
                    lon: -79.941735
                },
                {
                    lat: 40.443815,
                    lon: -79.941786
                },
                {
                    lat: 40.443852,
                    lon: -79.941832
                },
                {
                    lat: 40.443885,
                    lon: -79.941872
                },
                {
                    lat: 40.443918,
                    lon: -79.941917
                },
                {
                    lat: 40.443942,
                    lon: -79.941958
                },
                {
                    lat: 40.443987,
                    lon: -79.941998
                },
                {
                    lat: 40.44403,
                    lon: -79.942035
                },
                {
                    lat: 40.444075,
                    lon: -79.942081
                },
                {
                    lat: 40.444091,
                    lon: -79.942129
                },
                {
                    lat: 40.444103,
                    lon: -79.942186
                },
                {
                    lat: 40.444113,
                    lon: -79.942258
                },
                {
                    lat: 40.444128,
                    lon: -79.942325
                },
                {
                    lat: 40.44414,
                    lon: -79.942387
                },
                {
                    lat: 40.444171,
                    lon: -79.942446
                },
                {
                    lat: 40.444195,
                    lon: -79.942481
                },
                {
                    lat: 40.444201,
                    lon: -79.942532
                },
                {
                    lat: 40.444205,
                    lon: -79.94258
                },
                {
                    lat: 40.444207,
                    lon: -79.942631
                },
                {
                    lat: 40.44422,
                    lon: -79.942682
                },
                {
                    lat: 40.444236,
                    lon: -79.942725
                },
                {
                    lat: 40.44424,
                    lon: -79.942776
                },
                {
                    lat: 40.444244,
                    lon: -79.942819
                },
                {
                    lat: 40.444273,
                    lon: -79.94287
                }
                ];

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


function foo(successCallback,errCallBack, option){
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
            count ++;
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

                // var ownerRoute = JSON.parse( $('body').data('race').owner_route).route;
                var ownerRoute = testRoute;

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
                            animation: google.maps.Animation.DROP
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
    // $('#'+this.startButtonId).click(function(){
    //                 $("#start-run-btn").hide();
    //     $("#finish-run-btn").show();
    //     window.sid = setInterval(function(){
    //         foo(log);
    //     }, 1000);
    // });

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
        foo(function(position) {
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
        foo(function(position) {
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
            
            console.log(getUrlVars().mode);
            if (getUrlVars().mode === 'same') {

                // FOR DEMO ONLY: click on arrive instruction to be able to start racing anywhere
                $('#arrive-instruction').bind('click',function(){
                    $('#arrive-instruction').hide();
                    $('#start-run-btn').show();
                })

                if($('body').data('race')) {
                    // var ownerRoute = JSON.parse( $('body').data('race').owner_route).route;
                    var ownerRoute = testRoute;
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
        foo(function(position) {
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
            alert("Your run is too short. Dev purpose, saving the race anyway");

            // $.mobile.changePage("/static/active.html"); 
            // return;
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
                $.mobile.changePage("/static/details.html?race=" + object._id+"&source=active");

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
        foo(function(position) {


            console.log("timer", that.duration);
            console.log(position.coords);
            console.log((position.coords.latitude + "/"+ position.coords.longitude));

            // TODO: testing output
            // $('.racing-label').html("#" + that.duration + " : " +position.coords.latitude + "/"+ position.coords.longitude);
            // $('.racing-label').html("hello");


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
                    //TODO
                    $('#'+that.finishButtonId).click();
                }
            }
            // $('h1').html( that.distance);
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
