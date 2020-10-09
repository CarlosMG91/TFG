'use strict'

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('../resources/messages.properties');
var Beer = require('../models/beer');
var Valoration = require('../models/valoration');
var Brewery = require('../models/brewery');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var jwt = require('../services/jwtService');
var path = require('path');
var fs = require('fs');

function get(request, response){
	var id = request.params.id;
	Beer.findById(id).populate({path: 'brewery'}).populate({path: 'valorations'}).populate({path: 'valorations', populate: {path: 'user'}}).exec((err, objectRetrieved) =>{
		if(err){
			response.status(500).send({message: properties.get('beerController.get.error'), error: err});
		}else if(objectRetrieved){
			response.status(200).send({beer: objectRetrieved});
		} else {
			response.status(404).send({message: properties.get('beerController.get.not.found')});
		}
	});
};

function save(request, response){
	var object = new Beer();
	var params = request.body;
	object.name = params.name; 
	object.style = params.style; 
	object.year = params.year; 
	object.country = params.country;
	object.degrees = params.degrees;
	object.glass = params.glass; 
	object.smell = params.smell;
	object.taste = params.taste; 
	object.pairing = params.pairing;
	object.image = params.image;
	object.brewery = params.brewery;
	object.valorations = [];
	object.save(object, (err, obj) =>{
		if(err){
			response.status(500).send({message: properties.get('beerController.save.error'), error: err});
		}else if(obj){
			response.status(200).send({beer: obj});
		} else {
			response.status(404).send({message: properties.get('beerController.save.error')});
		}
	});
};

function getAll(request, response){
	var breweryId = request.params.id;
	var find;
	if(!breweryId){
		find = Beer.find({}).sort('name');
	}else{
		find = Beer.find({brewery: breweryId}).sort('name');
	}

	find.populate({
		path: 'brewery'
		}).exec((err, objectRetrieved) =>{
		if(err){
			response.status(500).send({message: properties.get('beerController.getAll.error'), error: err});
		}else if(objectRetrieved){
			response.status(200).send({beers: objectRetrieved});
		} else {
			response.status(404).send({message: properties.get('beerController.getAll.not.found')});
		}
	}); 
};

function update(request, response){
	var id = request.params.id;
	var update = request.body;

	Beer.findByIdAndUpdate(id, update, (err, objectUpdated) => {
		if(err){
			response.status(500).send({ message: properties.get('beerController.update.error')});
		}else if(!objectUpdated){
			response.status(404).send({ message: properties.get('beerController.update.not.found')});
		}else{
			response.status(200).send({beer: objectUpdated});
		}
	});
};

function valorateBeer(request, response){
	var id = request.params.id;
	var valoration = new Valoration();
	var params = request.body;
	valoration.title  = params.title; 
	valoration.description = params.description;
	valoration.points = params.points;
	valoration.user = params.user;
	valoration.beer = id; 
	valoration.date = new Date();
	valoration.save(valoration, (err, obj) =>{
		if(err){
			response.status(500).send({message: properties.get('beerController.save.valoration.error'), error: err});
		}else if(obj){
			Beer.findByIdAndUpdate(id, {$push: {valorations: obj.id}}).exec((err, objectUpdated) => {
			if(err){
		 		response.status(500).send({ message: properties.get('beerController.save.valoration.error')});
			}else if(!objectUpdated){
				response.status(404).send({ message: properties.get('beerController.save.valoration.not.found')});
			}else{
				response.status(200).send({beer: objectUpdated});
			}
		 });
		} else {
			response.status(404).send({message: properties.get('beerController.save.valoration.error')});
		}
	});
};

function remove(request, response){
	var id = request.params.id;
	
	Valoration.find({beer: id}).remove((err, deletedObject)=>{
		if(err){
			response.status(500).send({ message: properties.get('beerController.remove.error'), error: err});
		}else if(!deletedObject){
			response.status(404).send({ message: properties.get('beerController.remove.not.found')});		
		}else{
			console.log("ok");
		}
	});

	Beer.findById(id).remove((err, deletedObject) =>{
		if(err){
			response.status(500).send({ message: properties.get('beerController.remove.error'), error: err});
		}else if(!deletedObject){
			response.status(404).send({ message: properties.get('beerController.remove.not.found')});		
		}else{
			response.status(200).send({beer: deletedObject});
		}
	});
};

function removeValoration(request, response){
	var id = request.params.id;
	Valoration.findById(id).remove((err, deletedObject) =>{
		if(err){
			response.status(500).send({ message: properties.get('beerController.remove.error'), error: err});
		}else if(!deletedObject){
			response.status(404).send({ message: properties.get('beerController.remove.not.found')});
		}else{
			response.status(200).send({beer: deletedObject});
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
			Beer.findByIdAndUpdate(id, {image: fileName}, (err, objectUpdated) =>{
				if(err){
					response.status(500).send({ message: properties.get('beerController.uploadImage.error')});
				}else if(!objectUpdated){
					response.status(404).send({ message: properties.get('beerController.uploadImage.error')});
				}else{
					response.status(200).send({beer: objectUpdated});
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
	var pathFile = '../resources/uploads/beers/'+imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
			response.sendFile(path.resolve(pathFile));
		}else{
			response.status(200).send({message: properties.get('util.getImage.no.image.found')});	
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
	uploadImage,
	valorateBeer,
	removeValoration
};