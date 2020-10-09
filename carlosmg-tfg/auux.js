//Funcion a testear
function funcion(condicion, callbackTrue, callbackFalse){
 if(condicion){
 	callbackTrue();
 } else{
 	callbackFalse();
 } 
}

describe('Tests sobre mi funcion', function() {
  it('Se llama a la funcion 1 con la condicion a true', function() {
  	var dummy;
  	var condicion = true;
    var spyCallback = sinon.spy();
    funcion(condicion, spyCallback, dummy);
	sinon.assert.called(spyCallback);
  });
   it('Se llama a la funcion 2 con la condicion a false', function() {
  	var dummy;
  	var condicion = true;
    var spyCallback = sinon.spy();
    funcion(condicion, dummy, spyCallback);
	sinon.assert.called(spyCallback);
  });
});