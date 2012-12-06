
var dbUtil = {

	readFromDatabase : 
	function(model,option,successCallback,errorCallback, modelName){
	    if(isNull(model)){
	        dbError("Model: " +modelName + " is not defined or no database connection found. Can't read from db.");
	        if(errorCallback)
	            errorCallback("Model: " +modelName + " is not defined or no database connection found. Can't read from db.");
	        return;
	    }
	    model.find(option,function(err, results){
	        if(err){
	            dbError(err);
	            if(errorCallback)
	                errorCallback(err);
	        }
	        else if(successCallback){
	            successCallback(results);
	    	}
    	});
	},

	createNewInstance : 
	function(model,instance,successCallback,errorCallback, modelName){
	    if(isNull(model)){
	        dbError("Model: " +modelName + " is not defined or no database connection found. Can't create new instance.");
	        if(errorCallback){
	            errorCallback("Model: " +modelName + " is not defined or no database connection found. Can't create new instance.");
	        }
	        return;
	    }
	    if(isNull(instance)){
	        dbError("No instance provided when creating new " + modelName + " instance.") ;
	        if(errorCallback){
	            errorCallback("No instance provided when creating new " + modelName + " instance.");
	        }
	        return;
	    }

	    model.create(instance,function(err, newInstance){
	        if(err){
	            dbError(err);
	            if(errorCallback)
	                errorCallback(err);
	        }
	        else if(successCallback){
	            successCallback(newInstance);
	        }
	    });
	},

	updateManyInstances :
	function(model,query, newInstance, options, successCallback, errorCallback, modelName){
	    if(isNull(model)){
	        dbError("Model: " +modelName + " is not defined or no database connection found. Can't update instance _updateInstances_().");
	        if(errorCallback){
	            errorCallback("Model: " +modelName + " is not defined or no database connection found. Can't update instance _updateInstances_().");
	        }
	        return;
	    }
	    if(isNull(query) || isEmptyObj(query)){
	        dbWarning("No query given to _updatedInstance_. Proceeding and updating any matched instances in model " + modelName);
	        query = {};
	    }
	    if(isNull(newInstance) || isEmptyObj(newInstance)){
	        dbWarning("No updated instance given to _updateInstances_. Proceeding and making no changes in model " + modelName);
	        newInstance = {};
	    }
	    model.update(query, newInstance, options, function(err,numRowsChanged, raw){
	        if(err){
	            dbError(err);
	            if(errorCallback){
	                errorCallback(err);
	            }
	            return;
	        }
	        if(successCallback)
	            successCallback({
	                rows  : numRowsChanged,
	                rawMongo : raw
	            });
	    });
	},

	updateOneInstance :
	function(model, query, newInstance, options, successCallback, errorCallback, modelName){
	    if(isNull(model)){
	        dbError("Model: " +modelName + " is not defined or no database connection found. Can't update instance _updateOneInstance_().");
	        if(errorCallback){
	            errorCallback(CLIENT_ERR_MSG);
	        }
	        return;
	    }
	    if(isNull(query) || isEmptyObj(query)){
	        dbError("No query given to _updateOneInstance_. This method requires a primary key.");
	        if(errorCallback){
	            errorCallback("No query given to _updateOneInstance_. This method requires a primary key.");
	        }
	        return;
	    }
	    if(isNull(newInstance) || isEmptyObj(newInstance)){
	        dbWarning("No updated instance given to _updateOneInstance_. Proceeding and making no changes in model " + modelName);   
	        newInstance = {};
	    }

	    model.findOneAndUpdate(query,newInstance,options,function(err, obj){
	        //obj could be old instance or the one just updated depending on options
	        if(err){
	            dbError(err);
	            if(errorCallback){
	                errorCallback(err);
	            }
	        }
	        else if(successCallback){
	            successCallback(obj);
	        }
	    });
	},	

	removeInstance :
	function(model, options, successCallback, errorCallback, modelName){
	    if(isNull(model)){
	        dbError("Model: " +modelName + " is not defined or no database connection found. Can't remove instance.");
	        if(errorCallback){
	            errorCallback("Model: " +modelName + " is not defined or no database connection found. Can't remove instance.");
	        }
	        return;
	    }
	    if(isNull(options)){
	        dbError("No options given when removing model: " + modelName+". This action will remove all stored documents and is forbidden."
	            + " Use admin tool to remove all instances.");
	        if(errorCallback){
	            errorCallback("No options given when removing model: " + modelName+". This action will remove all stored documents and is forbidden."
	            + " Use admin tool to remove all instances.");
	        }
	        return;
	    }
	    model.remove(options,function(err){
	        if(err){
	            dbError(err);
	            if(errorCallback)
	                errorCallback(err);
	        }
	        else if(successCallback){
	            successCallback();
	        }
	    });
	}

};

//===============================================
//      handling errors
//===============================================

function dbError(msg){
  console.log("\n");
  console.log("------------Database Error Report Begins------------");
  console.log("Message: " + msg);
  console.log("Time   :"  + new Date());
  console.log("============Database Error Report Ends==========");
  console.log("\n");
}

function dbWarning(msg){
  console.log("\n");    
  console.log("******** Database Warning Begins*********");
  console.log("Warning: " + msg);
  console.log("Time   :"  + new Date());
  console.log("******** Database Warning Ends*********");
  console.log("\n");

}

//=================
//      Util
//=================
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


exports.util = dbUtil;
