function suma(){
	pintaValor(CalculadoraUtil.funcionSuma($('#txt1').val(), $('#txt2').val()));
}
function resta(){
	pintaValor(CalculadoraUtil.funcionResta($('#txt1').val(), $('#txt2').val()));
}

function divide(){
	pintaValor(CalculadoraUtil.funcionDividir($('#txt1').val(), $('#txt2').val()));
}

function multiplica(){
	pintaValor(CalculadoraUtil.funcionMultiplica($('#txt1').val(), $('#txt2').val()));
}

function pintaValor(valor){
	$('#result').val(valor);
}