'use strict'

var assert = require('assert');
var calculadora = require('../core/src/utils/calculadoraUtil');

describe("Calculadora", function() {
  it("Debería sumar dos números", function() {
    var resultado = calculadora.suma(15, 20);
    assert.equal(resultado, 35);
  });


  it("Debería restar dos números", function() {
    var resultado = calculadora.resta(15, 20);
   	assert.equal(resultado, -5);
  });

  it("Si intentan sumar letras, debería devolver 0", function() {
    var resultado = calculadora.suma('A', 20);
    assert.equal(resultado, 0);
  });

  it("Si se intenta dividir por 0, devuelve NaN", function() {
    var resultado = calculadora.divide(15, 0);
    assert.equal(resultado, 'NaN');
  });
});
