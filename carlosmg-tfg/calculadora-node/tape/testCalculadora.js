var test = require('tape');
var calculadora = require('../core/src/utils/calculadoraUtil');

test("Debería sumar dos números", function(t) {
    t.plan(1);
    var resultado = calculadora.suma(15, 20);
    t.equal(resultado, 35);
});


test("Debería restar dos números", function(t) {
    var resultado = calculadora.resta(15, 20);
    t.equal(resultado, -5);
    t.end();
});

test("Si intentan sumar letras, debería devolver 0", function(t) {
    var resultado = calculadora.suma('A', 20);
    t.equal(resultado, 0);
    t.end();
});

test("Si se intenta dividir por 0, devuelve NaN", function(t) {
    var resultado = calculadora.divide(15, 0);
    t.equal(resultado, NaN);
    t.end();
});
  

test("Si intentan sumar letras, debería devolver una concatenación", function(t) {
    var resultado = calculadora.suma('A', 20);
    t.equal(resultado, 'A20');
    t.end();
});