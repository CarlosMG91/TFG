'use strict'

var express = require('express');
var api = express.Router();

var UserController = require('../controllers/userController');
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: '../resources/uploads/users'});

api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/updateUser/:id',md_auth.ensureAuth, UserController.updateUser);
api.post('/uploadImageUser/:id',[md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/getImageUser/:imageFile', UserController.getImageFile);

module.exports = api;