// simpleExpressServer.js
// A simple Express server for 15-237.

var querystring = require("querystring");
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var express = require("express");
var flash = require("connect-flash");
var errorMsg = "Error occurred in processing the request.";
var ERROR_OBJ = {error : errorMsg};
var cmdHandler = {};

//======================================
//      init/main
//======================================

var app = express();

app.configure(function(){
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'change me!' }));
    app.use(flash());
    app.use(app.router);
});

function serveStaticFile(request, response) {
    response.sendfile(request.params.staticFilename);
    console.log("Serve static file: " + request.params.staticFilename);
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
        response.send(ERROR_OBJ);
        return;
    }
    var cmd = requestQuery.pathname.toString().substring(5);
    var args = querystring.parse(requestQuery.query);
    if(isNull(cmd)){
        serverErr("Invalid ajax request: " + requestURL + ". No command found.");
        response.send(ERROR_OBJ);
        return;
    }
    if(isNull(cmdHandler[cmd]) ||
        typeof(cmdHandler[cmd])!=="function"){
        serverErr("Invalid command. Server can't handle command: "+ cmd);
        response.send(ERROR_OBJ);
        return;
    }
    cmdHandler[cmd](args,response);
}

app.get("/:staticFilename", serveStaticFile);
app.get("/api/:cmd", handleCommands);

app.listen(8888);

process.on("uncaughtException", onUncaughtException);


//===============================================
//      handling uncaught exceptions and errors
//===============================================

function onUncaughtException(err) {
    var err = "uncaught exception: " + err;
    console.log(err);
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




