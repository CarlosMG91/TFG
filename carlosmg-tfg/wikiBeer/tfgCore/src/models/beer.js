'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BeerSchema = Schema({
	name: String,
	style: String, 
	year: Number, 
	degrees: Number,
	glass: String, 
	smell: String,
	taste: String, 
	pairing: String,
	image: String,
	history: String,
	brewery: {type: Schema.ObjectId, ref: 'Brewery'},
	valorations: [{type: Schema.ObjectId, ref: 'Valoration'}]
}); 

module.exports = mongoose.model('Beer', BeerSchema);