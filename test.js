// testing server for serving the client side google map page
var express = require("express");
var app = express();
var wwwDir = "/static";
app.use("/", express.static(__dirname + wwwDir));
app.get("/", function(req, res) { res.render(wwwDir + "/");});
app.listen(15237);
