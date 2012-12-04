// simpleExpressServer.js
// A simple Express server for 15-237.

var mongoose = require('mongoose');
var querystring = require("querystring");
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var express = require("express");
var flash = require("connect-flash");
var errorMsg = "Error occurred in processing the request.";
var ERROR_OBJ = {error : errorMsg,
                 status: 0};
var SUCCESS_OBJ={status: 1};
var PORT = 8888;
var cmdHandler = {};
var db = mongoose.createConnection('mongodb://localhost/race');
var app = express();

/*====TABLE (Collection) NAMES =====*/
/*prefix with T*/
var T_USER = "User";
var T_RACE = "Race";
var T_FRIEND = "Friend";

/*==== Models ====*/
var USER;
var RACE;
var FRIEND;

var CLIENT_ERR_MSG = errorMsg;  

//======================================
//      init/main
//======================================

function onStart(){
    initCommandHandler();
    app.configure(function(){
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session({ secret: 'change me!' }));
        app.use(flash());
        app.use(app.router);
    });

    app.get("/:staticFilename", serveStaticFile);
    app.get("/api/:cmd", handleCommands);
    app.get("/err/:msg", handleClientError);

    app.listen(PORT);

    process.on("uncaughtException", onUncaughtException);
    console.log("Server started successfully");
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
      console.log("Database Connection Success");

      var USER_SCHEMA = new mongoose.Schema({
        email        : String,
        first_name   : String,
        last_name    : String,
        password     : String,
        longest_run  : Number
        //TODO add personal records & achievment
        //TODO add profile pic
      });

      var RACE_SCHEMA = new mongoose.Schema({
        owner_id        : String,
        opponent_id     : String,
        status          : String,
        time            : { type: Date, default: Date.now },
        owner_route     : [],
        opponent_route  : [],
        owner_time      : String,
        opponent_time   : String,
        length          : Number,
        winner_id       : String
      });

      var FRIEND_SCHEMA = new mongoose.Schema({
        user_one_id : String,
        user_two_id : String
      });

      USER = db.model(T_USER,   USER_SCHEMA);
      RACE = db.model(T_RACE, RACE_SCHEMA);
      FRIEND = db.model(T_FRIEND,FRIEND_SCHEMA);
    var me = {
        first_name : "hello",
        last_name : "world"
      };

      // creatUser(me); 
      // getAllUsers(log,log); 
    });


}


//======================
//      Database Util
//======================


function _readFromRACE_ (option, successCallback, errorCallback){
    _readFromDatabase_(RACE,option,successCallback,errorCallback, "Race model");
}

function _readFromUSER_ (option, successCallback, errorCallback){
    _readFromDatabase_(USER,option,successCallback,errorCallback, "User Model");
}

function _readFromFRIEND_(option, successCallback, errorCallback){
    _readFromDatabase_(FRIEND,option,successCallback,errorCallback,"Friend Model");
}


function _readFromDatabase_(model,option,successCallback,errorCallback, modelName){
    if(isNull(model)){
        dbError("Model: " +modelName + " is not defined or no database connection found. Can't read from db.");
        if(errorCallback)
            errorCallback(CLIENT_ERR_MSG);
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
}

function _createNewInstance_(model,instance,successCallback,errorCallback, modelName){
    if(isNull(model)){
        dbError("Model: " +modelName + " is not defined or no database connection found. Can't create new instance.");
        if(errorCallback){
            errorCallback(CLIENT_ERR_MSG);
        }
        return;
    }
    if(isNull(instance)){
        dbError("No instance provided when creating new " + modelName + " instance.") ;
        if(errorCallback){
            errorCallback(CLIENT_ERR_MSG);
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
}

function _removeInstance_ (model, options, successCallback, errorCallback, modelName){
    if(isNull(model)){
        dbError("Model: " +modelName + " is not defined or no database connection found. Can't remove instance.");
        if(errorCallback){
            errorCallback(CLIENT_ERR_MSG);
        }
        return;
    }
    if(isNull(options)){
        dbError("No options given when removing model: " + modelName+". This action will remove all stored documents and is forbidden."
            + " Use admin tool to remove all instances.");
        if(errorCallback){
            errorCallback(CLIENT_ERR_MSG);
        }
        return;
    }
    model.remove(options,function(err){
        if(err){
            dbError(err);
            if(errorCallback)
                errorCallback(CLIENT_ERR_MSG);
        }
        else if(successCallback){
            successCallback();
        }
    });
}


//==========================
//     USER table CRUD
//==========================
function getAllUsers(successCallback, errorCallback){
    _readFromUSER_(null,successCallback,errorCallback);
}

function getUserById(id,successCallback, errorCallback){
    _readFromUSER_({_id : id},successCallback, errorCallback);
}

function getUserByEmail(userEmail,successCallback, errorCallback){
    _readFromUSER_({email : userEmail},successCallback,errorCallback);
}

function creatUser(user, successCallback, errorCallback){
    _createNewInstance_(USER,user,successCallback,errorCallback,"User model");
}

/*
* Remove the user with the given _id 
*/
function removeUserById(id, successCallback,errorCallback){
  _removeInstance_(USER,{_id : id},successCallback, errorCallback, "User model");
  
}

//==========================
//     RACE table CRUD
//==========================
function getAllRaces(successCallback, errorCallback){
    _readFromRACE_(null,successCallback, errorCallback);
}

function getRaceById(id,successCallback, errorCallback){
    _readFromRACE_({_id : id}, successCallback, errorCallback); 
}


/*
*   Get all races owned by user with the given id
*/
function getAllRacesOwnedBy(id, successCallback, errorCallback){
    _readFromRACE_({owner_id : id}, successCallback, errorCallback);
}


/*
*   Get all races where the user with the given id is challenged
*/
function getAllRacesChallenged(id, successCallback, errorCallback){
    _readFromRACE_({opponent_id : id}, successCallback, errorCallback);
}






function serveStaticFile(request, response) {
    response.sendfile(request.params.staticFilename);
    console.log("Serve static file: " + request.params.staticFilename);
}

function handleClientError(request, response){
    serverErr("Client side error-> " +request.params.msg.toString()+"\n URL: " + request.url);
    response.send({});
}

/*
*   Handle ajax request. Send back JSON object
*/
function handleCommands(request, response){

    var requestURL = request.url;
    var requestQuery = url.parse(requestURL);
    // console.log(requestQuery);
   

    /*  requsetQuery Object for 
        url: /api/getUser?id=11&name=Zi
    { search: '?id=11&name=Zi',
       query: 'id=11&name=Zi',
       pathname: '/api/getUser',
       path: '/api/getUser?id=11&name=Zi',
       href: '/api/getUser?id=11&name=Zi' }
    */

    if(isNull(requestQuery)){
        serverErr("Invalid url: " + requestURL +". No query can be parsed.");
        sendErrorObject(response);
        return;
    }
    var cmd = requestQuery.pathname.toString().substring(5);
    var args = querystring.parse(requestQuery.query);
    if(isNull(cmd)){
        serverErr("Invalid ajax request: " + requestURL + ". No command found.");
        sendErrorObject(response);
        return;
    }
    if(isNull(cmdHandler[cmd]) ||
        typeof(cmdHandler[cmd])!=="function"){
        serverErr("Invalid command. Server can't handle command: "+ cmd);
        sendErrorObject(response);
        return;
    }

    console.log("Handling cmd: " + cmd);
    cmdHandler[cmd](args,response);
}

function initCommandHandler(){
    cmdHandler.getAllUsers = function(args, response){
        //no args needed
        getAllUsers(function(results){response.send(results);},
             function(){sendErrorObject(response)});
    };

    cmdHandler.getUserById = function(args,response){
        if(isNull(args)){
            serverErr("No args given to cmdHandler.getUserById");
            sendErrorObject(response);
            return;
        }
        if(!validString(args._id)){
            serverErr("No _id given to cmdHandler.getUserById");
            // sendErrorObject(response);
            response.send(ERROR_OBJ);
            return;
        }
        getUserById(args._id, function(result){response.send(result);},
            function(){sendErrorObject(response)});
    };

    cmdHandler.getUserByEmail = function(args, response){
        if(isNull(args)){
            serverErr("No args given to cmdHandler.getUserByEmail");
            sendErrorObject(response);
            return;
        }
        if(!validString(args.email)){
            serverErr("No email given to cmdHandler.getUserByEmail");
            sendErrorObject(response);
            return;
        }
        getUserByEmail(args.email, function(result){response.send(result);},
            function(){sendErrorObject(response)});        
    };

    cmdHandler.createUser = function(args, response){
        if(isNull(args)){
            serverErr("No args given to cmdHandler.createUser");
            sendErrorObject(response);
            return;
        }
        if(!validString(args.first_name) || !validString(args.last_name)
            || !validString(email)){
            serverErr("No names / email given to cmdHandler.createUser");
            sendErrorObject(response);
            return;
        }
        createUser(args,function(){response.send(SUCCESS_OBJ)},
            function(){sendErrorObject(response)});
    };

}


//===============================================
//      handling uncaught exceptions and errors
//===============================================

function onUncaughtException(err) {
    var err = "uncaught exception: " + err;
    serverErr(err);
}

function sendErrorObject(response){
    if(isNull(response)){
        return;
    }
    response.send(ERROR_OBJ);
}

function serverErr(msg){
  console.log("------------Server Error Report Begins------------");
  console.log("Message: " + msg);
  console.log("Time   :"  + new Date());
  console.log("============Server Error Report Ends==========")
  console.log("\n");
}

function dbError(msg){
  console.log("------------Database Error Report Begins------------");
  console.log("Message: " + msg);
  console.log("Time   :"  + new Date());
  console.log("============Database Error Report Ends==========")
  console.log("\n");
}


//=================
//      Util
//=================
function argsToObj(args){

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


onStart();

