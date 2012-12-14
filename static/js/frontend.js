// max # of char to display in profile page name label
var maxProfileNameLength = 12;

// max # of char to display in race pages name label
var maxRaceNameLength = 9;

// # of decimal places to display for distances (1.23mi)
var distanceDecimals = 2;


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
	$('.finished-link').removeClass('ui-btn-active').removeClass('ui-state-persist');
	$('.active-link').addClass('ui-btn-active').addClass('ui-state-persist');

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

					// console.log(race);
					var ownerId = race.owner_id;
					var owner = formatName(race.owner_first_name, race.owner_last_name, 'race');
					// console.log(race);
					// console.log(opponent);

					var dist = metersToMiles(race.owner_distance || 0, distanceDecimals);
					var daysAgo = daysAway(new Date(race.creation_date), new Date());
					

					$('#challenged-races').append('<li userId="'+ownerId+'"><div class="ui-grid-c">\
						<div class="ui-block-a">\
							<div class="person">\
								<a href="profile.html?id='+ownerId+'&source=active"><img class="avatar"></a>\
								<div class="name">'+owner+'</div>\
							</div>\
						</div>\
						<div class="ui-block-b">\
							<div class="info">\
								'+dist+'mi run<br/>\
								'+formatDaysAgo(daysAgo)+'\
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

					var dist = metersToMiles(race.owner_distance || 0, distanceDecimals);
					var daysAgo = daysAway(new Date(race.creation_date), new Date());

					var newLi = $('<li userId="'+opponentId+'" raceId="'+race._id+'"><div class="ui-grid-c">\
						<div class="ui-block-a">\
							<div class="person">\
								<a href="profile.html?id='+opponentId+'&source=active"><img class="avatar"></a>\
								<div class="name">'+opponent+'</div>\
							</div>\
						</div>\
						<div class="ui-block-b">\
							<div class="info">\
								'+dist+'mi run<br/>\
								'+formatDaysAgo(daysAgo)+'\
							</div>\
						</div>\
						<div class="ui-block-c">\
							<div class="btn">\
								<a href="details.html?race='+race._id+'&source=active" data-role="button">Details</a>\
							</div>\
						</div>\
						<div class="ui-block-d">\
							<div class="btn">\
								<a id="cancel-btn" data-role="button" data-theme="g" data-rel="popup" data-position-to="window" data-transition="pop">Cancel</a>\
							</div>\
						</div>\
					</div></li>').appendTo('#owned-races');


					newLi.find('#cancel-btn').bind('click', function(){
						$.mobile.showPageLoadingMsg();
						removeRaceById(race._id, function(data){
							if (data.status === 1){
								$.mobile.changePage("/static/active.html", { reloadPage : true });
								showToast('race deleted');
							}
							else{
								console.log('delete error');
								$.mobile.changePage("/static/active.html", { reloadPage : true });

							}
							$.mobile.hidePageLoadingMsg();
							
						});
					})

					$("#owned-races").listview("refresh").trigger('create');
				});

				$('#owned-races li').each(function(index, object){
					if(index ===0) return;

					var opponentId = $(object).attr('userId');
					// console.log(opponentId);
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


// finished races page
$('#finished-races').live('pageinit', function(){
	$.mobile.showPageLoadingMsg();

	getFinishedRaces(function(object){
		// $('#finished-list').html('');
		// console.log(object);
		finishedRaces = object.races;
		me = object.me;
		// console.log(me);

		// update my race count and win count
		var numRaces=0;
		var numWins=0;

		for (var i=0; i<finishedRaces.length; i++){
			numRaces++;
			if (finishedRaces[i].winner_id === me.id){
				numWins++;
			}
		}

		if (numRaces === 1){
			$('#race-num').html('<span class="count"></span> finished race')
		}
		$('#race-num .count').html(numRaces);
		$('#win-num .count').html(numWins);


		if (finishedRaces.length === 0){
			$('#finished-list').html('');
			$('#finished-list').append('\
				<li>\
					<div class="faded">no races yet</div>\
				</li>');
			$("#finished-list").listview("refresh").trigger('create');
		}
		else{
			$('#finished-list').html('');
			finishedRaces.sort(function(a,b){
				// if (a.creation_date !== null && b.c)
				if (a.creation_date < b.creation_date){
					return 1;
				}
				else{
					return -1;
				}
			});
			$(finishedRaces).each(function(index, race){
				var ownerId = race.owner_id;
				var owner = formatName(race.owner_first_name, race.owner_last_name, 'race');
				var opponentId = race.opponent_id;
				var opponent = formatName(race.opponent_first_name, race.opponent_last_name, 'race');
				
				var winningTime = 0;
				if (race.owner_time !== undefined && race.opponent_time){
					winningTime = Math.min(race.owner_time, race.opponent_time);
				}
				winningTime = formatTime(winningTime);
				if (winningTime.h === '00'){
					winningTime = winningTime.m + ":" + winningTime.s;
				}
				else{
					winningTime = winningTime.h + ":" + winningTime.m + ":" + winningTime.s;
				}

				console.log(race.winner_id);

				var status;
				if (race.winner_id === me.id){
					status = "You won!";
				}
				else{
					status = "You lost.";
				}

				var dist = metersToMiles(race.owner_distance || 0, distanceDecimals);
				var daysAgo = daysAway(new Date(race.creation_date), new Date());

				var newLi = $('\
					<li ownerId="'+ownerId+'" oppId="'+opponentId+'">\
						<div class="vs">\
							<div class="person">\
								<a href="profile.html?id='+ownerId+'&source=finished"><img class="avatar owner"></a>\
								<div class="name owner">'+owner+'</div>\
							</div>\
							<div class="vs-text">VS</div>\
							<div class="person">\
								<a href="profile.html?id='+opponentId+'&source=finished"><img class="avatar opponent"></a>\
								<div class="name opponent">'+opponent+'</div>\
							</div>\
						</div>\
						<a href="details.html?race='+race._id+'&source=finished" class="info">\
							<p class="winner lost">'+status+'</p>\
							<p class="result">\
								'+dist+'mi race<br/>\
								winner: '+winningTime+'\
							</p>\
						</a>\
					</li>').appendTo('#finished-list');

				if (ownerId === me.id){
					newLi.find('.name.owner').html('You');
				}
				else{
					newLi.find('.name.opponent').html('You');
				}

				if (race.winner_id === ownerId){
					newLi.find('.avatar.owner').addClass('won').after('<div class="crown"></div>');
				}
				else{
					newLi.find('.avatar.opponent').addClass('won').after('<div class="crown"></div>');
				}


			});
			$("#finished-list").listview("refresh").trigger('create');

			$('#finished-list li').each(function(index, object){
				var ownerId = $(object).attr('ownerId');
				getSquarePicture(ownerId,function(picture){
					// console.log(opponentId);
					if (validatePicture(picture) === true){
						$($(object).find('.avatar.owner')[0]).attr('src', picture.location);
					}
				});
				var opponentId = $(object).attr('oppId');
				getSquarePicture(opponentId,function(picture){
					// console.log(opponentId);
					if (validatePicture(picture) === true){
						$($(object).find('.avatar.opponent')[0]).attr('src', picture.location);
					}
				});
			});
		}
		$.mobile.hidePageLoadingMsg();
	});
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

		$('#friend-list ul').html('');

		if (friends.length === 0){
			$('#friend-list ul').html('<li>\
					<div class="faded">None of your friends are playing yet</div>\
				</li>');
			$("#friend-list").listview("refresh").trigger('create');
		}
		else{
			// console.log(friends);
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
					
					window.location.href="race-recording.html?owner_id="+me.id+"&opponent_id="+object.id+
					"&owner_first="+me.name.givenName+"&owner_last="+me.name.familyName+
					"&opp_first="+friendFirst+"&opp_last="+friendLast+"&source=new-race";

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
		}

		$.mobile.hidePageLoadingMsg();
		
	}, log);
});


//populate profile page with given user's information & hook up race button
// $("#profile-page").die("pageinit");
$('#profile-page').live('pageshow', function(){
	// $("#profile-page").die("pagebeforeshow");
	$.mobile.showPageLoadingMsg();

	if ($._data($("#profile-page")[0], "events").pagebeforeshow.length>3){
		$._data($("#profile-page")[0], "events").pagebeforeshow.slice(0,1);
		return;
	}

	// console.log($._data( $("#profile-page")[0], "events" ));

	// console.log($('#profile-link-btn').data('events'))

	// console.log("profile page showing");

	// hide page and show loading screen
	$('#profile-content').hide();
	

	getUserById(getUrlVars().id, function(object){
		var user = object[0];
		// console.log(object);

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
		// console.log(user.total_time);
		$('.number.wins').html(wonRaces + " / " + totalRaces + " races");
		$('.number.dist').html(metersToMiles(totalDist, distanceDecimals) + "mi");
		$('.number.time').html(totalTimeFormatted.h + ":" + totalTimeFormatted.m + ":" + totalTimeFormatted.s);

		//update personal record
		var recordDist = user.record_dist || 0;
		var recordPace = user.record_pace || 0;
		var recordPaceFormatted = formatTime(meterPaceToMiles(recordPace));
		$('#personal-records .longest').html(metersToMiles(recordDist, distanceDecimals));
		if (recordPaceFormatted.h === '00'){
			$('#personal-records .fastest').html(recordPaceFormatted.m + "'" + recordPaceFormatted.s + '"');

		}
		else{
			$('#personal-records .fastest').html(recordPaceFormatted.h + "&deg;" + recordPaceFormatted.m + "'" + recordPaceFormatted.s + '"');
		}
		

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
			$('.active-link').removeClass('ui-btn-active').removeClass('ui-state-persist');
			$('.finished-link').removeClass('ui-btn-active').removeClass('ui-state-persist');
			$('.profile-link').addClass('ui-btn-active').addClass('ui-state-persist');
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

		$.mobile.hidePageLoadingMsg();

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




// race details page
$('#details-page').live('pageshow', function(){
	$.mobile.showPageLoadingMsg();

	// console.log("details");
	raceId = getUrlVars().race;
	source = getUrlVars().source;

	// set navigation based on source
	if (source === 'finished'){
		$('#back-btn').attr('href', 'finished.html');
		$('.active-link').removeClass('ui-btn-active').removeClass('ui-state-persist');
		$('.finished-link').addClass('ui-btn-active').addClass('ui-state-persist');
		$('.active-link').attr('data-direction', 'forward');
	}

	getRaceById(raceId, function(object){

		// console.log(race);
		race = object.race;
		me = object.me;
		// console.log(me);

		console.log(race.mode);
		if (race.mode === "diff"){
			console.log("mode is diff");
			$('.map.diff').show();
			$('.map-wrapper').hide();
		}
		else{
			$('.map.diff').hide();
			$('.map-wrapper').show();
		}

		ownerId = race.owner_id;
		opponentId = race.opponent_id;
		ownerName = formatName(race.owner_first_name, race.owner_last_name, 'race');
		opponentName = formatName(race.opponent_first_name, race.opponent_last_name, 'race');
		$('.detail-info .owner .name').html(ownerName);
		$('.detail-info .opponent .name').html(opponentName);
		$('.owner a').attr('href', 'profile.html?id='+ownerId+'&source=active');

		$('#people-label .owner').html(ownerName);
		$('#people-label .opponent').html(opponentName);
		$('.opponent a').attr('href', 'profile.html?id='+opponentId+'&source=active');

		// console.log(race.owner_id);
		getSquarePicture(race.owner_id,function(picture){
			// console.log(picture);
			if (validatePicture(picture) === true){
				$('.detail-info .owner img').attr('src', picture.location);
				$('.detail-stats .owner img').attr('src', picture.location);
			}
		});
		getSquarePicture(race.opponent_id,function(picture){
			// console.log(picture);
			if (validatePicture(picture) === true){
				$('.detail-info .opponent img').attr('src', picture.location);
				$('.detail-stats .opponent img').attr('src', picture.location);
			}
		});

		//change stats
		$('.dist-button .distance').html(metersToMiles(race.owner_distance || 0, distanceDecimals)+"mi");

		var ownerTime = formatTime(race.owner_time || 0);
		$('.owner .number.time').html(ownerTime.h + ":" + ownerTime.m + ":" + ownerTime.s);
		var ownerPace = formatTime(meterPaceToMiles(race.owner_pace || 0));
		$('.owner .number.pace').html(ownerPace.m + "'" + ownerPace.s+'"');

		var oppTime = formatTime(race.opponent_time || 0);
		$('.detail-stats .opponent .number.time').html(oppTime.h + ":" + oppTime.m + ":" + oppTime.s);
		var oppPace = formatTime(meterPaceToMiles(race.opponent_pace || 0));
		$('.detail-stats .opponent .number.pace').html(oppPace.m + "'" + oppTime.s+'"');


		// change display for race startd by me
		if(me.id === race.owner_id){
			$('.detail-info .owner .name').html("You");

			$('.detail-stats .owner .small.time').html('your time');
			$('.detail-stats .owner .small.pace').html('your pace');
			$('.detail-stats .opponent .small.time').html('their time');
			$('.detail-stats .opponent .small.pace').html('their pace');
			$('.detail-stats .opponent.waiting').html('<p>waiting for<br/>their data</p>');

			// change race button to cancel if race isn't finished and user is owner
			if (race.status !== 'finished'){
				$('.detail-info .action-btn a .ui-btn-text').html('Cancel');
				$('.detail-info .action-btn a').removeClass('ui-btn-up-f').addClass('ui-btn-up-g').bind('click', function(){
					$.mobile.showPageLoadingMsg();
					removeRaceById(race._id, function(data){
						if (data.status === 1){
							$.mobile.changePage("/static/active.html", { transition: "slide", changeHash: true, reverse: true });
							showToast('race deleted');
						}
						else{
							console.log('delete error');
							$.mobile.changePage("/static/active.html", { transition: "slide", changeHash: true, reverse: true });
						}
						$.mobile.hidePageLoadingMsg();
					});
				});
			}
			
		}
		else{		// races stared by other person
			$('.detail-info .opponent .name').html("You");
			//link race button
			$('.action-btn a').attr('href', 'race.html?race='+raceId+'&source=active');
		}
		//change display based on status
		// console.log("status: " + race.status);
		if(race.status==='waiting' || race.status ==='created'){
			$('.opponent.waiting').show();
			$('.opponent.finished').remove();
			if(me.id === race.owner_id){	// if user is owner and waiting
				$('.detail-info .status').html('Waiting for their run');
			}
			console.log("waiting");
			// console.log($('.map .opponent').html());
			$('#people-label .opponent').hide();
		}
		else{	// finished
			$('.opponent.waiting').remove();
			$('.opponent.finished').show();
			$('#people-label .opponent').show();

			if (race.mode === 'diff'){
				$('.map-wrapper').hide();
				$('.map.diff').show();
			}

			// change button to share
			// $('.detail-info .action-btn a .ui-btn-text').html('Share');
			// $('.detail-info .action-btn a').removeClass('ui-btn-up-f').addClass('ui-btn-up-b').bind('click', function(){
			// 	$('#fbShare'.popup('open'));
			// });
	
			// delete action button
			$('.detail-info .action-btn').remove();

			// change status label
			if (race.winner_id === me.id){	// finished and user won
				$('.detail-info .status').html('You won!').removeClass('waiting').addClass('won');
			}	
			else{	// user lost
				$('.detail-info .status').html('You lost.').removeClass('waiting').addClass('lost');
			}
		}

		// new playback(race.mode);

		$.mobile.hidePageLoadingMsg();

		// add animation
		try{
			window.playback = new playback(race.mode);
			playback.go();
			console.log("playback created");
		}
		catch(e){
			location.reload(true);
		}
	});

});


// accept race page
$('#race-page').live('pageshow', function(){
	$.mobile.showPageLoadingMsg();

	raceId = getUrlVars().race;
	getRaceById(raceId, function(object){
		race = object.race;
		ownerName = formatName(race.owner_first_name, race.owner_last_name, 'race');
		$('.owner .name').html(ownerName);
		$('.race-distance').html(metersToMiles(race.owner_distance, distanceDecimals));
		// console.log(race);
		getSquarePicture(race.owner_id,function(picture){
			if (validatePicture(picture) === true){
				$('.owner .avatar').attr('src', picture.location);
			}
		});
		getSquarePicture(race.opponent_id,function(picture){
			// console.log(picture);
			if (validatePicture(picture) === true){
				$('.opponent .avatar').attr('src', picture.location);
			}
		});
		$.mobile.hidePageLoadingMsg();
	});
	$('#same-route-btn').bind('click', function(){
		window.location.href='race-recording.html?race='+raceId+'&source=active&mode=same'
	});
	$('#diff-route-btn').bind('click', function(){
		window.location.href='race-recording.html?race='+raceId+'&source=active&mode=diff'
	});
});


// recording race
$('#race-recording').live('pageshow', function(){
	$.mobile.showPageLoadingMsg();

	// get and display other person's name
	var name;
	var vars = getUrlVars();
	var raceId = vars.race;
	window.geo = new geo({
		startButtonId : "start-run-btn",
		finishButtonId: "finish-run-btn"
	});
	$('#finish-run-btn').hide();
	$('#distance-instruction').hide();
	$('#arrive-instruction').hide();
	$("#start-run-btn").hide();

	$('#rec-icon').hide();
	$('#back-btn').bind('click',function(){
		if(geo && geo.timerId){
			console.log("clear timer when back is clicked");
			clearInterval(geo.timerId);
		}
		$.mobile.changePage("/static/active.html");
	});
	if (vars.source === 'new-race'){
		name = vars.opp_first + " " + vars.opp_last;
		$("#start-run-btn").show();
		$('#racing-with').html(name);
		// new geo({
		// 	startButtonId : "start-run-btn",
		// 	finishButtonId: "finish-run-btn"
		// });
	}
	else if (vars.source === 'active'){	
		getRaceById(raceId, function(object){
			race = object.race;
			// console.log(race.owner_first_name);
			name = race.owner_first_name + " " + race.owner_last_name;
			$('#racing-with').html(name);
			$('body').data('race', race);
			console.log($('body').data('race'));
			if (vars.mode === 'same'){
				$('#arrive-instruction').show();
			}
			else if (vars.mode === 'diff'){
				$("#start-run-btn").show();

			}
		});

	}

	$.mobile.hidePageLoadingMsg();
					

	// $('#back-btn').bind('click', function(){
	// 	$('#confirm').popup('open');
	// 	$('#confirm-delete-btn').bind('click', function(){
	// 		$.mobile.changePage("/static/active.html", { transition: "slide", changeHash: true, reverse: true });
	// 	});
	// });
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
	// console.log("prepare url : " );
	// console.log(params);
	if(!params.source){
		url += "active.html";
	}
	else{
		url += params.source +".html";
	}
	// console.log("done url : " + url);
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

// converts meters to miles with specified number of decimal places, returns a string
function metersToMiles(meters, decimal){
	return (Math.round(meters * 0.00062137119 * 10 )/10).toFixed(decimal);
}

// convert pace (second per meter) to second per mile
function meterPaceToMiles(spm){
	return parseInt(spm/0.00062137119);
}

function daysAway(date1, date2) {
	//Get 1 day in milliseconds
	var one_day=1000*60*60*24;

	// Convert both dates to milliseconds
	var date1_ms = date1.getTime();
	var date2_ms = date2.getTime();

	// Calculate the difference in milliseconds
	var difference_ms = date2_ms - date1_ms;

	// Convert back to days and return
	return Math.round(difference_ms/one_day); 
}

function formatDaysAgo(daysAgo){
	if (daysAgo === 0){
		return "today";
	}
	else if (daysAgo === 1){
		return "yesterday";
	}
	else{
		return daysAgo + " days ago";
	}
}

function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;

                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    // document.getElementsByTagName("head")[0].appendChild(script);
    $('head').append($(script));
}


function showToast(message){
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all toast'>"+message+"</div>").css({ "top": $(window).scrollTop() + 250 })
	  .appendTo( $.mobile.pageContainer )
	  .delay( 1000 )
	  .fadeOut( 400, function(){
	    $(this).remove();
	});
}