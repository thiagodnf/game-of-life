var express = require("express");
var app = express();

app.use(express.static(__dirname + "/"));

var port = process.env.PORT || 3000;

// START THE SERVER
// =============================================================================
app.listen(port);
console.log("Magic happens on port " + port);
