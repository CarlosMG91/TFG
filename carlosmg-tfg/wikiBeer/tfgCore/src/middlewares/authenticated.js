'use strict'

var secret = 'secret'
var jwt =  require('jwt-simple');
var moment =  require('moment');

exports.ensureAuth = function(request, response, next){
	if(!request.headers.authorization){
		return response.status(403).send({message: "La petición no tiene cabecera authorization"});
	}

	var token = request.headers.authorization.replace(/['"]+/g,'');

	try{
		var payload = jwt.decode(token, secret);
		if(payload.exp <= moment.unix()){
			console.log("Token expirado");
			return response.status(401).send({message: "Token ha expirado"});	
		}

	}catch(exception){
		return response.status(404).send({message: "Token inválido"});
	}

	request.user = payload;

	next();
};
