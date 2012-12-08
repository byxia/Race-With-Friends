/*=====================================================
                  Race With Friends
            CMU 15-237 Fall 2012 Final Project
  =====================================================*/
/* Bingying Xia(bxia), Ruoyu Li(ruoyul), Zi Wang(ziw)  */


// This file contains all helper methods that are needed to 
// send out ajax request to our server. Each method is a wrapper for an api call 
// and takes in callback functions for front-end DOM manipulation.

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
	_sendAjaxRequest_(prepareURL(GET_SQUARE_PICTURE,{id : id}),true,successCallback, errorCallback);
}


//======================
//       Util
//======================

//Convert an api command and its optional parameters into 
//a valid query url. e.g. getUser?id=1&option=detailed
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

function _sendAjaxPostRequest_ (requestURL,data,successCallback, errorCallback) {
	if(isNull(successCallback) || typeof(successCallback)!== "function"){
		successCallback = function(obj){
			log(obj);
		}
	}
	if(isNull(errorCallback) || typeof(errorCallback) !== "function"){
		errorCallback = function(obj){
			log(obj);
		}
	}
	if(!validString(requestURL)){
		errorCallback("Invalid url provided to ajax POST request");
		return;
	}
	if(isNull(data)){
		data = {};
	}
	$.ajax({
		type: 'POST',
		url: requestURL,
		data: data,
		success: function(data){
			successCallback(data);
		},
		error : function(err){
			errorCallback(err);
		}
	});
}

// Send the ajax request to ask the server for a JSON object
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
	var array = [
		1.284081902,184.190,1398091.1938,123.12839012,12839012.12808
		,1.2983929,183902.1289
	];
	$.ajax({
		url : requestURL,
		// // data : array,
		// processData : false,

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
