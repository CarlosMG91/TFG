'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BrewerySchema = Schema({
	name: String,
	country: String,
	image: String,
	description: String
}); 

module.exports = mongoose.model('Brewery', BrewerySchema);