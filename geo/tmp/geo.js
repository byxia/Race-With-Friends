// server.js
// a very simple node server using the express module
var express = require("express");
var app = express();
var wwwDir = "/geo";
app.use("/", express.static(__dirname + wwwDir));
app.get("/", function(req, res) { res.render(wwwDir + "/index.html");});
app.listen(12345);
