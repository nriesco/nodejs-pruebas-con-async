
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
	var data = [
		{
			nombre: Math.random()
		},
		{
			nombre: 'n'
		},
		{
			nombre: 'Juanito',
			emails: [
				{ email: 'email de juanito' },
				{ email: 'e' }, 
				{ email: 'kk' }

			]
		}
	]

	var resultadoArray = [];
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

		resultadoArray.push({resultado: exito, mensaje: mensaje});

		console.log("timeout: " + saveTimeout + " " + timeout);
		// verificar si ha pasado x segundos

		if (resultadoArray.length == data.length || timeout) {

			for (var i = 0; i < resultadoArray.length; i++) {

				// if (value.resultado == false && value.mensaje) {
				console.log("iteracion " + i)
				if (resultadoArray[i].resultado == false) {

					for (var keyTemp in resultadoArray[i].mensaje) {

						if ((typeof resultadoArray[i].mensaje[keyTemp].errors) != 'undefined') {
							console.log('multiples erroes')
							console.log(resultadoArray[i].mensaje[keyTemp].errors)
							console.log('ahora...')
							outputArray.push("Múltiples errores")
						} else {
							console.log("keyTemp: " + keyTemp);
							console.log(resultadoArray[i].mensaje[keyTemp])
							outputArray.push( resultadoArray[i].mensaje[keyTemp].type )
						}
						
					}
					console.log('fin iteracion')

					// for (var j = 0; j < resultado[i].mensaje.properties.length; j++) {
					// 	alert(' name=' + resultado[i].mensaje.properties[j].name 
					// 	+ ' value=' + resultado[i].mensaje.properties[j].value);
					// }

				} else {

				}

				if (i == resultadoArray.length-1) {
					// res.render('index', )
					res.end( JSON.stringify({resultado: false, mensajes: outputArray}) );
				}
			}
		} 
	}
}

