var DEFAULT_CLIENT_ERR = "An error occurred on the client side.";

//a list of api commands
var GET_MYSELF = "getMyself";
var GET_USER_BY_ID = "getUserById";
var GET_USER_BY_EMAIL = "getUserByEmail";
var GET_ALL_USERS = "getAllUsers";
var CREATE_USER = "createUser";
var GET_ALL_FRIENDS = "getAllFriends";
var GET_FB_USER_BY_ID = "getFBUserById";
var CREATE_RACE = "createRace";
var GET_OWNED_RACES = "getOwnedRaces";
var GET_CHALLENGED_RACES = "getChallengedRaces";
var GET_ALL_RACES = "getAllRaces";
var GET_SMALL_PICTURE = "getSmallPicture";
var GET_SQUARE_PICTURE= "getSquarePicture";
var GET_LARGE_PICTURE = "getLargePicture";


//========================
//       Ajax Request
//========================
function getMyself (successCallback, errorCallback) {
	_sendAjaxRequest_(prepareURL(GET_MYSELF),true,successCallback, errorCallback);
}

function getAllUsers(successCallback, errorCallback){
	_sendAjaxRequest_(prepareURL(GET_ALL_USERS),true, successCallback,errorCallback);
}

function getAllFriends (successCallback, errorCallback) {
	_sendAjaxRequest_(prepareURL(GET_ALL_FRIENDS),true, successCallback,errorCallback);
}

function getUserById(id,successCallback, errorCallback){
	_sendAjaxRequest_(prepareURL(GET_USER_BY_ID,{_id : id}),true,
						successCallback, errorCallback);
}

function getUserByEmail(userEmail, successCallback, errorCallback){
	_sendAjaxRequest_(prepareURL(GET_USER_BY_EMAIL,{email:userEmail}),true,
						successCallback, errorCallback);
}

function getFBUserById (id, successCallback, errorCallback) {
	_sendAjaxRequest_(prepareURL(GET_FB_USER_BY_ID,{id : id}),true,successCallback,errorCallback);
}

function createRace (race,successCallback, errorCallback){
	_sendAjaxRequest_(prepareURL(CREATE_RACE,race),true,successCallback,errorCallback);
}

function getChallengedRaces(successCallback, errorCallback){
	_sendAjaxRequest_(prepareURL(GET_CHALLENGED_RACES),true,successCallback,errorCallback);
}

function getOwnedRaces( successCallback, errorCallback){
	_sendAjaxRequest_(prepareURL(GET_OWNED_RACES),true,successCallback,errorCallback);
}

function getAllRaces (id, successCallback, errorCallback) {
	_sendAjaxRequest_(prepareURL(GET_ALL_RACES,{id:id}),true,successCallback,errorCallback);
}

function getSmallPicture (id,successCallback, errorCallback) {
	_sendAjaxRequest_(prepareURL(GET_SMALL_PICTURE, {id : id}),true,successCallback, errorCallback);
}

function getLargePicture (id,successCallback, errorCallback) {
	_sendAjaxRequest_(prepareURL(GET_LARGE_PICTURE, {id : id}),true,successCallback, errorCallback);
}

function getSquarePicture(id,successCallback, errorCallback){
	_sendAjaxRequest_(prepareURL(GET_SQUARE_PICTURE,{id : id}),false,successCallback, errorCallback);
}


//======================
//       Util
//======================
function prepareURL (cmd,obj) {
	if(!validString(cmd)){
		clientError("No command given to prepareURL()");
		return;
	}
	if(isNull(obj) || isEmptyObj(obj)){
		return "/api/"+cmd;
	}
	var ajaxURL = "/api/"+cmd;
	var seperator = "?";
	for(var propertyName in obj){
		ajaxURL += seperator;
		ajaxURL += propertyName + "=" + obj[propertyName];
		seperator = "&";
	}
	return ajaxURL;
}

function _sendAjaxRequest_ (requestURL, isAsync, onSuccess, onError) {
	if(isNull(onSuccess) || typeof(onSuccess)!=="function") {
		onSuccess = function(obj){
			log(obj);
		}
	}
	if(isNull(onError) || typeof(onError)!=="function"){
		onError = function(obj){
			log(obj);
		}
	}
	if(!validString(requestURL)){
		onError("No url provided to the ajax request.");
		return;
	}
	if(isNull(isAsync)){
		isAsync = true;
	}
	$.ajax({
		url : requestURL,
		async : isAsync,
		timeout : 10000,
		type : "GET",
		success: function(data, textStatus, jqXHR) {
            onSuccess(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            onError(jqXHR);
        }

	});
}

function isEmptyObj(obj){
    if(isNull(obj)) return false;
    for (var name in obj) {
                return false;
    }
    return true;
}

function validString(s){
  return (!isNull(s)) && typeof(s)==="string" && s.trim().length >0 ;
}

function isNull(obj){
  return obj == undefined || obj == null
          || obj === undefined || obj === null;
}

function log(obj){
  console.log(obj);
}





//======================
//    Error Handling
//======================
function clientError (msg) {
	if(!validString(msg)){
		msg= DEFAULT_CLIENT_ERR;
	}
	_sendAjaxRequest_("/err/"+msg,true, function(){},function(){})
}
