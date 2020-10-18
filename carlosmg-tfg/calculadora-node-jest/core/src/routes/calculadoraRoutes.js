'use strict'

var express = require('express');
var api = express.Router();

var CalculadoraController = require('../controllers/calculadoraController');

api.get('/suma', CalculadoraController.suma);
api.get('/resta', CalculadoraController.resta);
api.get('/multiplica', CalculadoraController.multiplica);
api.get('/divide', CalculadoraController.divide);

module.exports = api;