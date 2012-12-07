// max # of char to display in profile page name label
var maxProfileNameLength = 12;

// max # of char to display in race pages name label
var maxRaceNameLength = 9;


// active races page
$('#active-races').bind('pageshow', function(){
	$('#new-btn').bind('click', function(){
		window.location.href="/newrace";
	});
	$('.profile-link').removeClass('ui-btn-active').removeClass('ui-state-persist');

	//get owned races
	getMyself(function(myself){
		getOwnedRaces(myself.id, function(ownedRaces){
			console.log(ownedRaces);

			//sort array by recency
			ownedRaces.sort(function(a,b){
				// if (a.creation_date !== null && b.c)
				if (a.creation_date < b.creation_date){
					return 1;
				}
				else{
					return -1;
				}
			});

			console.log(ownedRaces);

			//TODO: FILTER RACES TO ONLY WAITING
			for (var i=0; i<ownedRaces.length; i++){
				var opponent = ownedRaces[i].opponent_id;
			};
		});
		
	});

});


// populate new race page with friend list
$('#new-race').bind('pageshow', function(){
	// alert("hello");

	getAllFriends(function  (list) {
		//check for error
		if (isNull(list)){
			console.log("error - null");
			return;
		}
		else if (list.status === 0){
			console.log("error");
			console.log(list.status);
			return;
		}

		// alert("world");
		list.sort(function(a,b) {
			return compare(a, b, "name"); 
		});

		for (var i=0; i<list.length; i++){
			$("<li><img class='avatar'><a href='profile.html?id="+list[i].id+"'><p>"+list[i].name+"</p></a></li>").appendTo('#friend-list ul').trigger("create");
		}

		$("#friend-list ul").listview("refresh");
	}, log);
});


//populate profile page with given user's information & hook up race button
$('#profile-page').bind('pageshow', function(){

	getMyself(function(myself){
		// hide page and show loading screen
		$('#profile-content').hide();
		$.mobile.showPageLoadingMsg();

		// console.log(getUrlVars().id);
		if (getUrlVars().id === "myself"){
			// show page after load
			$.mobile.hidePageLoadingMsg();

			var displayName = formatName(myself.first_name, myself.last_name);

			// show user name
			$('#profile-name').html(displayName);
			// hide race button and back button
			$('#start-race-btn').hide();
			$('#back-btn').remove();

			$('.profile-link').addClass('ui-btn-active').addClass('ui-state-persist');

			$('#profile-content').show();
		}
		
		else{
			getFBUserById(getUrlVars().id, function(user){
				if (isNull(user)){
					console.log("error - null");
					return;
				}
				else if (user.status === 0){
					console.log("error");
					console.log(user.status);
					return;
				}

				// hide loading spinner
				$.mobile.hidePageLoadingMsg();

				var displayName = formatName(user.first_name, user.last_name);
				
				// display user data
				$('#profile-name').html(displayName);
				$('#start-race-btn').find('.ui-btn-text').text("Race with "+user.first_name+"!");

				// change current tab to active
				$('.profile-link').removeClass('ui-btn-active').removeClass('ui-state-persist');
				$('.active-link').addClass('ui-btn-active').addClass('ui-state-persist');

				// show page
				$('#profile-content').show();


				// bind create new race event
				$('#start-race-btn').bind('click', function(){
					var race = {
						owner_id: myself.id,
						owner_name: {
							first_name: myself.first_name,
							last_name: myself.last_name
						},
						opponent_id: user.id,
						opponent_name: {
							first_name: user.first_name,
							last_name: user.last_name
						},
						status: "created",

					};
					createRace(race, function(object){
						if (isNull(object)){
							console.log("error - null");
							window.location.href="/";
							alert("ERROR - NULL");
							return;
						}
						else if (object.status === 0){
							console.log("error");
							console.log(object.status);
							window.location.href="/";
							alert("ERROR - STATUS0");
							return;
						}
						window.location.href="/";
						alert("race created");
					});

				});

			}, function(error){
				console.log(error);
			});

		}
		

	

	});





});







// --------- HELPER METHODS ---------- //


//compareto function for strings
function compare(el1, el2, index) {
  return el1[index] == el2[index] ? 0 : (el1[index] < el2[index] ? -1 : 1);
}

// format name for profile page
function formatName(firstName, lastName){
	var displayName;
	if (firstName.length >= maxProfileNameLength-3){
		displayName = firstName;
	}
	else if (firstName.length + lastName.length +1 >= maxProfileNameLength){
		displayName = firstName + " " + lastName.charAt(0) + ".";
	}
	else{
		displayName = firstName + " " + lastName;
	}
	return displayName;

}

// get page params from url
function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }
  return vars;
}