const calculadora = require('../core/src/utils/calculadoraUtil');

describe('Función suma', () =>{
  test("Debería sumar dos números", () => {
    expect(calculadora.suma(15, 20)).toBe(35);
  });

  test("Si intentan sumar letras, debería devolver 0", () => {
    expect(calculadora.suma('A', 20)).toBe(0);
  });
  
  test.each([[4, 12, 16],[8, 5, 13],[14, 95, 109], [9, 12, 21]])
  ("La suma de %i y %i debería ser %i", (a, b, expected) => {
    expect(calculadora.suma(a, b)).toBe(expected);
  });
});

describe('Función resta', () =>{
  test("Debería restar dos números", () => {
    expect(calculadora.resta(15, 20)).toBe(-5);
  });
  test("Si intentan restar letras, debería devolver 0", () => {
    expect(calculadora.resta('A', 20)).toBe(0);
  });
});

describe('Función divide', () =>{
  test("Si intentan dividir letras, debería devolver 0", () => {
    expect(calculadora.divide('A', 20)).toBe(0);
  });

  test("Si se intenta dividir por 0, devuelve NaN", () => {
    expect(calculadora.divide(15, 0)).toBe(NaN);
  });
    
  test.each([[12, 4, 3],[40, 5, 8]])
  ("La división de %i por %i debería ser %i", (a, b, expected) => {
    expect(calculadora.divide(a, b)).toBe(expected);
  });
});

describe('Función multiplica', () =>{
  test("Si intentan multiplicar letras, debería devolver 0", () => {
    expect(calculadora.multiplica('A', 20)).toBe(0);
  });
  
  test.each([[4, 12, 48],[8, 5, 40],[14, 95, 109]])
  ("La multiplicación de %i y %i debería ser %i", (a, b, expected) => {
    expect(calculadora.multiplica(a, b)).toBe(expected);
  });
});

describe('Función esNumero', () =>{
  test("La función esNumero devuelve true si se le pasa un número como argumento", () => {
    expect(calculadora.esNumero(15)).toBe(true);
  });
  
  test("La función esNumero devuelve false si se le pasa una letra como argumento", () => {
    expect(calculadora.esNumero('A')).toBe(false);
  });
});


