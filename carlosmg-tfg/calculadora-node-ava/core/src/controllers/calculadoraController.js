'use strict'
var calculadora = require('../utils/calculadoraUtil');

 function suma(request, response){

	console.log(request.params);
	var operando1 = request.params.operando1;
	var operando2 = request.params.operando2;
	var res;
	
	res = calculadora.suma(operando1,operando2);
	
	response.status(200).send({resultado: res});
}

function resta(request, response){
	var operando1 = request.params.operando1;
	var operando2 = request.params.operando2;
	
	res = calculadora.resta(operando1,operando2);
	response.status(200).send({resultado: res});
}

function divide(request, response){
	var operando1 = request.params.operando1;
	var operando2 = request.params.operando2;
	
	res = calculadora.divide(operando1,operando2);
	response.status(200).send({resultado: res});
}

function multiplica (request, response){
	var operando1 = request.params.operando1;
	var operando2 = request.params.operando2;
	
	res = calculadora.multiplica(operando1,operando2);
	response.status(200).send({resultado: res});
}


module.exports = {
	suma,
	resta,
	divide,
	multiplica
};