/*=====================================================
                  Race With Friends
            CMU 15-237 Fall 2012 Final Project
  =====================================================*/
/* Bingying Xia(bxia), Ruoyu Li(ruoyul), Zi Wang(ziw)  */


// This file is the server of this application. 
// It handles http requests, talks to the database, and 
// responds with static files or JSON objects, depending on the request.


//require other node modules 
var mongoose = require('mongoose');
var querystring = require("querystring");
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var express = require("express");
var flash = require("connect-flash");
var util = require('util');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var dbUtil = require('./dbUtil.js').util;
var util   = require('./Util.js').util;
var FB = require('fb');
var graph = require('fbgraph');

//server side constants
var errorMsg = "Error occurred in processing the request.";
var ERROR_OBJ = {error : errorMsg,status: 0};
var SUCCESS_OBJ={status: 1};
var PORT = 8888;
var FB_APP_ID = "173419086133939";
var FB_APP_SECRET = "2cb745277dce894015c75e2de5d49fcb";
var cmdHandler = {};
var db = mongoose.createConnection('mongodb://localhost/race');
var app = express();

//Database constatns
/*====TABLE (Collection) NAMES =====*/
var T_USER = "User";
var T_RACE = "Race";

/*==== Models ====*/
var USER;
var RACE;

var CLIENT_ERR_MSG = errorMsg;  

//======================================
//      init/main
//======================================

//This method is called when the server starts. 
//It's the only entry point of the server.
function onStart(){

    initCommandHandler();
    app.configure(function(){
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session({ secret: 'change me!' }));
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);
        app.use('/static', express.static(__dirname + '/static'));
        app.use(express.static(__dirname + '/'));
    });


    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    // Use the FacebookStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Facebook
    //   profile), and invoke a callback with a user object.
    passport.use(new FacebookStrategy({
        clientID: FB_APP_ID,
        clientSecret: FB_APP_SECRET,
        // TODO: only place to change for local vs. remote testing
        callbackURL: "http://localhost:8888/auth/facebook/callback"
        // callbackURL: "http://zouni.heroku.com/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            FB.setAccessToken(accessToken);
            graph.setAccessToken(accessToken);

            getUserById(profile.id, function(user){
                if(util.isNull(user) || util.isEmptyObj(user)){
                    console.log("No such user exists. Creating new User");
                    creatUser({
                        id : profile.id,
                        token : accessToken,
                        first_name : profile.name.givenName,
                        last_name  : profile.name.familyName,
                        last_login_date : new Date()
                    });
                }
                else{
                    console.log("User exists. Update access token and last login time");
                    _updateUserUnique_({id : profile.id},{token: accessToken, last_login_date : new Date()});
                }
            }, 
            function(err){
                console.log(err);
            });
            
            return done(null, profile);
            // });
        }
    ));

    initRequestHandler();
    process.on("uncaughtException", onUncaughtException);
    log("Server started successfully");

    initDatabase();

}

function initDatabase(){
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {
      log("Database Connection Success");

      //Schema for user collection
      var USER_SCHEMA = new mongoose.Schema({
        id             : String,
        token          : String,
        first_name     : String,
        last_name      : String,
        last_login_date: Date,
        record_dist    : Number,
        record_race_id : String,
        won_races      : Number,
        lost_races     : Number,
        total_races    : Number
      });

      //Schema for race collection
      var RACE_SCHEMA = new mongoose.Schema({
        owner_id        : String,
        opponent_id     : String,
        owner_first_name: String,
        owner_last_name : String,
        opponent_first_name:String,
        opponent_last_name:String,
        status          : String,
        creation_date   : { type: Date, default: Date.now },
        finish_date     : Date, 
        owner_route     : [],
        opponent_route  : [],
        owner_time      : String,
        opponent_time   : String,
        length          : Number,
        winner_id       : String
      });

      USER = db.model(T_USER,   USER_SCHEMA);
      RACE = db.model(T_RACE, RACE_SCHEMA);

    });
}

function initRequestHandler () {
    if(!app){
        util.serverErr("No app instance found. Can't init requestHandler");
        return;
    }
    app.get('/', function(req, res){
        if(!req.isAuthenticated()){
            res.redirect("/static/login.html");
            return;
        }
                    FB.api('/me/', function(response) {
                console.log(response);
            });
        res.redirect("/static/active.html");
    }); 


    app.get('/auth/facebook',
        passport.authenticate('facebook'),
        function(req, res){
            // The request will be redirected to Facebook for authentication, so this
            // function will not be called.
    });
    app.get('/auth/facebook/callback', 
        passport.authenticate('facebook', { successRedirect: '/', 
                                            failureRedirect: '/',
                                            scope: ['read_friendlists', 'publish_actions','publish_stream'] }));    
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/account');
    });

    app.get('/newrace',
        function(req, res){
            res.redirect('/static/new-race.html');
    });
    app.get("/api/:cmd", handleCommands);
    app.get("/err/:msg", handleClientError);
    app.listen(PORT);

}


//=========================
//      Database Util
//=========================

//--------Table-Specific Helper Methods-------

function _readFromRACE_ (option, successCallback, errorCallback){
    // _readFromDatabase_(RACE,option,successCallback,errorCallback, "Race model");
    dbUtil.readFromDatabase(RACE,option,successCallback, errorCallback, "Race Model");
}

function _readFromUSER_ (option, successCallback, errorCallback){
    dbUtil.readFromDatabase(USER,option,successCallback,errorCallback, "User Model");
}

function _updateUserUnique_(query,newInstance, options, successCallback, errorCallback){
    dbUtil.updateOneInstance(USER,query,newInstance, options,successCallback,errorCallback,"User Model");
}

function _updateUserMulti_(query, newInstance,options, successCallback, errorCallback){
    dbUtil.updateManyInstances(USER, query, newInstance, options, successCallback, errorCallback, "User Moel");
}

function _updateRaceUnique_(){
    dbUtil.updateOneInstance(RACE,query,newInstance,options,successCallback,errorCallback,"Race Model");

}

function _updateRaceMulti_(query, newInstance, options, successCallback, errorCallback){
    dbUtil.updateManyInstances(RACE,query,newInstance,options,successCallback,errorCallback,"Race Model");
}

//==========================
//     USER table CRUD
//==========================
function createUser(user, successCallback, errorCallback){
    dbUtil.createNewInstance(USER,user,successCallback,errorCallback,"User Model");
}

function getAllUsers(successCallback, errorCallback){
    _readFromUSER_(null,successCallback,errorCallback);
}

function getUserById(id,successCallback, errorCallback){
    _readFromUSER_({id : id},successCallback, errorCallback);
}


function getUserByEmail(userEmail,successCallback, errorCallback){
    _readFromUSER_({email : userEmail},successCallback,errorCallback);
}

function creatUser(user, successCallback, errorCallback){
    dbUtil.createNewInstance(USER,user,successCallback,errorCallback,"User model");
}

function removeUserById(id, successCallback,errorCallback){
    dbUtil.removeInstance(USER,{id : id},successCallback, errorCallback, "User model");
  
}

//==========================
//     RACE table CRUD
//==========================
function createRace(race,successCallback, errorCallback){
    console.log("creating race: ");
    log(race);
    dbUtil.createNewInstance(RACE,race,successCallback,errorCallback,"Race Model");
}

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
    util.serverErr("Client side error-> " +request.params.msg.toString()+"\n URL: " + request.url);
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

    if(util.isNull(requestQuery)){
        util.serverErr("Invalid url: " + requestURL +". No query can be parsed.");
        response.send(ERROR_OBJ);
        return;
    }
    var cmd = requestQuery.pathname.toString().substring(5);
    var args = querystring.parse(requestQuery.query);
    if(util.isNull(cmd)){
        util.serverErr("Invalid ajax request: " + requestURL + ". No command found.");
        response.send(ERROR_OBJ);
        return;
    }
    if(util.isNull(cmdHandler[cmd]) ||
        typeof(cmdHandler[cmd])!=="function"){
        util.serverErr("Invalid command. Server can't handle command: "+ cmd);
        response.send(ERROR_OBJ);
        return;
    }

    console.log("Handling cmd: " + cmd);
    cmdHandler[cmd](args,request, response);
}

function initCommandHandler(){
    cmdHandler.getAllUsers = function(args,request,  response){
        //no args needed
        getAllUsers(function(results){response.send(results);},
             function(){response.send(ERROR_OBJ)});
    };

    cmdHandler.getUserById = function(args,request, response){
        if(util.isNull(args)){
            util.serverErr("No args given to cmdHandler.getUserById");
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args._id)){
            util.serverErr("No _id given to cmdHandler.getUserById");
            // response.send(ERROR_OBJ);
            response.send(ERROR_OBJ);
            return;
        }
        getUserById(args._id, function(result){response.send(result);},
            function(){response.send(ERROR_OBJ)});
    };

    cmdHandler.getUserByEmail = function(args,request,  response){
        if(util.isNull(args)){
            util.serverErr("No args given to cmdHandler.getUserByEmail");
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args.email)){
            util.serverErr("No email given to cmdHandler.getUserByEmail");
            response.send(ERROR_OBJ);
            return;
        }
        getUserByEmail(args.email, function(result){response.send(result);},
            function(){response.send(ERROR_OBJ)});        
    };

    cmdHandler.createUser = function(args,request,  response){
        if(util.isNull(args)){
            util.serverErr("No args given to cmdHandler.createUser");
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args.first_name) || !util.validString(args.last_name)
            || !util.validString(email)){
            util.serverErr("No names / email given to cmdHandler.createUser");
            response.send(ERROR_OBJ);
            return;
        }
        createUser(args,function(){response.send(SUCCESS_OBJ)},
            function(){response.send(ERROR_OBJ)});
    };

    cmdHandler.getAllFriends = function(args, request, response){
        if(!request.isAuthenticated() || 
            !request.user){
            response.redirect('/');
            return;
        }
        // console.log(request.user);
        getUserById(request.user.id,function(data){
            if(util.isNull(data) || util.isEmptyObj(data)){
                util.dbError("No user found with id: " + request.user.id);
                response.send(ERROR_OBJ);
                return;
            }
            // console.log(data);
            FB.setAccessToken(data[0].token);
            FB.api('/me/friends',function(list){
                response.send(list? list.data : ERROR_OBJ);
            });

        });
    }

    cmdHandler.getFBUserById = function (args, request, response) {
        if(!request.isAuthenticated() || 
            !request.user){
            response.redirect('/');
            return;
        }
        getUserById(request.user.id,function(data){
            if(util.isNull(data) || util.isEmptyObj(data)){
                util.dbError("No user found with id: " + request.user.id);
                response.send(ERROR_OBJ);
                return;
            }
            // console.log(data);
            FB.setAccessToken(data[0].token);
            if(!util.validString(args.id)){
                util.dbError("No id given to getFBUserById. " );
                response.send(ERROR_OBJ);
            }
            FB.api('/'+args.id,function(data){
                if(isNull(data) || data.error){
                    serverErr('Error occurred in FB.api ' + '/'+args.id +", "+ data.error);
                    response.send(ERROR_OBJ);
                    return;
                }
                response.send(data);
            });

        });
    }

    cmdHandler.getMyself = function(args, request, response) {
        if(!request.isAuthenticated() || 
            !request.user){
            response.send(ERROR_OBJ);
            return;
        }
        getUserById(request.user.id, function(data){
            if(util.isNull(data) || util.isEmptyObj(data)){
                util.dbError("No user found with id: " + request.user.id);
                response.send(ERROR_OBJ);
                return;
            }
            response.send(data[0]);

        });
    }

    cmdHandler.createRace = function(args, request, response){
        if(!request.isAuthenticated() || 
            !request.user){
            response.send(ERROR_OBJ);
            return;
        }
        createRace(args,function(data){
            response.send(data);
        },function(){
            response.send(ERROR_OBJ);
        });        
    }

    cmdHandler.getOwnedRaces = function(args, request, response){
        if(!request.isAuthenticated() || 
            !request.user){
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(request.user.id)){
            util.serverErr("No id found in request to getOwnedRaces");
            response.send(ERROR_OBJ);
            return;            
        }

        getAllRacesOwnedBy(request.user.id,function(list){
            if(util.isNull(list)){
                util.serverErr("No races found owned by : "+ request.user.id);
                response.send(ERROR_OBJ);
                return;
            }
            response.send(list);
        },function(err){
            response.send(ERROR_OBJ);
        });        
    }   

    cmdHandler.getChallengedRaces = function(args, request,response){
        if(!request.isAuthenticated() || 
            !request.user){
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(request.user.id)){
            util.serverErr("No id given to getChallengedRaces");
            response.send(ERROR_OBJ);
            return;            
        }

        getAllRacesChallenged(request.user.id,function(list){
            if(util.isNull(list)){
                util.serverErr("No races found challenging: "+ request.user.id);
                response.send(ERROR_OBJ);
                return;
            }
            response.send(list);
        },function(err){
            response.send(ERROR_OBJ);
        });            
    }

    cmdHandler.getAllRaces = function(args, request, response){
        if(!request.isAuthenticated() || 
            !request.user){
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args.id)){
            util.serverErr("No id given to getChallengedRaces");
            response.send(ERROR_OBJ);
            return;            
        }
        getAllRaces(function(list){
            if(util.isNull(list)){
                util.serverErr("Error occurred in getAllRaces. list is null");
                response.send(ERROR_OBJ);
                return;
            }
            var userList = [];
            for(var i=0;i<list.length;i++){
                if(!util.isNull(list[i]) &&
                        (list[i].owner_id === args.id || list[i].opponent_id=== args.id) ){
                    userList.push(list[i]);
                }
            }
            response.send(userList);
        },function(){
            response.send(ERROR_OBJ);
        });    
    }

    cmdHandler.getSmallPicture = function(args, request, response){
        _getPictureHelp_(args,request,response,"small");

    };

    cmdHandler.getSquarePicture = function(args, request, response){
        _getPictureHelp_(args,request,response,"square");
    }

    cmdHandler.getLargePicture = function(args, request, response){
        _getPictureHelp_(args,request,response,"large");
    }

    // function _getAllRaces_help(args,request, response, option){
    //     if(!request.isAuthenticated() || 
    //         !request.user){
    //         response.send(ERROR_OBJ);
    //         return;
    //     }
    //     if(!util.validString(args.id)){
    //         util.serverErr("No id given to getChallengedRaces");
    //         response.send(ERROR_OBJ);
    //         return;            
    //     }
    //     var allRacesList= [];
    //     getUserById(request.user.id,function(me){
    //         if(!me || !(me[0])){
    //             util.serverErr("Can't get user (self) with id: " + request.user.id);
    //             response.send(ERROR_OBJ);
    //             return;
    //         }
    //         graph.setAccessToken(me[0].token);
    //         graph.get(me[0].id+"/"+"picture?type=square",function(err,picture){
    //             if(err){
    //                 util.serverErr(err);
    //                 response.send(ERROR_OBJ);
    //                 return;
    //             }
    //             getAllRaces(function(list){
    //                 if(util.isNull(list)){
    //                     util.serverErr("Error occurred in getAllRaces. list is null");
    //                     response.send(ERROR_OBJ);
    //                     return;
    //                 }
    //                 for(var i=0; i<list.length;i++){
    //                     if(
    //                         (option === 'all'  && 
    //                         (list[i].owner_id === args.id || list[i].opponent_id=== args.id))
    //                         ||
    //                         (option === 'owned' && list[i].owner_id === args.id)
    //                         ||
    //                         (option === 'challenged' && list[i].opponent_id === args.id)){
    //                         allRacesList.push(list[i]);
    //                     }
    //                 }
    //                 var processed = 0;
    //                 for(var i=0; i<allRacesList.length;i++){
    //                     var anotherId = (allRacesList[i].owner_id === me[0].id)? allRacesList[i].opponent_id 
    //                                         : allRacesList[i].owner_id;
    //                     graph.get(anotherId+"/"+"picture?type=square",function(err,picture){
    //                         processed++;
    //                     });
    //                 }



    //             },function(err){
    //                 util.serverErr(err);
    //                 response.send(ERROR_OBJ);
    //                 return;
    //             });   
    //         });
    //     });




           
    // };

    function _getPictureHelp_(args,request,response,size){
        if(!request.isAuthenticated() || 
            !request.user){
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args.id)){
            util.serverErr("No id given to getSmallPicture");
            response.send(ERROR_OBJ);
            return;            
        }        
        getUserById(request.user.id,function(user){
            if(util.isNull(user)){
                util.serverErr("No user found with id:" + id+". Can't get picture.");
                response.send(ERROR_OBJ);
                return;
            }
            graph.setAccessToken(user[0].token);   
            graph.get(args.id+"/"+"picture?type="+size,function(err,res){
                if(err){
                    console.log(err);
                    util.serverErr(err);
                    response.send(ERROR_OBJ);
                    return;
                }
                else{
                    FB.setAccessToken(user[0].token);
                    FB.api("/"+args.id,function(data){
                          if(!data || data.error) {
                            serverErr("Error occurred in FB.api " + "/"+args.id +", "+ data.error);
                            response.send(ERROR_OBJ);
                            return;
                          }
                          res.first_name = data.first_name;
                          res.last_name = data.last_name;
                          res.id = args.id;
                          response.send(res);
                    });
                }
            });
        },function(err){
            response.send(ERROR_OBJ);
        });
    }
}


//===============================================
//      handling uncaught exceptions and errors
//===============================================

function onUncaughtException(err) {
    var err = "uncaught exception: " + err;
    util.serverErr(err);
}

function isNull(obj){
      return obj == undefined || obj == null
              || obj === undefined || obj === null;
}

//=================
//      Util
//=================
function log(obj){
  console.log(obj);
}

//Start the server
onStart();

