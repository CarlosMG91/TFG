describe("Player", function() {
  var calculadora;

  beforeEach(function() {
    player = new CalculadoraUtil();
  });

  it("Debería sumar dos números", function() {
    var resultado = calculadora.funcionSuma(15, 20);
    expect(resultado).toEqual(35);
  });
});
