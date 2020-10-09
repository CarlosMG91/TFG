'use strict'

var express = require('express');
var BeerController = require('../controllers/beerController');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: '../resources/uploads/beers'});

api.get('/beer/:id',md_auth.ensureAuth, BeerController.get);
api.get('/beers/:id?',md_auth.ensureAuth,  BeerController.getAll);
api.post('/beer',md_auth.ensureAuth,  BeerController.save);
api.post('/valorateBeer/:id',md_auth.ensureAuth,  BeerController.valorateBeer);
api.put('/beer/:id',md_auth.ensureAuth, BeerController.update);
api.delete('/beer/:id',md_auth.ensureAuth, BeerController.remove);
api.delete('/valoration/:id',md_auth.ensureAuth, BeerController.removeValoration);
api.post('/uploadImageBeer/:id',[md_auth.ensureAuth, md_upload], BeerController.uploadImage);
api.get('/getImageBeer/:imageFile', BeerController.getImageFile);

module.exports = api;