'use strict'

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('../resources/messages.properties');
var Brewery = require('../models/brewery');
var Beer = require('../models/beer');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var jwt = require('../services/jwtService');
var path = require('path');
var fs = require('fs');

function get(request, response){
	var id = request.params.id;
	Brewery.findById(id).exec((err, objectRetrieved) =>{
		if(err){
			response.status(500).send({message: properties.get('breweryController.get.error'), error: err});
		}else if(objectRetrieved){
			response.status(200).send({brewery: objectRetrieved});
		} else {
			response.status(404).send({message: properties.get('breweryController.get.not.found')});
		}
	});
};

function save(request, response){
	var object = new Brewery();
	var params = request.body;

	object.name = params.name;
	object.country = params.country;
	object.description = params.description;
	object.image = null;

	object.save(object, (err, object) =>{
		if(err){
			response.status(500).send({message: properties.get('breweryController.save.error'), error: err});
		}else if(object){
			response.status(200).send({brewery: object});
		} else {
			response.status(404).send({message: properties.get('breweryController.save.error')});
		}
	});
};

function getAll(request, response){
	var find = Brewery.find({}).sort('name');
	
	find.exec((err, objectRetrieved) =>{
		if(err){
			response.status(500).send({message: properties.get('breweryController.getAll.error'), error: err});
		}else if(objectRetrieved){
			response.status(200).send({breweries: objectRetrieved});
		} else {
			response.status(404).send({message: properties.get('breweryController.getAll.not.found')});
		}
	}); 
};

function update(request, response){
	var id = request.params.id;
	var update = request.body;

	Brewery.findByIdAndUpdate(id, update, (err, objectUpdated) => {
		if(err){
			response.status(500).send({ message: properties.get('breweryController.update.error')});
		}else if(!objectUpdated){
			response.status(404).send({ message: properties.get('breweryController.update.error')});
		}else{
			response.status(200).send({brewery: objectUpdated});
		}
	});
};

function remove(request, response){
	var id = request.params.id;
	Brewery.findByIdAndRemove(id, (err, objectDeleted)=>{
		if(err){
			response.status(500).send({ message: properties.get('breweryController.remove.error')});
		}else if(!objectDeleted){
			response.status(404).send({ message: properties.get('breweryController.remove.error')});
		}else{
			Beer.find({brewery: objectDeleted._id}).remove((err, beerDeleted) =>{
				if(err){
					response.status(500).send({ message: properties.get('breweryController.remove.beer.error')});
				}else if(!beerDeleted){
					response.status(404).send({ message: properties.get('breweryController.remove.beer.error')});
				}else{
					response.status(200).send({brewery: objectDeleted});
				}
			});
		}
		
	});
};

function uploadImage(request, response){
	var id = request.params.id;
	var fileName = 'No image';
	if(request.files){
		var filePath = request.files.image.path;
		var fileSplit = filePath.split("\\");
		var fileName = fileSplit[fileSplit.length-1];
		var extensionSplit = fileName.split('\.');
		var fileExtension = extensionSplit[extensionSplit.length-1];

		if(fileExtension.toLowerCase() == 'png' ||
			fileExtension.toLowerCase() == 'jpg' ||
			fileExtension.toLowerCase() == 'gif' ){
			Brewery.findByIdAndUpdate(id, {image: fileName}, (err, objectUpdated) =>{
				if(err){
					response.status(500).send({ message: properties.get('breweryController.uploadImage.error')});
				}else if(!objectUpdated){
					response.status(404).send({ message: properties.get('breweryController.uploadImage.error')});
				}else{
					response.status(200).send({brewery: objectUpdated});
				}
			}); 
		}else{
			response.status(200).send({message: properties.get('util.uploadImage.invalidExtension')});
		}
	}else{
		response.status(200).send({message: properties.get('util.uploadImage.no.image.uploaded')});
	}	
};

function getImageFile(request, response){
	var imageFile = request.params.imageFile;
	var pathFile = '../resources/uploads/breweries/'+imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
			response.sendFile(path.resolve(pathFile));
		}else{
			response.status(200).send({message: properties.get('util.uploadImage.no.image.found')});	
		}
	});
};

module.exports = {
	get,
	save,
	getAll,
	update,
	remove,
	getImageFile,
	uploadImage
};