// testing server for serving the client side google map page
var express = require("express");
var app = express();
var wwwDir = "/geo";
app.use("/", express.static(__dirname + wwwDir));
app.get("/", function(req, res) { res.render(wwwDir + "/map.html");});
app.listen(15237);
