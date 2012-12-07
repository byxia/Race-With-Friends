/*=====================================================
  				  Race With Friends
  			CMU 15-237 Fall 2012 Final Project
  =====================================================*/
/* Bingying Xia(bxia), Ruoyu Li(ruoyul), Zi Wang(ziw)  */

// This file provides the api for server side js to easily use
// mongoDB via mongoose middleware. It provides CRUD methods  
// for any generic Model object used by this project.
// This is then exposed to server for higher level db operations.

var util   = require('./Util.js').util;
var dbUtil = {

	readFromDatabase : 
	function(model,option,successCallback,errorCallback, modelName){
	    if(util.isNull(model)){
	        util.dbError("Model: " +modelName + " is not defined or no database connection found. Can't read from db.");
	        if(errorCallback)
	            errorCallback("Model: " +modelName + " is not defined or no database connection found. Can't read from db.");
	        return;
	    }
	    model.find(option,function(err, results){
	        if(err){
	            util.dbError(err);
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
	    if(util.isNull(model)){
	        util.dbError("Model: " +modelName + " is not defined or no database connection found. Can't create new instance.");
	        if(errorCallback){
	            errorCallback("Model: " +modelName + " is not defined or no database connection found. Can't create new instance.");
	        }
	        return;
	    }
	    if(util.isNull(instance)){
	        util.dbError("No instance provided when creating new " + modelName + " instance.") ;
	        if(errorCallback){
	            errorCallback("No instance provided when creating new " + modelName + " instance.");
	        }
	        return;
	    }

	    model.create(instance,function(err, newInstance){
	        if(err){
	            util.dbError(err);
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
	    if(util.isNull(model)){
	        util.dbError("Model: " +modelName + " is not defined or no database connection found. Can't update instance _updateInstances_().");
	        if(errorCallback){
	            errorCallback("Model: " +modelName + " is not defined or no database connection found. Can't update instance _updateInstances_().");
	        }
	        return;
	    }
	    if(util.isNull(query) || util.isEmptyObj(query)){
	        util.dbWarning("No query given to _updatedInstance_. Proceeding and updating any matched instances in model " + modelName);
	        query = {};
	    }
	    if(util.isNull(newInstance) || util.isEmptyObj(newInstance)){
	        util.dbWarning("No updated instance given to _updateInstances_. Proceeding and making no changes in model " + modelName);
	        newInstance = {};
	    }
	    model.update(query, newInstance, options, function(err,numRowsChanged, raw){
	        if(err){
	            util.dbError(err);
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
	    if(util.isNull(model)){
	        util.dbError("Model: " +modelName + " is not defined or no database connection found. Can't update instance _updateOneInstance_().");
	        if(errorCallback){
	            errorCallback(CLIENT_ERR_MSG);
	        }
	        return;
	    }
	    if(util.isNull(query) || util.isEmptyObj(query)){
	        util.dbError("No query given to _updateOneInstance_. This method requires a primary key.");
	        if(errorCallback){
	            errorCallback("No query given to _updateOneInstance_. This method requires a primary key.");
	        }
	        return;
	    }
	    if(util.isNull(newInstance) || util.isEmptyObj(newInstance)){
	        util.dbWarning("No updated instance given to _updateOneInstance_. Proceeding and making no changes in model " + modelName);   
	        newInstance = {};
	    }

	    model.findOneAndUpdate(query,newInstance,options,function(err, obj){
	        //obj could be old instance or the one just updated depending on options
	        if(err){
	            util.dbError(err);
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
	    if(util.isNull(model)){
	        util.dbError("Model: " +modelName + " is not defined or no database connection found. Can't remove instance.");
	        if(errorCallback){
	            errorCallback("Model: " +modelName + " is not defined or no database connection found. Can't remove instance.");
	        }
	        return;
	    }
	    if(util.isNull(options)){
	        util.dbError("No options given when removing model: " + modelName+". This action will remove all stored documents and is forbidden."
	            + " Use admin tool to remove all instances.");
	        if(errorCallback){
	            errorCallback("No options given when removing model: " + modelName+". This action will remove all stored documents and is forbidden."
	            + " Use admin tool to remove all instances.");
	        }
	        return;
	    }
	    model.remove(options,function(err){
	        if(err){
	            util.dbError(err);
	            if(errorCallback)
	                errorCallback(err);
	        }
	        else if(successCallback){
	            successCallback();
	        }
	    });
	}

};

exports.util = dbUtil;
