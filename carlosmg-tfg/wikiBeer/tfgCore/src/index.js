'use strict' 

var mongoose = require('mongoose'); 
var app = require('./app');
var port = process.env.PORT || 3977;
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/curso_angular', (err,res) => {
	if(err){
		console.log("conexion erronea a BBDD");
		throw err;
	} else{
		console.log("BBDD conectada OK");
		app.listen(port, function(){
			console.log("Server api rest running in http://localhost:" + port);
		});
	}
});