// max # of char to display in profile page name label
var maxProfileNameLength = 12;

// max # of char to display in race pages name label
var maxRaceNameLength = 9;


// active races page
$('#active-races').live('pageshow', function(){

	$.mobile.showPageLoadingMsg();

	// console.log("showing active page");
	$('#challenged-races').html('');
	$('#owned-races').html('');

	$('#new-btn').bind('click', function(){
		window.location.href="/newrace";
	});
	$('.profile-link').removeClass('ui-btn-active').removeClass('ui-state-persist');

	//get owned races
	// getMyself(function(myself){
		// console.log(myself);
		getChallengedRaces(function(challengedRaces){
			// console.log(challengedRaces);

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

				$(challengedRaces).each(function(index, race){
					console.log(race);
					var ownerId = race.owner_id;
					var owner = formatName(race.owner_first_name, race.owner_last_name, 'race');
					// console.log(race);
					// console.log(opponent);

					$('#challenged-races').append('<li userId="'+ownerId+'"><div class="ui-grid-c">\
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
								<a href="details.html?race='+race._id+'&source=active" data-role="button">Details</a>\
							</div>\
						</div>\
						<div class="ui-block-d">\
							<div class="btn">\
								<a href="race.html?race='+race._id+'&source=active" data-role="button" data-theme="f">Race!</a>\
							</div>\
						</div>\
					</div></li>');

					$("#challenged-races").listview("refresh").trigger('create');
				});

				$('#challenged-races li').each(function(index, object){
					if(index ===0) return;
					
					var ownerId = $(object).attr('userId');
					getSquarePicture(ownerId,function(picture){
						// console.log(opponentId);
						if (validatePicture(picture) === true){
							$($(object).find('img.avatar')[0]).attr('src', picture.location);
						}
					});
				});

				$.mobile.hidePageLoadingMsg();

			};

		});

		getOwnedRaces(function(ownedRaces){
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

				$(ownedRaces).each(function(index, race){
					// console.log(race);
					var opponentId = race.opponent_id;
					var opponent = formatName(race.opponent_first_name, race.opponent_last_name, 'race');
					// console.log(race);
					// console.log(opponent);

					$('#owned-races').append('<li userId="'+opponentId+'"><div class="ui-grid-c">\
						<div class="ui-block-a">\
							<div class="person">\
								<a href="profile.html?id='+opponentId+'&source=active"><img class="avatar"></a>\
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
								<a href="details.html?race='+race._id+'&source=active" data-role="button">Details</a>\
							</div>\
						</div>\
						<div class="ui-block-d">\
							<div class="btn">\
								<a href="#confirm" data-role="button" data-theme="g" data-rel="popup" data-position-to="window" data-transition="pop">Cancel</a>\
							</div>\
						</div>\
					</div></li>');

					$("#owned-races").listview("refresh").trigger('create');
				});

				$('#owned-races li').each(function(index, object){
					if(index ===0) return;

					var opponentId = $(object).attr('userId');
					getSquarePicture(opponentId,function(picture){
						// console.log(opponentId);
						if (validatePicture(picture) === true){
							$($(object).find('img.avatar')[0]).attr('src', picture.location);
						}
					});
				});

				$.mobile.hidePageLoadingMsg();

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

		$.mobile.hidePageLoadingMsg();

	// });

});


// populate new race page with friend list
$('#new-race').bind('pageshow', function(){

	$.mobile.showPageLoadingMsg();

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

		me = list.me;
		friends = list.data;

		console.log(friends);


		// console.log(list);
		// sort alphabetically (by first then last name)
		friends.sort(function(a,b) {
			return compare(a, b, "name"); 
		});

		friends  = friends.slice(0,50);
		$(friends).each(function(index,object){

			var name = object.first_name + " " + object.last_name;
			var newLi = $("<li userId='"+object.id+"'><a href='profile.html?id="+object.id+"&source=new-race'><img class='avatar'></a><p>"+name+"</p></li>");

			newLi.appendTo('#friend-list ul');
			$(newLi.find('p')[0]).bind('click', function(){
				$.mobile.showPageLoadingMsg();
				// parse full name into first + last
				var matches = name.split(' ');
				var friendFirst = matches[0]; 
				var friendLast = matches[1]; 

				// console.log(object.id);

				if (friendLast === undefined){
					friendLast = "";
				}

				var race = {
					owner_id: me.id,
					owner_first_name: me.name.givenName,
					owner_last_name: me.name.familyName,
					opponent_id: object.id,
					opponent_first_name: friendFirst,
					opponent_last_name: friendLast,
					status: "created",
				};

				// console.log(race);
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
					window.location.href="race-recording.html?raceId="+object._id+"&source=new-race";
					// alert("race created");
				});
			});
			$("#friend-list ul").listview("refresh").trigger("create");
		});

		$("#friend-list ul li").each(function(index, object){
			// if(index ===0) return;
			// console.log($(object).attr('userId'));

			getSquarePicture($(object).attr('userId'),function(picture){
				if (validatePicture(picture) === true){
					$($(object).find('img.avatar')[0]).attr('src', picture.location);
				}
			});
					
		});

		$.mobile.hidePageLoadingMsg();
		
	}, log);
});


//populate profile page with given user's information & hook up race button
// $("#profile-page").die("pageinit");
$('#profile-page').live('pageshow', function(){
	// $("#profile-page").die("pagebeforeshow");

	if ($._data($("#profile-page")[0], "events").pagebeforeshow.length>3){
		$._data($("#profile-page")[0], "events").pagebeforeshow.slice(0,1);
		return;
	}

	console.log($._data( $("#profile-page")[0], "events" ));

	// console.log($('#profile-link-btn').data('events'))

	console.log("profile page showing");

	// hide page and show loading screen
	$('#profile-content').hide();
	$.mobile.showPageLoadingMsg();

	getUserById(getUrlVars().id, function(object){
		var user = object[0];
		console.log(object);

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
		// $('#start-race-btn').find('.ui-btn-text').text("Race with "+user.first_name+"!");


		// display total stats
		var totalRaces = user.total_races || 0;
		var wonRaces = user.won_races || 0;
		var totalDist = user.total_dist || 0;
		var totalTime = user.total_time || 0;
		var totalTimeFormatted = formatTime(totalTime);
		$('.number.wins').html(wonRaces + " / " + totalRaces + " races");
		$('.number.dist').html(metersToMiles(totalDist) + "mi");
		$('.number.time').html(totalTimeFormatted.h + ":" + totalTimeFormatted.m + ":" + totalTimeFormatted.s);

		var source = getUrlVars().source;
		// change current tab to active if coming from active
		if (source==='new-race' || source==='active' || source==='details-active'){
			$('.profile-link').removeClass('ui-btn-active').removeClass('ui-state-persist');
			$('.active-link').addClass('ui-btn-active').addClass('ui-state-persist');
			$('.finished-link').attr('data-direction', 'forward');
		}
		else if (source === 'details-finished' || source === 'finished'){
			$('.profile-link').removeClass('ui-btn-active').removeClass('ui-state-persist');
			$('.finished-link').addClass('ui-btn-active').addClass('ui-state-persist');
			$('.finished-link').attr('data-direction', 'forward');
		}
		//coming from tab (viewing self profile)
		else{
			$('#back-btn').remove();
		}

		// change back button destination
		// if (getUrlVars().source === "active"){
		// 	console.log("from active");
		// 	$('#back-btn').attr("onclick", "window.location.href='/back/active.html';");
		// 	console.log($('#back-btn').attr("onclick"));
		// }

		// set avatar image
		

		// show page
		$('#profile-content').show();

	}, function(error){
		console.log(error);
	});

	getLargePicture(getUrlVars().id, function(picture){
		var result = validatePicture(picture);
		if (result === true){
			$('#profile .avatar img').attr("src", picture.location);
			$('#profile .avatar img').load(function(){
				// console.log($(this).width() + "/" + $(this).height());
				formatPicture(picture);
			});
		}
		
	});

	// $("#profile-page").die("pagebeforeshow");
});


$('#details-page').live('pageshow', function(){
	raceId = getUrlVars().race;
	getRaceById(raceId, function(race){
		console.log(race);
	});
});








// --------- HELPER METHODS ---------- //

//compareto function for strings at index in a json object or array
function compare(el1, el2, index) {
  return el1[index] == el2[index] ? 0 : (el1[index] < el2[index] ? -1 : 1);
}

// format display name based on length and page to display
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

function validatePicture(picture){
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

function goBack(){
	var params = getUrlVars();
	var url = "/back/";
	console.log("prepare url : " );
	console.log(params);
	if(!params.source){
		url += "active.html";
	}
	else{
		url += params.source +".html";
	}
	console.log("done url : " + url);
	window.location.href = url;
} 

// change avatar class based on width/height ratio
function formatPicture(picture){
	var icon = new Image();
	icon.src = picture.location;
	width = icon.width;
	height = icon.height;

	// console.log(width + " / " + height);

	if (width>height){
		$('#profile .avatar img').addClass("horizontal");
	}
	else{
		$('#profile .avatar img').addClass("vertical");
	}
}

// change time from # seconds to HH:MM:SS
function formatTime(numSeconds){
	var hour = parseInt(numSeconds/3600);
	var min = parseInt((numSeconds-hour*3600)/60);
	var sec = numSeconds%60;
	if(hour<10){
		hour = "0"+hour;
	}
	if(min<10){
		min = "0"+min;
	}
	if(sec<10){
		sec = "0"+sec;
	}
	return {
		h: hour,
		m: min,
		s: sec
	}
}

// converts meters to miles with 1 decimal space, returns a string
function metersToMiles(meters){
	return (Math.round(meters * 0.00062137119 * 10 )/10).toFixed(1);
}