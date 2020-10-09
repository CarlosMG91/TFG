'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ValorationSchema = Schema({
	title: String,
	description: String, 
	points: Number, 
	date: Date,
	user: {type: Schema.ObjectId, ref: 'User'}, 
	beer: {type: Schema.ObjectId, ref: 'Beer'}
}); 

module.exports = mongoose.model('Valoration', ValorationSchema);