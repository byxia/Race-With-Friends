// simpleNodeServer.js
// A simple node server for 15-237.

var querystring = require("querystring");
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");


//============== Database ==============
function dbError(msg){
  console.log("------------Database Error Report Begins------------");
  console.log("Message: " + msg);
  console.log("Time   :"  + new Date());
  console.log("============Database Error Report Finishes==========")
  console.log("\n");
}

/*====TABLE (Collection) NAMES =====*/
/*prefix with T*/
var T_USER = "User";
var T_RACE = "Race";
var T_FRIEND = "Friend";

/*==== Models ====*/
var USER;
var RACE;
var FRIEND;

var CLIENT_ERR_MSG = "Errors occurred when processing the request.";  

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/test');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Database Connection Success");

  var USER_SCHEMA = new mongoose.Schema({
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
  var me = new USER({
    first_name : "Zi",
    last_name : "Wang"
  });
  // getAllUsers(log);

  
});


/*====CRUD Ops for USER====*/

function getAllUsers(successCallback, errorCallback){
  // if(isNull(USER)){
  //   dbError("No database connection or no user schema defined.");
  //   errorCallback(CLIENT_ERR_MSG);
  //   return;
  // }
  // USER.find(function(err,users){
  //   if(err){
  //       dbError(err);
  //       errorCallback(err);
  //   }
  //   else if(successCallback){
  //       successCallback(users);
  //   }
  // });
    _readFromUSER_(null,successCallback,errorCallback);
}

function getUserById(id,successCallback, errorCallback){
  // if(isNull(id) || !validString(id)){
  //   dbError("Invalid id provided to getUserById().");
  //   errorCallback(CLIENT_ERR_MSG);
  //   return;
  // }
  // if(isNull(USER)){
  //   dbError("No database connection or no user schema defined.");
  //   errorCallback(CLIENT_ERR_MSG);
  //   return;
  // }
  // USER.find({_id : id},function(err,user){
  //   if(err){
  //     dbError(err);
  //     errorCallback(CLIENT_ERR_MSG);
  //   }
  //   else if(successCallback){
  //     successCallback(user);
  //   }
  // });
    _readFromUSER_({_id : id},successCallback, errorCallback);
}


/*
* Insert the given user into the database
* user is an object that matches USER_SCHEMA
*/
function creatUser(user, errorCallback){
  if(isNull(USER) || isNull(user)){
    dbError("No user schema defined or no user is provided in creatUser()");
    errorCallback(CLIENT_ERR_MSG);
    return;
  }
  var newUser  = new USER(user);
  newUser.save(function(err){
    if(err){
      dbError(err);
      errorCallback(CLIENT_ERR_MSG);
    }
  });
}

/*
* Remove the user with the given _id 
*/
function removeUser(id, callback,errorCallback){
  if(!validString(id)){
    dbError("Invalid user id provided to removeUser()");
    errorCallback(CLIENT_ERR_MSG);
    return;
  }
  if(isNull(USER)){
    dbError("No database connection or no user schema defined.");
    errorCallback(CLIENT_ERR_MSG);
    return;
  }
  USER.remove({_id : id},function(err){
    if(err){
      dbError(err);
      errorCallback(CLIENT_ERR_MSG);
    }
    else if(callback){
      callback();
    }
  });
}



/*====CRUD Ops for RACE====*/
function getAllRaces(successCallback, errorCallback){
  if(isNull(RACE)){
    dbError("No database connection or no race schema defined.");
    errorCallback(CLIENT_ERR_MSG);
    return;
  }
  RACE.find(function(err,races){
    if(err){
      dbError(err);
      errorCallback(CLIENT_ERR_MSG);
    }
    else if(successCallback){
      successCallback(races);
    }
  });
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


function _readFromRACE_ (option, successCallback, errorCallback){
    _readFromDatabase_(RACE,option,successCallback,errorCallback);
}

function _readFromUSER_ (option, successCallback, errorCallback){
    _readFromDatabase_(USER,option,successCallback,errorCallback);
}

function _readFromFRIEND_(option, successCallback, errorCallback){
    _readFromDatabase_(FRIEND,option,successCallback,errorCallback);
}

/*
*   Private helper method to read a given model
*/
function _readFromDatabase_(model,option,successCallback,errorCallback){
    if(isNull(model)){
        dbError("Model is not defined or no database connection found. Can't read from db.");
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


function createRace(race, errorCallback){
  if(isNull(race) || isNull(RACE)){
    dbError("No race schema defined or no race is provided in createRace()");
    errorCallback(CLIENT_ERR_MSG);
    return;
  }
  var newRace = new RACE(race);
  newRace.save(function(err){
    dbError(err);
    errorCallback(CLIENT_ERR_MSG);
  });
}

function removeRace(id, successCallback,errorCallback){
  if(!validString(id)){
    dbError("Invalid user id provided to removeRace()");
    errorCallback(CLIENT_ERR_MSG);
    return;
  }
  if(isNull(RACE)){
    dbError("No database connection or no race schema defined.");
    errorCallback(CLIENT_ERR_MSG);
    return;
  }
  RACE.remove({_id : id},function(err){
    if(err){
      dbError(err);
    }
    else if(successCallback){
      successCallback();
    }
  });  
}




// /*=====Util=====*/
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





//======================================
//      init/main
//======================================

// http://localhost:8888/myCommand?x=42&y=10
function onRequest(request, response) {
    console.log('==========================');
    var query = url.parse(request.url);
    var pathname = query.pathname;
    if (strEndsWith(pathname, "html")) {
        console.log('SERVING HTML ' + pathname);
        serveStaticHTML(response, pathname);
    }
    else{
        console.log('PARSING CMD');
        parseCmd(response, query);
    }
}

process.on("uncaughtException", onUncaughtException);
http.createServer(onRequest).listen(8888);

//======================================
//      general util
//======================================

function strEndsWith(str, end){
    return str.substr(-end.length) === end;
}

function sendObjectAsJSON(response, object){
    response.write(JSON.stringify(object));
    response.end();
}

//======================================
//      handling uncaught exceptions
//======================================

function onUncaughtException(err) {
    var err = "uncaught exception: " + err;
    console.log(err);
}

//======================================
//      cmd handler
//======================================

function parseCmd(response, query){
    var pathname = query.pathname;
    var cmd = pathname.substr(1); // substr removes leading '/'
    var args = querystring.parse(query.query);
    response.writeHead(200, {   "Content-Type": "text/plain", 
                                "Cache-Control":"no-cache"});
    console.log("cmd = " + cmd);
    console.log("args = " + querystring.stringify(args));
  
}

function cmdHandler(cmd, args, response){
    function onCmdSuccess(result){
        sendObjectAsJSON(response, {'result':result});
    }

    function onCmdError(error){
        sendObjectAsJSON(response, { "err":error });
    }

    cmdHandlers[cmd](args, onCmdSuccess, onCmdError);
}


//======================================
//      cmd handler functions
//======================================

var cmdHandlers = { };

cmdHandlers.echo = function(args, onSuccess, onError) {
    var result = "Echo heard: <" + args.msg + ">";
    onSuccess(result);
}

cmdHandlers.sum = function(args, onSuccess, onError) {
    var x = Number(args.x);
    var y = Number(args.y);
    var result = x+y;
    onSuccess(result);
}

cmdHandlers.setMsg = function(args, onSuccess, onError) {
    // save args.msg to the file "msg.txt"
    function onComplete(err) {
        if (err) {
            onError(err);
        }
        else {
            var result = "ok";
            onSuccess(result);
        }
    };
    fs.writeFile(__dirname + "/msg.txt", args.msg, onComplete);
}

cmdHandlers.getMsg = function(args, onSuccess, onError) {
    // load args.msg from the file "msg.txt"
    function onComplete(err, data) {
        if (err) {
            onError(err);
        }
        else {
            var result = data.toString();
            onSuccess(result);
        }
    };
    fs.readFile(__dirname + "/msg.txt", onComplete);
}

cmdHandlers.getAllUsers = function(args, onSuccess, onError){
    getAllUsers(onSuccess, onError);
}

cmdHandlers.getAllRaces = function(args, onSuccess, onError){
    getAllRaces(onSuccess, onError)
}

cmdHandlers.getUser = function(args, onSuccess, onError){
    getUserById(args._id,onSuccess, onError);
}

cmdHandlers.getRace = function(args, onSuccess, onError){
    getRaceById(args._id,onSuccess, onError);
}

cmdHandlers.getRacesOwnedBy = function(args, onSuccess, onError){
    getRacesOwnedBy(args.owner, onSuccess, onError);
}


//======================================
//      serving static html
//======================================

function serveStaticHTML(response, pathname) {
    console.log("pathname = "+ pathname);
    var filename = path.join('./', pathname);
    fs.exists(filename, function(exists){
        if (!exists){
            response.writeHead(404, {   "Content-Type":"text/plain", 
                                        "Cache-Control":"no-cache" });
            response.write("404 Not Found\n");
            console.log("err 404: file does not exist");
            response.end();
        }
        else {
            fs.readFile(filename, "binary", function(err, file) {
                if (err) {
                    response.writeHead(500, {   "Content-Type":"text/plain", 
                                                "Cache-Control":"no-cache" });
                    response.write(err + "\n");
                    console.log("err 500: error reading file");
                }
                else {
                    response.writeHead(200, {   "Content-Type":"text/html", 
                                                "Cache-Control":"no-cache" });
                    console.log("ok 200 file.length =",file.length);
                    response.write(file, "binary");
                }
                response.end();
            });
        }
    });
}


