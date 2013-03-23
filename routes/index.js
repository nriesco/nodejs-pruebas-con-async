
/*
 * GET home page.
 */

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
		// if (!err) {
		// 	res.end(JSON.stringify( {result: true} ))
		// } else {
		// 	res.end(JSON.stringify( {result: false} ))
		// }
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
				{ email: '' }

			]
		}
	]

	var resultado = [];
	var successArray = [];

	data.forEach(function(value, index){
		var meetup = new Persona(value)
		meetup.validate(function (err) {
			if (err) {
				procesarDatos(false, err.errors)
				// console.log(err.errors)
			} else {
				procesarDatos(true, null)
			}
		})
	})


	function procesarDatos(exito, mensaje) {


		resultado.push({resultado: exito, mensaje: mensaje});

		var timeout = false;
		// verificar si ha pasado x segundos

		if (resultado.length == data.length || timeout) {

			// resultado.forEach(function(value, index) {
			for (var i = 0; i < resultado.length; i++) {

				// console.log(value.mensaje)
				// if (value.resultado == false && value.mensaje) {
				// console.log(resultado[i])
				console.log("iteracion " + i)
				if (resultado[i].resultado == false) {
					// console.log( resultado[i].mensaje )
					// res.send( JSON.stringify(resultado[i].mensaje) )
					res.send( JSON.stringify(resultado[i]) )



					// res.send( JSON.stringify(  value.mensaje ) )


					// console.log(value.mensaje)

					// for (var i = 0; i < value.mensaje.length; i++) {
					// 	// console.log("")
					// 	res.send( value.mensaje[i].value.type )
					// }

					// for (var temp in value.mensaje) {
					// 	// res.send( JSON.stringify( temp.type ) )
					// 	// res.send( temp.type )
						// res.send( JSON.stringify(value.mensaje.temp) )
					// }
					// res.send(  value.mensaje  )
				} else {

				}

				console.log(resultado.length)
				console.log(i)

				// if (index == resultado.length) {
				if (i == resultado.length-1) {

					// res.render('index', )
					res.end();
				}
			}

			// console.log( resultado[2].mensaje )
			// res.send( JSON.stringify(  resultado[2].mensaje ) )


			// res.end( JSON.stringify( resultado[1].mensaje ) )
		} 
	}



}

