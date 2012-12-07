var util = {

	isEmptyObj : function (obj){
	    if(isNull(obj)) return false;
	    for (var name in obj) {
	                return false;
	    }
    	return true;
	},

	validString : function (s){
	  return (!isNull(s)) && typeof(s)==="string" && s.trim().length >0 ;
	},

	isNull : function (obj){
		return isNull(obj);
	},

	log : function (obj){
	  console.log(obj);
	},

	dbError : function(msg){
	  console.log("\n");
	  console.log("------------Database Error Report Begins------------");
	  console.log("Message: ");
	  console.log(msg);
	  console.log("Time   :"  + new Date());
	  console.log("============Database Error Report Ends==========");
	  console.log("\n");
	},

	dbWarning : function(msg){
	  console.log("\n");    
	  console.log("******** Database Warning Begins*********");
	  console.log("Warning: ");
	  console.log(msg);
	  console.log("Time   :"  + new Date());
	  console.log("******** Database Warning Ends*********");
	  console.log("\n");
	},

	serverErr : function(msg){
	  console.log("\n");
	  console.log("------------Server Error Report Begins------------");
	  console.log("Message: ");
	  console.log(msg);
	  console.log("Time   :"  + new Date());
	  console.log("============Server Error Report Ends==========");
	  console.log("\n");
	}
};

function isNull(obj){
	  return obj == undefined || obj == null
	          || obj === undefined || obj === null;
}

exports.util = util;