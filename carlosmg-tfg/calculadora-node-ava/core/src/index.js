'use strict' 

var app = require('./app');
var port = process.env.PORT || 3977;

console.log("BBDD conectada OK");
	app.listen(port, function(){
		console.log("Server api rest running in http://localhost:" + port);
});