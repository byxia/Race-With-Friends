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


var testRoute1 = [
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


var testRoute2 = [
{
    lat: 40.444589,
    lon: -79.942905
},
{
    lat: 40.444556,
    lon: -79.942926
},
{
    lat: 40.444526,
    lon: -79.942958
},
{
    lat: 40.444485,
    lon: -79.942974
},
{
    lat: 40.444442,
    lon: -79.942988
},
{
    lat: 40.444385,
    lon: -79.943004
},
{
    lat: 40.444354,
    lon: -79.943028
},
{
    lat: 40.444301,
    lon: -79.943028
},
{
    lat: 40.444263,
    lon: -79.943006
},
{
    lat: 40.444216,
    lon: -79.943028
},
{
    lat: 40.444173,
    lon: -79.943036
},
{
    lat: 40.444122,
    lon: -79.943074
},
{
    lat: 40.444062,
    lon: -79.943087
},
{
    lat: 40.444016,
    lon: -79.943116
},
{
    lat: 40.443967,
    lon: -79.943143
},
{
    lat: 40.443915,
    lon: -79.943167
},
{
    lat: 40.443862,
    lon: -79.943189
},
{
    lat: 40.443815,
    lon: -79.94321
},
{
    lat: 40.443777,
    lon: -79.94324
},
{
    lat: 40.44373,
    lon: -79.943242
},
{
    lat: 40.443689,
    lon: -79.943259
},
{
    lat: 40.443642,
    lon: -79.94328
},
{
    lat: 40.443601,
    lon: -79.943304
},
{
    lat: 40.443546,
    lon: -79.943312
},
{
    lat: 40.443501,
    lon: -79.943331
},
{
    lat: 40.44345,
    lon: -79.943336
},
{
    lat: 40.44345,
    lon: -79.943336
},
{
    lat: 40.443409,
    lon: -79.943344
},
{
    lat: 40.443338,
    lon: -79.943366
},
{
    lat: 40.443277,
    lon: -79.943387
},
{
    lat: 40.443215,
    lon: -79.943398
},
{
    lat: 40.443179,
    lon: -79.943358
},
{
    lat: 40.443156,
    lon: -79.943283
},
{
    lat: 40.443142,
    lon: -79.943226
},
{
    lat: 40.443126,
    lon: -79.943157
},
{
    lat: 40.44314,
    lon: -79.943068
},
{
    lat: 40.443134,
    lon: -79.942982
},
{
    lat: 40.443119,
    lon: -79.942915
},
{
    lat: 40.443083,
    lon: -79.94284
},
{
    lat: 40.443056,
    lon: -79.942765
},
{
    lat: 40.443034,
    lon: -79.942719
},
{
    lat: 40.442974,
    lon: -79.942658
},
{
    lat: 40.442919,
    lon: -79.942612
},
{
    lat: 40.442897,
    lon: -79.942524
},
{
    lat: 40.442872,
    lon: -79.942443
},
{
    lat: 40.442858,
    lon: -79.942333
},
{
    lat: 40.442844,
    lon: -79.942253
},
{
    lat: 40.442821,
    lon: -79.942156
},
{
    lat: 40.442803,
    lon: -79.942062
},
{
    lat: 40.442783,
    lon: -79.941966
},
{
    lat: 40.44276,
    lon: -79.94188
},
{
    lat: 40.442746,
    lon: -79.941781
},
{
    lat: 40.442721,
    lon: -79.941692
},
{
    lat: 40.442701,
    lon: -79.941604
},
{
    lat: 40.442701,
    lon: -79.941529
},
{
    lat: 40.442723,
    lon: -79.941478
},
{
    lat: 40.442789,
    lon: -79.941443
},
{
    lat: 40.442862,
    lon: -79.941432
},
{
    lat: 40.442928,
    lon: -79.941443
},
{
    lat: 40.443009,
    lon: -79.941429
},
{
    lat: 40.443093,
    lon: -79.941424
},
{
    lat: 40.443189,
    lon: -79.94144
},
{
    lat: 40.443297,
    lon: -79.941427
},
{
    lat: 40.443391,
    lon: -79.941411
},
{
    lat: 40.443468,
    lon: -79.941381
},
{
    lat: 40.44356,
    lon: -79.94136
},
{
    lat: 40.443636,
    lon: -79.941333
},
{
    lat: 40.443715,
    lon: -79.941325
},
{
    lat: 40.443779,
    lon: -79.941352
},
{
    lat: 40.44384,
    lon: -79.941392
},
{
    lat: 40.443881,
    lon: -79.941435
},
{
    lat: 40.443936,
    lon: -79.941491
},
{
    lat: 40.443964,
    lon: -79.941566
},
{
    lat: 40.443983,
    lon: -79.941625
},
{
    lat: 40.444001,
    lon: -79.941714
},
{
    lat: 40.444022,
    lon: -79.941783
},
{
    lat: 40.444034,
    lon: -79.941842
},
{
    lat: 40.444052,
    lon: -79.941923
},
{
    lat: 40.444062,
    lon: -79.941993
},
{
    lat: 40.444075,
    lon: -79.942068
},
{
    lat: 40.444095,
    lon: -79.942135
},
{
    lat: 40.444109,
    lon: -79.942191
},
{
    lat: 40.444122,
    lon: -79.942269
},
{
    lat: 40.444132,
    lon: -79.942333
},
{
    lat: 40.444146,
    lon: -79.9424
},
{
    lat: 40.444144,
    lon: -79.942454
},
{
    lat: 40.444154,
    lon: -79.942505
},
{
    lat: 40.444185,
    lon: -79.942559
},
{
    lat: 40.444201,
    lon: -79.942604
},
{
    lat: 40.444216,
    lon: -79.94265
},
{
    lat: 40.444216,
    lon: -79.942698
},
{
    lat: 40.444222,
    lon: -79.942754
},
{
    lat: 40.444222,
    lon: -79.942805
}

]


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
        this.soloMapHelper("map00", "#same-play-btn");
    } else if (this.type === "same"){
        this.sameMapHelper();
    } else { // diff
        console.log("hehe");
        this.diffMapHelper();
    }
}

// playback.prototype.soloMapHelper = function(htmlId) {
    // route 1

playback.prototype.soloMapHelper = function(htmlId, whichBtn) {
    // dummy
    // this.ownerRoute = [{lat: 40.44350962488237, lon: -79.94512796401978}, 
    //                     {lat: 40.44360760645317, lon: -79.94475245475769},
    //                     {lat: 40.44394645828453, lon: -79.94463980197906},
    //                     {lat: 40.444154667598696, lon: -79.94502067565918},
    //                     {lat: 40.44429347344985, lon: -79.94556248188019},
    //                     {lat: 40.44426081327539, lon: -79.94597554206848}];

    this.ownerRoute = testRoute1;

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
    $(whichBtn).click(function() {
        $(whichBtn).hide();
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
            btnName: whichBtn
        });
    });

    return map;
}

playback.prototype.sameMapHelper = function() {

    // dummy
    // this.opponentRoute = [{lat: 40.44350962488237, lon: -79.94512796401978}, 
    //                     {lat: 40.44360760645317, lon: -79.94475245475769},
    //                     {lat: 40.44394645828453, lon: -79.94463980197906},
    //                     {lat: 40.444154667598696, lon: -79.94502067565918},
    //                     {lat: 40.44429347344985, lon: -79.94556248188019},
    //                     {lat: 40.44426081327539, lon: -79.94597554206848},
    //                     {lat: 40.44526081327536, lon: -79.94697554206848}];

    this.opponentRoute = testRoute2;
                        
    // draw owners map, which is also opponent's map since same map
    var map = this.soloMapHelper("map00", "#same-play-btn");

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
    this.soloMapHelper("map01", "#diff-play-btn");

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
            route: that.opponentRoute,
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
                if (arg.who === "owner" && that.ownerDuration <= that.opponentDuration) {
                    $(arg.btnName).show();
                }
                if (arg.who === "opponent" && that.opponentDuration <= that.ownerDuration) {
                    $(arg.btnName).show();
                }
            }
        }
        arg.cnt ++;
    }, arg.interval*1000);
}

////////////////////////
var playbackJson = {
    type: "diff",
    ownerColor: "#ed3e7c",
    ownerRoute: [],
    ownerDuration: 100,
    opponentColor: "#37c874",
    opponentRoute: [],
    opponentDuration: 10
};

// new playback(playbackJson);
