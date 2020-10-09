'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();


//rutas
var beer_routes = require('./routes/beerRoutes');
var user_routes = require('./routes/userRoutes');
var brewery_routes = require('./routes/breweryRoutes');

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
app.use('/api', beer_routes); 
app.use('/api', user_routes); 
app.use('/api', brewery_routes);

module.exports = app;