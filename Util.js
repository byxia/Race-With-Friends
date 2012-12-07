/*=====================================================
  				  Race With Friends
  			CMU 15-237 Fall 2012 Final Project
  =====================================================*/
/* Bingying Xia(bxia), Ruoyu Li(ruoyul), Zi Wang(ziw)  */


// This file contains general util methods, e.g. debugging and error handling methods.
// It is exposed to other server side js files by exports.util


var util = {
	//check for empty object, e.g. {}
	isEmptyObj : function (obj){
	    if(isNull(obj)) return false;
	    for (var name in obj) {
	                return false;
	    }
    	return true;
	},

	//check for not-null, non-empty string
	validString : function (s){
	  return (!isNull(s)) && typeof(s)==="string" && s.trim().length >0 ;
	},

	//check for null or undefined
	isNull : function (obj){
		return isNull(obj);
	},

	//print the obj
	log : function (obj){
	  console.log(obj);
	},

	//print error report for database related errors
	dbError : function(msg){
	  console.log("\n");
	  console.log("------------Database Error Report Begins------------");
	  console.log("Message: ");
	  console.log(msg);
	  console.log("Time   :"  + new Date());
	  console.log("============Database Error Report Ends==========");
	  console.log("\n");
	},

	//print warnings for database related issues
	dbWarning : function(msg){
	  console.log("\n");    
	  console.log("******** Database Warning Begins*********");
	  console.log("Warning: ");
	  console.log(msg);
	  console.log("Time   :"  + new Date());
	  console.log("******** Database Warning Ends*********");
	  console.log("\n");
	},

	//print errors report for server related errors
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