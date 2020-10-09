'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwtService');
var path = require('path');
var fs = require('fs');
var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('../resources/messages.properties');

function saveUser(request, response){
	var user = new User();
	var params = request.body;
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.image = 'null';
	user.role = params.role;
	
	if(params.name != null && params.surname != null && params.email != null && params.password != null){
		bcrypt.hash(params.password, null, null, function(err,hash){
			if(err){
				response.status(500).send({ message: properties.get('userController.save.error')});
			}else{
				user.password = hash;
				user.save((err, userStored) => {
					if(err){
						response.status(500).send({ message: properties.get('userController.save.error')});
					} else if (!userStored){
						response.status(404).send({ message: properties.get('userController.save.error')});
					} else {
						response.status(200).send({ user: userStored});
					}
				});
			}
		});
	} else{
		response.status(200).send({ message: properties.get('userController.datosInsuficientes')});
	}
};

function loginUser(request, response){
	var params = request.body;
	var email = params.email;
	var password = params.password;

	if(email == null ||password == null){
		response.status(200).send({ message:  properties.get('userController.datosInsuficientes')});
	} else {
		User.findOne({email: email.toLowerCase()}, (err, user) => {
			if(err){
				response.status(500).send({ message:  properties.get('userController.login.error')});
			} else if (!user) {
				response.status(404).send({ message:  properties.get('userController.login.error')});

			} else{
				bcrypt.compare(password, user.password, function(err,check){
					if(err){
						response.status(500).send({ message:  properties.get('userController.login.error')});
					} else if(check){
						if(params.gethash){
							response.status(200).send({token: jwt.createToken(user)});
						}else{
							response.status(200).send({ user: user});
						}
					} else{
						response.status(500).send({ message: properties.get('userController.login.error')});
					}
				});
			}
		});
	}
};

function updateUser(request, response){
	var userId = request.params.id;
	var update = request.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			response.status(500).send({ message: properties.get('userController.update.error')});
		}else if(!userUpdated){
			response.status(404).send({ message:  properties.get('userController.update.error')});
		}else{
			response.status(200).send({user: userUpdated});
		}
	});
};

function uploadImage(request, response){
	var userId = request.params.id;
	var fileName = 'Sin imagen';
	if(request.files){
		var filePath = request.files.image.path;
		var fileSplit = filePath.split("\\");
		var fileName = fileSplit[fileSplit.length-1];
		var extensionSplit = fileName.split('\.');
		var fileExtension = extensionSplit[extensionSplit.length-1];
		if(fileExtension.toLowerCase() == 'png' ||fileExtension.toLowerCase() == 'jpg' ||fileExtension.toLowerCase() == 'gif' ){
			User.findByIdAndUpdate(userId, {image: fileName}, (err, userUpdated) =>{
					if(err){
						response.status(500).send({ message:  properties.get('userController.update.error')});
					}else if(!userUpdated){
						response.status(404).send({ message: properties.get('userController.update.error')});
					}else{
						response.status(200).send({image: fileName, user: userUpdated});
					}
			}); 
		}else{
			response.status(200).send({message: properties.get('userController.update.image.extension.error')});
		}
	}else{
		response.status(200).send({message: properties.get('userController.update.image.error')});
	}	
};

function getImageFile(request, response){
	var imageFile = request.params.imageFile;
	var pathFile = '../resources/uploads/users/'+imageFile;
	fs.exists(pathFile, function(exists){
		if(exists){
			response.sendFile(path.resolve(pathFile));
		}else{
			response.status(200).send({message: properties.get('userController.get.image.not.found')});	
		}
	});
};

module.exports = {
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};