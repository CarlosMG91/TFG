describe("Calculadora", function() {
  var calculadora;

  beforeEach(function() {
    calculadora =  CalculadoraUtil;
  });

  it("Debería sumar dos números", function() {
    var resultado = calculadora.funcionSuma(15, 20);
    expect(resultado).toEqual(35);
  });


  it("Debería restar dos números", function() {
    var resultado = calculadora.funcionResta(15, 20);
    expect(resultado).toEqual(-5);
  });

  it("Si intentan sumar letras, debería devolver 0", function() {
    var resultado = calculadora.funcionSuma('A', 20);
    expect(resultado).toEqual(0);
  });

  it("Si se intenta dividir por 0, devuelve NaN", function() {
    var resultado = calculadora.funcionDividir(15, 0);
    expect(resultado).toEqual('NaN');
  });
});
