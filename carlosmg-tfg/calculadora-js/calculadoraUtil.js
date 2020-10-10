var CalculadoraUtil =
	{
		funcionSuma: function(valor1, valor2){
			if(!this.esNumero(valor1) ||!this.esNumero(valor2)){
				return 0;
			}
			//var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
			//if(isChrome){
			//	return parseInt(valor1)+parseInt(valor2) + 1;	
			//} else{
				return parseInt(valor1)+parseInt(valor2);
			//}
		},

		 funcionResta : function(valor1, valor2){
			if(!this.esNumero(valor1) ||!this.esNumero(valor2)){
				return 0;
			}return valor1-valor2;
		},

		funcionDividir : function (valor1, valor2){
			if(!this.esNumero(valor1) ||!this.esNumero(valor2)){
				return 0;
			}
			if(valor2 == 0){
				return NaN;
			}
			return valor1/valor2;
		},

		funcionMultiplica : function (valor1, valor2){
			if(!this.esNumero(valor1) ||!this.esNumero(valor2)){
				return 0;
			}return valor1*valor2;
		},
		esNumero : function(valor){
			return !isNaN(valor);
		}
	}