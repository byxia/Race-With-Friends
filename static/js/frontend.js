// max # of char to display in profile page name label
var maxProfileNameLength = 12;

// max # of char to display in race pages name label
var maxRaceNameLength = 9;


// active races page
$('#active-races').live('pageinit', function(){
	// console.log("showing active page");
	$('#challenged-races').html('');
	$('#owned-races').html('');

	$('#new-btn').bind('click', function(){
		window.location.href="/newrace";
	});
	$('.profile-link').removeClass('ui-btn-active').removeClass('ui-state-persist');

	//get owned races
	getMyself(function(myself){
		// console.log(myself);
		getChallengedRaces(myself.id, function(challengedRaces){
			// console.log(challengedRaces);

			$('#challenged-races').html('<li data-role="list-divider">Waiting for Your Run</li>');

			if (challengedRaces.length === 0){
				$('#challenged-races').append('\
					<li>\
						<div class="faded">no races yet</div>\
					</li>');
				$("#challenged-races").listview("refresh").trigger('create');
			}
			else{
				// sort races by recency
				challengedRaces.sort(function(a,b){
					// if (a.creation_date !== null && b.c)
					if (a.creation_date < b.creation_date){
						return 1;
					}
					else{
						return -1;
					}
				});

				//TODO: FILTER

				for (var i=0; i<challengedRaces.length; i++){
					var race = challengedRaces[i];
					var ownerId = race.owner_id;
					var owner = formatName(race.owner_first_name, race.owner_last_name, 'race');
					$('#challenged-races').append('\
						<li>\
							<div class="ui-grid-c">\
								<div class="ui-block-a">\
									<div class="person">\
										<a href="profile.html?id='+ownerId+'&source=active"><img class="avatar"></a>\
										<div class="name">'+owner+'</div>\
									</div>\
								</div>\
								<div class="ui-block-b">\
									<div class="info">\
										2.3mi run<br/>\
										4mi away\
									</div>\
								</div>\
								<div class="ui-block-c">\
									<div class="btn">\
										<a href="details.html?race='+race._id+'" data-role="button" data-transition="slide">Details</a>\
									</div>\
								</div>\
								<div class="ui-block-d">\
									<div class="btn">\
										<a href="race.html" data-role="button" data-theme="f" data-transition="slide">Race!</a>\
									</div>\
								</div>\
							</div>\
						</li>');
				};

			};

			
			$("#challenged-races").listview("refresh").trigger('create');
		});

		getOwnedRaces(myself.id, function(ownedRaces){
			// console.log(ownedRaces);

			$('#owned-races').html('<li data-role="list-divider">Waiting for Their Run</li>');

			if (ownedRaces.length === 0){
				$('#owned-races').append('\
					<li>\
						<div class="faded">no races yet</div>\
					</li>');
				$("#owned-races").listview("refresh").trigger('create');
			}
			else{

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

				// console.log(ownedRaces);

				//TODO: FILTER RACES TO ONLY WAITING
				for (var i=0; i<ownedRaces.length; i++){
					var race = ownedRaces[i];
					var opponentId = race.opponent_id;
					var opponent = formatName(race.opponent_first_name, race.opponent_last_name, 'race');
					// console.log(race);
					// console.log(opponent);


					$('#owned-races').append('<li userid="'+opponentId+'"><div class="ui-grid-c">\
						<div class="ui-block-a">\
							<div class="person">\
								<a href="profile.html?id='+opponentId+'&source=active"><img class="avatar" ></a>\
								<div class="name">'+opponent+'</div>\
							</div>\
						</div>\
						<div class="ui-block-b">\
							<div class="info">\
								2.3mi run<br/>\
								4mi away\
							</div>\
						</div>\
						<div class="ui-block-c">\
							<div class="btn">\
								<a href="details.html?race='+race._id+'" data-role="button">Details</a>\
							</div>\
						</div>\
						<div class="ui-block-d">\
							<div class="btn">\
								<a href="#confirm" data-role="button" data-theme="g" data-rel="popup" data-position-to="window" data-transition="pop">Cancel</a>\
							</div>\
						</div>\
					</div></li>');

					$("#owned-races").listview("refresh").trigger('create');


					
				};

				// console.log($('#owned-races').length);

				// for (var i=1; i<$('#owned-races').length; i++){
				// 	log(1);
				// 	var li = $('#owned-races')[i];
				// 	getSquarePicture($(li).attr('userid'),function(data){
				// 		console.log("index " + i +" " + data.location);
				// 		$($(li).find('.avatar')[0]).attr('src',data.location);
				// 	});
				// }

			};

			
		
		});

	});

});


// populate new race page with friend list
$('#new-race').bind('pageshow', function(){

	// get friend list
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

		// sort alphabetically (by first then last name)
		list.sort(function(a,b) {
			return compare(a, b, "name"); 
		});

		for (var i=0; i<list.length; i++){
			$("<li><img class='avatar'><a href='profile.html?id="+list[i].id+"&source=newRace'><p>"+list[i].name+"</p></a></li>").appendTo('#friend-list ul').trigger("create");
		}

		$("#friend-list ul").listview("refresh");
	}, log);
});


//populate profile page with given user's information & hook up race button
$('#profile-page').bind('pageshow', function(){

	console.log("profile page showing");

	getMyself(function(myself){
		// hide page and show loading screen
		$('#profile-content').hide();
		$.mobile.showPageLoadingMsg();

		// console.log(getUrlVars().id);
		if (getUrlVars().id === "myself"){
			// show page after load
			$.mobile.hidePageLoadingMsg();

			var displayName = formatName(myself.first_name, myself.last_name, 'profile');

			// show user name
			$('#profile-name').html(displayName);
			// hide race button and back button
			$('#start-race-btn').hide();
			$('#back-btn').remove();

			// $('.profile-link').addClass('ui-btn-active').addClass('ui-state-persist');

			getLargePicture(myself.id, function(picture){
				var result = getPicture(picture);
				if (result === true){
					$('#profile .avatar img').attr("src", picture.location);
				}

				formatPicture(picture);
			});

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

				var displayName = formatName(user.first_name, user.last_name, 'profile');
				
				// display user data
				$('#profile-name').html(displayName);
				$('#start-race-btn').find('.ui-btn-text').text("Race with "+user.first_name+"!");

				// change current tab to active
				$('.profile-link').removeClass('ui-btn-active').removeClass('ui-state-persist');
				$('.active-link').addClass('ui-btn-active').addClass('ui-state-persist');

				// change back button destination
				if (getUrlVars().source === "active"){
					$('#back-btn').attr("href", "active.html");
				}

				// set avatar image
				getLargePicture(user.id, function(picture){
					var result = getPicture(picture);
					if (result === true){
						$('#profile .avatar img').attr("src", picture.location);

						formatPicture(picture);
					}
					
				});

				// show page
				$('#profile-content').show();


				// bind create new race event
				$('#start-race-btn').bind('click', function(){
					var race = {
						owner_id: myself.id,
						owner_first_name: myself.first_name,
						owner_last_name: myself.last_name,
						opponent_id: user.id,
						opponent_first_name: user.first_name,
						opponent_last_name: user.last_name,
						status: "created",
					};
					// console.log("new race");
					// console.log(race);
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


//compareto function for strings at index in a json object or array
function compare(el1, el2, index) {
  return el1[index] == el2[index] ? 0 : (el1[index] < el2[index] ? -1 : 1);
}

// format name length
function formatName(firstName, lastName, page){
	// catch when name is empty
	if (firstName == undefined && lastName == undefined){
		return undefined;
	}

	// console.log("format name");
	var length;
	if (page === 'profile'){
		length = maxProfileNameLength;
	}
	else if (page === 'race'){
		length = maxRaceNameLength;
	}

	var displayName;
	if (firstName.length >= length-3){
		displayName = firstName;			//first name only
	}
	else{
		if (page === 'race' || firstName.length + lastName.length +1 >= length){
			displayName = firstName + " " + lastName.charAt(0) + ".";		// first + last initial
		}
		else{
			displayName = firstName + " " + lastName;						// full name
		}
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

function getPicture(picture){
	if (isNull(picture)){
		return false;
	}
	if (picture.status === 0){
		return false;
	}
	if (picture.image === false){
		return false;
	}
	return true;
}

// change avatar class based on width/height ratio
function formatPicture(picture){
	var icon = new Image();
	icon.src = picture.location;
	width = icon.width;
	height = icon.height;

	if (width>height){
		$('#profile .avatar img').addClass("horizontal");
	}
	else{
		$('#profile .avatar img').addClass("vertical");
	}
}