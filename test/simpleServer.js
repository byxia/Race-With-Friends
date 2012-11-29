// simpleNodeServer.js
// A simple node server for 15-237.

var querystring = require("querystring");
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");

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
    else {
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
    cmdHandler(cmd, args, response);
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