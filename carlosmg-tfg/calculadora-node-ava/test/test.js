'use strict'
import test from 'ava';

var calculadora = require('../core/src/utils/calculadoraUtil');

test('Debería sumar dos números', t =>{
  var resultado = calculadora.suma(15, 20)
  t.is(resultado, 35);
}); 

test('Debería restar dos números', t =>{
  var resultado = calculadora.resta(15, 20)
  t.is(resultado, -5);
}); 

test('Si intentan sumar letras, debería devolver 0', t =>{
  var resultado = calculadora.suma('A', 20)
  t.is(resultado, 0);
}); 

test("Si se intenta dividir por 0, devuelve NaN",  t =>{
  var resultado = calculadora.divide(15, 0);
  t.is(resultado, NaN);
});



test('Ejemplo ejecución errónea deepEqual', t=>{
  const estudiante1 ={
    nombre : "Carlos", 
    apellido: "Múgica", 
    telefono: "666999666",
    direccion: {
      calle : "Guillermina Medrano",
      ciudad: "Rivas",
      provincia: "Madrid"
    }
  };

  const estudiante2 ={
    nombre : "Carlos", 
    apellido: "Múgica", 
    telefono: "999666999",
    direccion: {
      calle : "Océano Atlántico",
      ciudad: "Coslada",
      provincia: "Madrid"
    }
  }
  t.deepEqual(estudiante1, estudiante2);
});

test("Este test es erroneo",  t =>{
  var resultado = calculadora.suma(15, 20)
  t.is(resultado, 99);
});
