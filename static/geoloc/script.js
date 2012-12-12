window.onload = function(){

	// keep track of which row new data goes to
	var rowCount = 0;

	var nop = function() { };
	var watchId;

	if (!navigator.geolocation) {
	    navigator.geolocation = {};
	}
	if (!navigator.geolocation.getCurrentPosition) {
	    navigator.geolocation.getCurrentPosition = nop;
	}

	// fill in row0 on load
    navigator.geolocation.getCurrentPosition(function(position) {
    	var coords = position.coords;
    	fillRow(coords);
    	rowCount++;
     });

    // creates a new row and calls fillRow to fill in data
 	function newRow(coords){
 		$('#positions tbody').append("<tr id='row"+rowCount+"'><td class='num'>"+rowCount+"</td><td class='lat'></td><td class='lon'></td><td class='acc'></td><td class='spd'></td><td class='alt'></td><td class='altacc'></td></tr>");
 		fillRow(coords);
 		rowCount++;
 	}

 	// fills in given data for a given row
 	function fillRow(coords){
 		var row = $('#row'+rowCount);	// set row number

 		// parse data and display in table
 		var lat = (coords.latitude == null? 'null' : coords.latitude);
 		var lon = (coords.longitude == null? 'null' : coords.longitude);
 		var acc = (coords.accuracy == null? 'null' : coords.accuracy);
 		var spd = (coords.speed == null? 'null' : coords.speed);
    	var alt = (coords.altitude == null? 'null' : coords.altitude);
    	var altacc = (coords.altitudeAccuracy == null? 'null' : coords.altitudeAccuracy);

    	row.find('.lat').html(lat);
    	row.find('.lon').html(lon);
    	row.find('.acc').html(acc);
    	row.find('.spd').html(spd);
    	row.find('.alt').html(alt);
    	row.find('.altacc').html(altacc);

 	}
  
 	// when callback successful, create a new row and fill with data
	function successCallback(position) {
		newRow(position.coords);
	}

	// when callback unsuccessful, display error message
	function errCallback(err) {
		var message = err.message;
		var code = err.code;
		document.getElementById('location').innerHTML = "Erorr: " + code + ", " + err.message;
		//code = 0 => UNKNOWN_ERROR, 1 => PERMISSION_DENIED, 2 => POSITION_UNAVAILABLE, 3 => TIMEOUT
	}

	// options for geolocation callback
	var options = { 
		enableHighAccuracy: true,
		maximumAge: 250,
		timeout: 10000
	};

	// set action for start/stop watch button
	$('#toggle').bind('click', function() {
		if ($('#toggle').hasClass('stop')){
			console.log("stop");
			navigator.geolocation.clearWatch(watchId);
			$('#toggle').html('Start Watching Position');
		}
		else{
			console.log("start");
			watchId = navigator.geolocation.watchPosition(successCallback, errCallback, options);
		
			$('#toggle').html('Stop Watching Position');
		}
		$('#toggle').toggleClass('start stop');
	});

}