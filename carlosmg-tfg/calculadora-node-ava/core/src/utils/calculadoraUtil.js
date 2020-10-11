'use strict'

function suma(valor1, valor2){
	if(!esNumero(valor1) ||!esNumero(valor2)){
		return 0;
	}
	return parseInt(valor1)+parseInt(valor2);
}

function resta(valor1, valor2){
	if(!esNumero(valor1) ||!esNumero(valor2)){
		return 0;
	}
	return valor1-valor2;
}

function divide(valor1, valor2){
	if(!esNumero(valor1) ||!esNumero(valor2)){
		return 0;
	}
	if(valor2 == 0){
		return NaN;
	}
	return valor1/valor2;
}

function multiplica(valor1, valor2){
	if(!esNumero(valor1) ||!esNumero(valor2)){
		return 0;
	}
	return valor1*valor2;
}

function esNumero(valor){
	return !isNaN(valor);
}


module.exports = {
	suma,
	resta,
	divide,
	multiplica
};