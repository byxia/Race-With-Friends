var _URL_ = "localhost";
var port  = ":8888";
var url = "http://" + _URL_ + port;
var DEFAULT_CLIENT_ERR = "An error occurred on the client side.";

var cmdToURL = {


};


function registerAPI() {

}


function createUser (user) {
	
}


//======================
//       Util
//======================
function prepareURL (cmd,obj) {
	if(!validString(cmd)){
		clientError("No command given to prepareURL()");
		return;
	}
	if(isNull(obj)){
		clientError("No obj given to prepareURL()");
		return;
	}
	var ajaxURL = "/"+cmd;
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
	if(!validString(requestURL))
{		onError("No url provided to the ajax request.");
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
