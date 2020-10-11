'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();


//rutas
var calculadora_routes = require('./routes/calculadoraRoutes');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cabeceras
app.use((request, response, next) =>{
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Headers', 'Authorization, X-API-Key, Origin, X-Requested-With, Content-type, Accept, Access-Allow-Request-Method');
	response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT,DELETE');
	response.header('Allow', 'GET, POST, OPTIONS, PUT,DELETE');
	next();
});

//rutas base
app.use('/api', calculadora_routes); 

module.exports = app;