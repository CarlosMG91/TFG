'use strict'

var express = require('express');
var BreweryController = require('../controllers/breweryController');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: '../resources/uploads/Breweries'});

api.get('/brewery/:id',md_auth.ensureAuth, BreweryController.get);
api.get('/breweries/:id?',md_auth.ensureAuth, BreweryController.getAll);
api.post('/brewery',md_auth.ensureAuth,  BreweryController.save);
api.put('/updateBrewery/:id',md_auth.ensureAuth, BreweryController.update);
api.delete('/brewery/:id',md_auth.ensureAuth, BreweryController.remove);
api.post('/uploadImageBrewery/:id',[md_auth.ensureAuth, md_upload], BreweryController.uploadImage);
api.get('/getImageBrewery/:imageFile', BreweryController.getImageFile);

module.exports = api;