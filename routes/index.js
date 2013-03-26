var async = require('async');
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

// connection
var mongoose 	= require('mongoose')
	, db_lnk 	= 'mongodb://localhost/async'
	, db 		= mongoose.createConnection(db_lnk)

var personaSchema = require('../models/persona')
	, Persona = db.model('Persona', personaSchema)

/**
* 
*/
exports.getPersonas = function (req, res, next) {
	Persona.find( { $query: {}, $orderby: { _id : 1 } }, function (err, docs) {
		var campaignArray = []
		docs.forEach(function (meetup) {
			campaignArray.push(meetup)
		})
		res.end(JSON.stringify(campaignArray))
	})
}


exports.save = function (req, res, next) {

	Persona.remove({}, function (err) {
		if (err) {
			res.end(JSON.stringify( {result: false} ))
		}
	})
	
	// var data = req.body[0]
	var inputData = [
		// {
		// 	nombre: Math.random()
		// }
		// ,
		// {
		// 	nombre: 'n'
		// }
		// ,
		{
			nombre: 'Juanito',
			emails: [
				{ email: 'email de juanito' },
				{ email: 'e' }, 
				{ email: 'kjkl' }

			]
		}
	]



	// var meetup = new Persona(inputData[1])
	// meetup.validate(function(err) {
	// 	if (err) {
	// 		console.log("ERRROR")

	// 	} else {
	// 		console.log("OK DOKEY")
	// 	}
	// })


	var parallelProcessArray = [];


	// function grabarObjeto(meetup, callback) {

	// }

	var arregloErrores = []
	var contadorGlobal = 0;



	// if (resultadoArray[i].resultado == false) {

	//   for (var keyTemp in resultadoArray[i].mensaje) {

	//     if ((typeof resultadoArray[i].mensaje[keyTemp].errors) != 'undefined') {
	//       console.log('multiples erroes')
	//       console.log(resultadoArray[i].mensaje[keyTemp].errors)
	//       console.log('ahora...')
	//       outputArray.push("Múltiples errores")
	//     } else {
	//       console.log("keyTemp: " + keyTemp);
	//       console.log(resultadoArray[i].mensaje[keyTemp])
	//       outputArray.push( resultadoArray[i].mensaje[keyTemp].type )
	//     }
	    
	//   }


	// 
	function grabarObjeto(inputData, callback) {
		console.log("a punto de validar")
		console.log(inputData)
		inputData.validate(function (err) {
			if (err) {
				for (var propiedad in err.errors) {
					// console.log(propiedad)
					// console.log(err.errors[propiedad].errors)
					// if (typeof(propiedad) !== undefined) {
					// if (typeof(propiedad) !== undefined  &&  propiedad != undefined) {
					if (typeof(err.errors.propiedad) !== undefined  &&  typeof(propiedad) !== undefined && propiedad != 'undefined') {
						console.log("propiedad es: ")
						console.log(propiedad)
						console.log(err.errors.propiedad)
						console.log(err.errors[propiedad])
						// err.errors[propiedad].errors
						if (typeof(err.errors[propiedad].type) != undefined ) {
							console.log("propiedad: ")
							console.log(typeof(err.errors[propiedad].type))
							console.log("propiedad.type")
							console.log(propiedad.message)
							console.log("a punto de hacer push de: err.errors[propiedad].type")
							console.log(err.errors[propiedad].type)
							console.log(err.errors)
							arregloErrores.push(err.errors[propiedad].type)

						}
						
					}
				}

				// console.log("inicio err")
				// // console.log(err.errors)
				// console.log(typeof(err.errors))
				// for (var propiedad in err.errors) {
				// 	console.log(propiedad)
				// 	console.log(err.errors[propiedad].errors)
				// }
				// // console.log(err.errors.properties)
				// console.log("fin err")
				// if (err.errors) {
				// 	// caso con problemas
				// 	console.log('ERR: caso con problemas')
				// } else {
				// 	//
				// 	console.log('ERR: caso manejado')
				// 	arregloErrores.push(err.errors)
				// }
				return callback(new Error('ERR: error uno'))
			} else {
				console.log('OK: caso ok')
				return callback(false, 'grabado ok')
			}
		})
	}

	console.log("inputData.length: " + inputData.length)
	for (var i = 0; i < inputData.length; i++) {
		// console.log(i)
		// var meetup = new Persona(inputData[i])
		// console.log("inputData[" + i + "]: ")
		// console.log(inputData[i])

		parallelProcessArray.push(
			function(callback) {
				grabarObjeto(new Persona(inputData[contadorGlobal++]), callback)
			}
		)
	}

	// async.parallel(
	async.series(
		parallelProcessArray,
		// optional callback
		function callback(err, results) {
			if (err) {
				console.log('Hubo un error');
				console.log(arregloErrores)
			} else {
				console.log('Todo bien ahora hay que grabar!')
				console.log(results)
			}
		}
	);

	res.end("fin")
	
}













exports.saveDEP = function (req, res, next) {

	Persona.remove({}, function (err) {
		if (err) {
			res.end(JSON.stringify( {result: false} ))
		}
	})
	
	// var data = req.body[0]
	var data = [
		{
			nombre: Math.random()
		}
		// ,
		// {
		// 	nombre: 'n'
		// }
		// ,
		// {
		// 	nombre: 'Juanito',
		// 	emails: [
		// 		{ email: 'email de juanito' },
		// 		{ email: 'e' }, 
		// 		{ email: 'kk' }

		// 	]
		// }
	]

	var resultadoArray1 = [];
	var resultadoArray2 = [];
	var successArray = [];
	var outputArray = [];
	var timeout = false;

	var saveTimeout = setTimeout(setTimeoutTrue, 1 * 1); // in miliseconds
	function setTimeoutTrue() {
		timeout = true;
	}


	data.forEach(obtainPerson);

	function obtainPerson(value, index){

		var meetup = new Persona(value)
		meetup.validate(function (err) {
			if (err) {
				procesarDatos(false, err.errors)
				// console.log(err.errors)
			} else {
				procesarDatos(true, null)
			}
		})
	}

	function procesarDatos(exito, mensaje) {

		resultadoArray1.push({resultado: exito, mensaje: mensaje});
		var sinErroresDeValidacion = true;

		console.log("timeout: " + saveTimeout + " " + timeout);
		// verificar si ha pasado x segundos

		if (resultadoArray1.length == data.length || timeout) {

			for (var i = 0; i < resultadoArray1.length; i++) {

				// if (value.resultado == false && value.mensaje) {
				console.log("iteracion " + i)
				if (resultadoArray1[i].resultado == false) {

					sinErroresDeValidacion = false;

					var mensajeCorregido = ''

					for (var keyTemp in resultadoArray1[i].mensaje) {

						if ((typeof resultadoArray1[i].mensaje[keyTemp].errors) != 'undefined') {
							console.log('multiples erroes')
							console.log(resultadoArray1[i].mensaje[keyTemp].errors)
							console.log('ahora...')
							outputArray.push("Múltiples errores")
							mensajeCorregido = "múltiples errores"

						} else {
							console.log("keyTemp: " + keyTemp);
							console.log(resultadoArray1[i].mensaje[keyTemp])
							outputArray.push( resultadoArray1[i].mensaje[keyTemp].type )
							mensajeCorregido = resultadoArray1[i].mensaje[keyTemp].type
						}
						
					}
					console.log('fin iteracion')

					// for (var j = 0; j < resultado[i].mensaje.properties.length; j++) {
					// 	alert(' name=' + resultado[i].mensaje.properties[j].name 
					// 	+ ' value=' + resultado[i].mensaje.properties[j].value);
					// }

					resultadoArray2.push({esValido: false, mensaje: mensajeCorregido});

				} else {
					resultadoArray2.push({esValido: true, mensaje: "sin errores"});
				}

				if (i == resultadoArray1.length-1) {
					// res.render('index', )
					// res.end( JSON.stringify({aaa: resultadoArray1, resultado: false, mensajes: outputArray}) );
					if (sinErroresDeValidacion) {

						saveValidData()

					} else {
						res.end( JSON.stringify({resultado: false, datos: resultadoArray2}) );
					}
					
				}
			}
		} 
	}



	var algo = []


	function saveValidData() {
		
		// data.forEach(obtainPerson);
		// var bloque = data.forEach(obtainPerson);
		data.forEach(algo.push(obtainPerson))



		async.parallel(algo,
		// optional callback
		function(err, results){
			// the results array will equal ['one','two'] even though
			// the second function had a shorter timeout.
			console.log(results)
		});

		// @todo: cambiar a algo asi:
		// var itemsAEjecutar = [];
		// data.forEach(function(value, index) {
		// 	itemsAEjecutar.push()
		// })

		function obtainPerson(value, index){

			var meetup = new Persona(value)
			meetup.save(function (err) {
				
				// esto esta mal, pues habran procesos en background cuando esto aparezca
				// aca hay que ocupar un parallel o sync para esperar que todos los save 
				// hayan terminado (y con exito)
				res.end( JSON.stringify({resultado: true}) );
			})
		}		
	}
	
}

