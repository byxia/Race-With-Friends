var _URL_ = "localhost";
var port  = ":8888";
var url = "http://" + _URL_ + port;

function sendAjaxRequest (requestURL, isAsync, onSuccess, onError) {
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
		type : "POST",
		success: function(data, textStatus, jqXHR) {
            onSuccess(data);
        },
        error: function(jqXHR, textStatus, errorThrown){
            onError(jqXHR);
        }

	});
}

/*=====Util=====*/
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

