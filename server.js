/*====================================================
                  Race With Friends
            CMU 15-237 Fall 2012 Final Project
  =====================================================
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
var FB = require('fb');
var graph = require('fbgraph');
var dbUtil = require('./dbUtil.js').util;
var util = require('./Util.js').util;

var local = true;

//server side constants
var errorMsg = "Error occurred in processing the request.";
var ERROR_OBJ = {
    error: errorMsg,
    status: 0
};
var SUCCESS_OBJ = {
    status: 1
};
var PORT = process.env.PORT || 8888;
var FB_APP_ID = "173419086133939";
var FB_APP_SECRET = "2cb745277dce894015c75e2de5d49fcb";
var cmdHandler = {};
var db = mongoose.createConnection(process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 'mongodb://localhost/race');
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


function onStart() {

    initCommandHandler();
    app.configure(function() {
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session({
            secret: 'change me!'
        }));
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
        callbackURL: local? "http://localhost:8888/auth/facebook/callback" : 
                        "http://racewithfriends.heroku.com/auth/facebook/callback"
    }, function(accessToken, refreshToken, profile, done) {
        FB.setAccessToken(accessToken);
        graph.setAccessToken(accessToken);

        // FB.api('me/feed','post',{message :  "check this out", link: "http://racewithfriends.heroku.com"},function(res){
        //         if(!res || res.error){
        //             util.serverErr(res || res.error);
        //             util.serverErr("Error when posting to fb");
        //             // response.send(ERROR_OBJ);
        //             return;
        //         }
        //         else{
        //             util.log(res);
        //             util.serverErr("Success post");
        //         }
        //         // response.send(SUCCESS_OBJ);
        //     });


    
        getUserById(profile.id, function(user) {
            if(util.isNull(user) || util.isEmptyObj(user)) {
                console.log("No such user exists. Creating new User");
                createUser({
                    id: profile.id,
                    token: accessToken,
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    last_login_date: new Date()
                });
            } else {
                console.log("User exists. Update access token and last login time");
                _updateUserUnique_({
                    id: profile.id
                }, {
                    token: accessToken,
                    last_login_date: new Date()
                });
            }
        }, function(err) {
            console.log(err);
        });

        return done(null, profile);
        // });
    }));

    initRequestHandler();
    process.on("uncaughtException", onUncaughtException);
    log("Server started successfully");

    initDatabase();

}

function initDatabase() {
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
        log("Database Connection Success");

        //Schema for user collection
        var USER_SCHEMA = new mongoose.Schema({
            id: String,
            token: String,
            first_name: String,
            last_name: String,
            last_login_date: Date,
            record_dist: Number,
            record_pace: Number,
            record_race_id: String,

            won_races: Number,
            total_races: Number,

            total_dist: Number,
            total_time: Number
        });

        //Schema for race collection
        var RACE_SCHEMA = new mongoose.Schema({
            owner_id: String,
            opponent_id: String,
            owner_first_name: String,
            owner_last_name: String,
            opponent_first_name: String,
            opponent_last_name: String,
            status: String,
            mode  : String,
            creation_date: {
                type: Date,
            default:
                Date.now
            },

            owner_start_date: Date,
            opponent_start_date: Date,
            owner_finish_date: Date,
            opponent_finish_date: Date,

            owner_pace : Number,
            opponent_pace : Number,
            owner_route: String,
            opponent_route: String,
            owner_time: String,
            opponent_time: String,
            owner_distance: Number,
            opponent_distance: Number,

            length: Number,
            winner_id: String
        });

        USER = db.model(T_USER, USER_SCHEMA);
        RACE = db.model(T_RACE, RACE_SCHEMA);


    });
}

function initRequestHandler() {
    if(!app) {
        util.serverErr("No app instance found. Can't init requestHandler");
        return;
    }


    app.get('/', function(req, res) {
        if(!req.isAuthenticated()) {
            res.redirect("/static/login.html");
            return;
        }
        res.redirect("/static/active.html");
    });

    app.get('/details',function(req,res){
        console.log(req.url.substring(8));
        res.redirect('/static/details.html'+req.url.substring(8));
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/back/:url', function(req, res) {
        if(!req.isAuthenticated()) {
            res.redirect("/static/login.html");
            return;
        }
        console.log("redirect back to " + req.params.url);
        res.redirect("/static/" + req.params.url);
    });

    app.get('/newrace', function(req, res) {
        if(!req.isAuthenticated()) {
            res.redirect("/static/login.html");
            return;
        }
        res.redirect('/static/new-race.html');
    });

    // app.get('/details',function(req,res){
    //     console.log(args);
    //     res.redirect('/static/details.html'+req.params.args);
    // });


    app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res) {
        // The request will be redirected to Facebook for authentication, so this
        // function will not be called.
    });

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/',
        scope: ['user_photos', 'publish_stream']
    }));
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    //handle commands and errors
    app.post('/api/:cmd', handlePostRequest);
    app.get("/api/:cmd", handleCommands);
    app.get("/err/:msg", handleClientError);
    app.listen(PORT);

}


//=========================
//      Database Util
//=========================


function _readFromRACE_(option, successCallback, errorCallback) {
    // _readFromDatabase_(RACE,option,successCallback,errorCallback, "Race model");
    dbUtil.readFromDatabase(RACE, option, successCallback, errorCallback, "Race Model");
}

function _readFromUSER_(option, successCallback, errorCallback) {
    dbUtil.readFromDatabase(USER, option, successCallback, errorCallback, "User Model");
}

function _updateUserUnique_(query, newInstance, options, successCallback, errorCallback) {
    dbUtil.updateOneInstance(USER, query, newInstance, options, successCallback, errorCallback, "User Model");
}

function _updateUserMulti_(query, newInstance, options, successCallback, errorCallback) {
    dbUtil.updateManyInstances(USER, query, newInstance, options, successCallback, errorCallback, "User Moel");
}

function _updateRaceUnique_(query, newInstance, options, successCallback, errorCallback) {
    dbUtil.updateOneInstance(RACE, query, newInstance, options, successCallback, errorCallback, "Race Model");

}

function _updateRaceMulti_(query, newInstance, options, successCallback, errorCallback) {
    dbUtil.updateManyInstances(RACE, query, newInstance, options, successCallback, errorCallback, "Race Model");
}



//==========================
//     USER table CRUD
//==========================


function createUser(user, successCallback, errorCallback) {
    dbUtil.createNewInstance(USER, user, successCallback, errorCallback, "User Model");
}

function getAllUsers(successCallback, errorCallback) {
    _readFromUSER_(null, successCallback, errorCallback);
}

function getUserById(id, successCallback, errorCallback) {
    _readFromUSER_({
        id: id
    }, successCallback, errorCallback);
}


function getUserByEmail(userEmail, successCallback, errorCallback) {
    _readFromUSER_({
        email: userEmail
    }, successCallback, errorCallback);
}

function removeUserById(id, successCallback, errorCallback) {
    dbUtil.removeInstance(USER, {
        id: id
    }, successCallback, errorCallback, "User model");

}

function _updateRaceCount_(id,type){
    if(type !== "win" && type !== "total")
        return;
    getUserById(id,function(data){
        if(!data || !data[0]){
            util.serverErr("no user. can't add race");
            return;   
        }
        var user = data[0];
        if(type === "win")
            user.won_races = 1 + (user.won_races  ||0);
        else if(type === "total")
            user.total_races= 1+ (user.total_races||0);
        user.save();
    },function(err){
        util.serverErr("err in get user by id. can't add one race");
    });    
}

function updatePersonalRecord(id, race){
    if(!id || !util.validString(id)){
        util.serverErr("no id. can't update pr");
        return;
    }
    getUserById(id,function(data){
        if(!data || !data[0]){
            util.serverErr("no user. can't update pr");
            return;   
        }
        var user = data[0];
        if(id === race.winner_id)
            user.won_races = parseInt(1) + parseInt((user.won_races || 0));
        if(race.distance){
            user.total_dist = parseFloat(race.distance) + parseFloat(user.total_dist || 0);
            if(!user.record_dist || user.record_dist < race.distance){
                user.record_dist = race.distance;
            }
        }
        if(race.duration){
            user.total_time = parseFloat(race.duration) + parseFloat(user.total_time || 0);
        }
        if(race.pace &&
            (!user.record_pace || race.pace < user.record_pace)){
            user.pace = race.pace;
        }
        user.save();
    },function(err){
        util.serverErr("err in get user by id. can't update pr");
    });    

}

//==========================
//     RACE table CRUD
//==========================


function createRace(race, successCallback, errorCallback) {
    dbUtil.createNewInstance(RACE, race, successCallback, errorCallback, "Race Model");
}

function getAllRaces(successCallback, errorCallback) {
    _readFromRACE_(null, successCallback, errorCallback);
}

function getRaceById(id, successCallback, errorCallback) {
    _readFromRACE_({
        _id: id
    }, successCallback, errorCallback);
}

function getAllRacesOwnedBy(id, successCallback, errorCallback) {
    _readFromRACE_({
        owner_id: id
    }, successCallback, errorCallback);
}

function getAllRacesChallenged(id, successCallback, errorCallback) {
    _readFromRACE_({
        opponent_id: id
    }, successCallback, errorCallback);
}

function removeRaceById(id,successCallback,errorCallback){
    dbUtil.removeInstance(RACE,{_id : id},successCallback,errorCallback, "Race Model");
}



//==========================
//     Requeset Handler
//==========================

function handleClientError(request, response) {
    util.serverErr("Client side error-> " + request.params.msg.toString() + "\n URL: " + request.url);
    response.send({});
}

/*
 * Handle POST ajax request. Send back JSON object
 */

function handlePostRequest(request, response) {
    var requestURL = request.url;
    var requestQuery = url.parse(requestURL);

    if(util.isNull(requestQuery)) {
        util.serverErr("Invalid url: " + requestURL + ". No query can be parsed in handlePostRequest.");
        response.send(ERROR_OBJ);
        return;
    }
    var cmd = requestQuery.pathname.toString().substring(5);
    if(util.isNull(cmd)) {
        util.serverErr("Invalid ajax request: " + requestURL + ". No command found in handlePostRequest.");
        response.send(ERROR_OBJ);
        return;
    }
    if(util.isNull(cmdHandler[cmd]) || typeof(cmdHandler[cmd]) !== "function") {
        util.serverErr("Invalid command. Server can't handle post request with command: " + cmd);
        response.send(ERROR_OBJ);
        return;
    }
    if(util.isNull(request.body)) {
        request.body = {};
    }
    cmdHandler[cmd](request.body, request, response);
}

/*
 *   Handle GET ajax request. Send back JSON object
 */

function handleCommands(request, response) {

    var requestURL = request.url;
    var requestQuery = url.parse(requestURL);

    if(util.isNull(requestQuery)) {
        util.serverErr("Invalid url: " + requestURL + ". No query can be parsed.");
        response.send(ERROR_OBJ);
        return;
    }
    var cmd = requestQuery.pathname.toString().substring(5);
    var args = querystring.parse(requestQuery.query);
    if(util.isNull(cmd)) {
        util.serverErr("Invalid ajax request: " + requestURL + ". No command found.");
        response.send(ERROR_OBJ);
        return;
    }
    if(util.isNull(cmdHandler[cmd]) || typeof(cmdHandler[cmd]) !== "function") {
        util.serverErr("Invalid command. Server can't handle command: " + cmd);
        response.send(ERROR_OBJ);
        return;
    }

    console.log("Handling cmd: " + cmd);
    cmdHandler[cmd](args, request, response);
}


//Init command hanlder to handle different ajax request 
//and send back JSON object


function initCommandHandler() {
    cmdHandler.getAllUsers = function(args, request, response) {
        //no args needed
        getAllUsers(function(results) {
            response.send(results);
        }, function() {
            response.send(ERROR_OBJ)
        });
    };

    cmdHandler.getUserById = function(args, request, response) {
        if(!request.isAuthenticated() || !request.user) {
            response.redirect('/');
            return;
        }
        if(util.isNull(args)) {
            util.serverErr("No args given to cmdHandler.getUserById");
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args._id)) {
            util.serverErr("No _id given to cmdHandler.getUserById");
            // response.send(ERROR_OBJ);
            response.send(ERROR_OBJ);
            return;
        }
        var id = args._id === "me" ? request.user.id : args._id;
        console.log("getting user by id:" + id);
        getUserById(id, function(result) {
            response.send(result);
        }, function() {
            response.send(ERROR_OBJ)
        });
    };

    cmdHandler.getUserByEmail = function(args, request, response) {
        if(util.isNull(args)) {
            util.serverErr("No args given to cmdHandler.getUserByEmail");
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args.email)) {
            util.serverErr("No email given to cmdHandler.getUserByEmail");
            response.send(ERROR_OBJ);
            return;
        }
        getUserByEmail(args.email, function(result) {
            response.send(result);
        }, function() {
            response.send(ERROR_OBJ)
        });
    };

    cmdHandler.createUser = function(args, request, response) {
        if(!request.isAuthenticated() || !request.user) {
            response.redirect('/');
            return;
        }
        if(util.isNull(args)) {
            util.serverErr("No args given to cmdHandler.createUser");
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args.first_name) || !util.validString(args.last_name) || !util.validString(email)) {
            util.serverErr("No names / email given to cmdHandler.createUser");
            response.send(ERROR_OBJ);
            return;
        }
        createUser(args, function() {
            response.send(SUCCESS_OBJ)
        }, function() {
            response.send(ERROR_OBJ)
        });
    };

    cmdHandler.getAllFriends = function(args, request, response) {
        if(!request.isAuthenticated() || !request.user) {
            response.redirect('/');
            return;
        }
        getUserById(request.user.id, function(data) {
            if(util.isNull(data) || util.isEmptyObj(data)) {
                util.dbError("No user found with id: " + request.user.id);
                response.send(ERROR_OBJ);
                return;
            }
            FB.setAccessToken(data[0].token);
            FB.api('/me/friends', function(list) {
                if(!list) {
                    serverErr('Error. List is null from FB.api(/me/friends)');
                    response.send(ERROR_OBJ);
                    return;
                }
                if(args.gameOnly === "false"){
                    console.log("not game onyl");
                    response.send({
                        me : request.user,
                        data : list ? list.data : []
                    });
                }
                else{
                                        console.log(" game onyl");

                    getAllUsers(function(results){
                        var overlap = [];
                        for(var i=0;i<results.length;i++){
                            for(var j=0; j<list.data.length;j++){
                                if(results[i].id === list.data[j].id){
                                    overlap.push(results[i]);
                                }
                            }
                        }
                        response.send({
                            me : request.user,
                            data : overlap
                        });
                    });
                }
            });

        });
    }


    cmdHandler.getFBUserById = function(args, request, response) {
        if(!request.isAuthenticated() || !request.user) {
            response.redirect('/');
            return;
        }
        getUserById(request.user.id, function(data) {
            if(util.isNull(data) || util.isEmptyObj(data)) {
                util.dbError("No user found with id: " + request.user.id);
                response.send(ERROR_OBJ);
                return;
            }
            // console.log(data);
            FB.setAccessToken(data[0].token);
            if(!util.validString(args.id)) {
                util.dbError("No id given to getFBUserById. ");
                response.send(ERROR_OBJ);
            }
            FB.api('/' + args.id, function(data) {
                if(isNull(data) || data.error) {
                    serverErr('Error occurred in FB.api ' + '/' + args.id + ", " + data.error);
                    response.send(ERROR_OBJ);
                    return;
                }
                response.send(data);
            });

        });
    }

    cmdHandler.getMyself = function(args, request, response) {
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        getUserById(request.user.id, function(data) {
            if(util.isNull(data) || util.isEmptyObj(data)) {
                util.dbError("No user found with id: " + request.user.id);
                response.send(ERROR_OBJ);
                return;
            }
            response.send(data[0]);

        });
    }

    cmdHandler.createRace = function(args, request, response) {
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        createRace(args, function(data) {
            updatePersonalRecord(args.owner_id,{
                duration : args.owner_time,
                pace     : args.owner_pace,
                distance : args.owner_distance,
                // duration : 15,
                // pace     : 20,
                // distance : 500,
                winner_id: undefined
            });
            response.send(data);
        }, function() {
            response.send(ERROR_OBJ);
        });
    }

    cmdHandler.getOwnedRaces = function(args, request, response) {
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(request.user.id)) {
            util.serverErr("No id found in request to getOwnedRaces");
            response.send(ERROR_OBJ);
            return;
        }

        getAllRacesOwnedBy(request.user.id, function(list) {
            if(util.isNull(list)) {
                util.serverErr("No races found owned by : " + request.user.id);
                response.send(ERROR_OBJ);
                return;
            }
            var ownedList = [];
            for(var i=0;i<list.length;i++){
                if(list[i] && list[i].status !== "finished"){
                    ownedList.push(list[i]);
                }
            }
            response.send(ownedList);
        }, function(err) {
            response.send(ERROR_OBJ);
        });
    }

    cmdHandler.getChallengedRaces = function(args, request, response) {
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(request.user.id)) {
            util.serverErr("No id given to getChallengedRaces");
            response.send(ERROR_OBJ);
            return;
        }

        getAllRacesChallenged(request.user.id, function(list) {
            if(util.isNull(list)) {
                util.serverErr("No races found challenging: " + request.user.id);
                response.send(ERROR_OBJ);
                return;
            }
            var challengedList = [];
            for(var i=0;i<list.length;i++){
                if(list[i] && list[i].status !== "finished"){
                    challengedList.push(list[i]);
                }
            }            
            response.send(challengedList);
        }, function(err) {
            response.send(ERROR_OBJ);
        });
    }

    cmdHandler.getFinishedRaces = function(args,request,response){
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(request.user.id)) {
            util.serverErr("No id given to getFinishedRaces");
            response.send(ERROR_OBJ);
            return;
        }
        getAllRaces(function(list) {
            if(util.isNull(list)) {
                util.serverErr("Error occurred in getFinishedRaces. list is null");
                response.send(ERROR_OBJ);
                return;
            }
            var userList = [];
            for(var i = 0; i < list.length; i++) {
                if(!util.isNull(list[i]) && (list[i].owner_id === request.user.id || list[i].opponent_id === request.user.id)
                    && list[i].status && list[i].status === "finished") {
                    userList.push(list[i]);
                }
            }
            response.send({
                me : request.user,
                races : userList
            });
        }, function() {
            response.send(ERROR_OBJ);
        });        

    }

    cmdHandler.getRaceById = function(args, request, response){
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args._id)) {
            util.serverErr("No id given to get race by id");
            response.send(ERROR_OBJ);
            return;
        }        
        getRaceById(args._id,function(result){
            if(!result || !result[0]){
                serverErr("No race found with id: " + args._id);
                response.send(ERROR_OBJ);
                return;
            }
            response.send({
                me : request.user,
                race : result[0]
            });
        },function(err){
            response.send(ERROR_OBJ);
        });
    }

    cmdHandler.removeRaceById = function(args,request, response){
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args._id)) {
            util.serverErr("No id given to removeRaceById");
            response.send(ERROR_OBJ);
            return;
        }
        getRaceById(args._id,function(data){
            if(!data || !data[0]){
                util.serverErr("No race found with id: " + args._id +", can't remove");
                response.send(ERROR_OBJ);
                return;
            }
            if(data[0].owner_id !== request.user.id){
                util.serverErr("Can't remove others' race. user id: " +
                    request.user.id + ", race owner: " + data[0].owner_id);
                response.send(ERROR_OBJ);
                return;
            }
            removeRaceById(data[0]._id,function(){
                response.send(SUCCESS_OBJ);
            },function(err){
                util.serverErr("Error in getRaceById");
                response.send(ERROR_OBJ);
            });
        },function(err){
            response.send(ERROR_OBJ);
        }); 

    }

    cmdHandler.getAllRaces = function(args, request, response) {
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(request.user.id)) {
            util.serverErr("No id given to get all races");
            response.send(ERROR_OBJ);
            return;
        }
        getAllRaces(function(list) {
            if(util.isNull(list)) {
                util.serverErr("Error occurred in getAllRaces. list is null");
                response.send(ERROR_OBJ);
                return;
            }
            var userList = [];
            for(var i = 0; i < list.length; i++) {
                if(!util.isNull(list[i]) && (list[i].owner_id === request.user.id|| list[i].opponent_id === request.user.id)) {
                    userList.push(list[i]);
                }
            }
            response.send(userList);
        }, function() {
            response.send(ERROR_OBJ);
        });
    }

    cmdHandler.getSmallPicture = function(args, request, response) {
        _getPictureHelp_(args, request, response, "small");

    };

    cmdHandler.getSquarePicture = function(args, request, response) {
        _getPictureHelp_(args, request, response, "square");
    }

    cmdHandler.getLargePicture = function(args, request, response) {
        _getPictureHelp_(args, request, response, "large");
    }

    cmdHandler.postToFacebook = function(args, request,response){
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        getUserById(request.user.id,function(data){
            if(!data || !data[0]){
                util.serverErr("No user found with id: " + request.user.id+", can't post to fb");
                response.send(ERROR_OBJ);
                return;
            }
            FB.setAccessToken(data[0].token);
            FB.api('/me/feed', 'post', { message: args.msg, link : "http://www.racewithfriends.heroku.com" }, function(res) {
              if (!res || res.error) {
                log('Error occured in fb posting');
              } else {
                log('Post ID: ' + res.id);
                response.send(SUCCESS_OBJ);
              }
            });

        });      
                // var body = 'Post using Facebook-SDK from node.js module';
        // FB.api('me/feed', 'post', { message: body}, function (res) {
        //   if(!res || res.error) {
        //     console.log(!res ? 'error occurred' : res.error);
        //     return;
        //   }
        //   console.log('Post Id: ' + res.id);
        // });

    }

    cmdHandler.updateRace = function(args, request, response) {
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args._id)) {
            util.serverErr("No race id is passed to updateRace");
            response.send(ERROR_OBJ);
            return;
        }

        getRaceById(args._id, function(race) {
            if(isNull(race) || race.length !== 1) {
                util.serverErr("No race found or more than one race found with id: " + args._id);
                response.send(ERROR_OBJ);
                return;
            }
            var thisRace = race[0];
            var userId = request.user.id;
            if(userId !== thisRace.owner_id && userId !== thisRace.opponent_id) {
                util.serverErr("userId: " + userId + " is not in the race with id : " + args._id);
                response.send(ERROR_OBJ);
                return;
            }
            if(!thisRace.status || thisRace.status === "finished") {
                util.serverErr("Race is already finished. Id: " + args._id);
                response.send(ERROR_OBJ);
                return;
            }

            thisRace.opponent_distance = args.opponent_distance;
            thisRace.opponent_route = args.opponent_route;
            thisRace.opponent_time = args.opponent_time;
            thisRace.opponent_pace = args.opponent_pace;
            thisRace.status = "finished";
            thisRace.mode = args.mode;
            thisRace.opponent_start_date = args.opponent_start_date;
            thisRace.opponent_finish_date = args.opponent_finish_date;


            // if( !thisRace.owner_pace && !args.opponent_pace ){
            //     util.serverErr("Race :" + args._id +" has no owner/opponent pace. Can't determine winner");
            //     //TODO
            //     util.serverErr("For now, set owner as the winner if neither pace exists");
            //     thisRace.winner_id = thisRace.owner_id;
            // }
            // else if(!thisRace.owner_pace){
            //     util.serverErr("no owner pace. set opponent_id as winner");
            //     thisRace.winner_id = thisRace.opponent_id;
            // }
            // else if(!args.opponent_pace){
            //     util.serverErr("no opponent_pace, set owner_id as winner");
            //     thisRace.winner_id = thisRace.owner_id;
            // }
            // else {
            //     thisRace.winner_id = ( parseFloat(thisRace.owner_pace) < parseFloat(args.opponent_pace) )?
            //             thisRace.owner_id : thisRace.opponent_id;
            // }

            //TEST
            thisRace.winner_id = thisRace.owner_id;
            
            util.serverErr("winner id is " + thisRace.winner_id);

            thisRace.save(function(err,object){
                if(err){
                    util.serverErr("Error in race.save() in updateRace");
                    response.send(ERROR_OBJ);
                    return;
                }
                updatePersonalRecord(thisRace.opponent_id,{
                    duration : args.opponent_time,
                    pace     : args.opponent_pace,
                    distance : args.opponent_distance,
                    winner_id: args.winner_id                  
                });
                _updateRaceCount_(args.owner_id,"total");
                _updateRaceCount_(args.opponent_id,"total");
                _updateRaceCount_(thisRace.winner_id,"win");

                response.send(SUCCESS_OBJ);
            },function(err){
                log("err in save");
            });
           
        }, function(err) {
            log("err in get race by id");
            response.send(ERROR_OBJ);
        });

    }

    function _getPictureHelp_(args, request, response, size) {
        if(!request.isAuthenticated() || !request.user) {
            response.send(ERROR_OBJ);
            return;
        }
        if(!util.validString(args.id)) {
            util.serverErr("No id given to getSmallPicture");
            response.send(ERROR_OBJ);
            return;
        }
        getUserById(request.user.id, function(user) {
            if(util.isNull(user)) {
                util.serverErr("No user found with id:" + id + ". Can't get picture.");
                response.send(ERROR_OBJ);
                return;
            }
            graph.setAccessToken(user[0].token);
            graph.get(args.id + "/" + "picture?type=" + size, function(err, res) {
                if(err) {
                    console.log("graph get picture error");
                    console.log(err);
                    util.serverErr(err);
                    response.send(ERROR_OBJ);
                    return;
                } else {
                    FB.setAccessToken(user[0].token);
                    FB.api("/" + args.id, function(data) {
                        if(!data || data.error) {
                            serverErr("Error occurred in FB.api " + "/" + args.id + ", " + data.error);
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
        }, function(err) {
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

function isNull(obj) {
    return obj == undefined || obj == null || obj === undefined || obj === null;
}

//=================
//      Util
//=================


function log(obj) {
    console.log(obj);
}

//Start the server
onStart();