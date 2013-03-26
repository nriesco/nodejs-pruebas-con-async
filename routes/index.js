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
		{
			nombre: Math.random()
		}
		,
		{
			nombre: 'nn'
		}
		,
		{
			nombre: 'Juanito',
			emails: [
				{ email: 'email de juanito' },
				{ email: 'ew' }, 
				{ email: 'kjkl' }

			]
		}
	]


	var validationProcessArray = [];
	var saveProcessArray = [];

	var validationErrorsArray = []
	var validateObjectGlobalCounter = 0;
	var saveObjectGlobalCounter = 0;


	// 
	function validateObject(inputData, callback) {
		// console.log("a punto de validar")
		// console.log(inputData)
		inputData.validate(function (err) {
			if (err) {

				// // por alguna razon esto no esta detectando bien los undefined
				// for (var propiedad in err.errors) {
				// 	if (typeof(err.errors.propiedad) !== undefined  &&  typeof(propiedad) !== undefined && propiedad != 'undefined`') {
				// 		console.log("propiedad es: ")
				// 		console.log(propiedad)
				// 		console.log(err.errors.propiedad)
				// 		console.log(err.errors[propiedad])
				// 		// err.errors[propiedad].errors
				// 		if (typeof(err.errors[propiedad].type) != undefined ) {
				// 			console.log("propiedad: ")
				// 			console.log(typeof(err.errors[propiedad].type))
				// 			console.log("propiedad.type")
				// 			console.log(propiedad.message)
				// 			console.log("a punto de hacer push de: err.errors[propiedad].type")
				// 			console.log(err.errors[propiedad].type)
				// 			console.log(err.errors)
				// 			validationErrorsArray.push(err.errors[propiedad].type)
				// 		}	
				// 	}
				// }
				console.log("ERR: 1")
				return callback(new Error('ERR: 1'))
			} else {
				console.log('OK: 1')
				return callback(false, 'validado ok')
			}
		})
	}


	// 
	function saveObject(inputData, callback) {
		// console.log("a punto de validar")
		// console.log(inputData)
		inputData.save(function (err) {
			if (err) {
				console.log("ERR: 2")
				return callback(new Error('ERR: 2'))
			} else {
				console.log('OK: 2')
				return callback(false, 'grabado ok')
			}
		})
	}
	console.log("inputData.length: " + inputData.length)
	for (var i = 0; i < inputData.length; i++) {
		validationProcessArray.push(
			function(callback) {
				validateObject(new Persona(inputData[validateObjectGlobalCounter++]), callback)
			}
		)
		saveProcessArray.push(
			function(callback) {
				saveObject(new Persona(inputData[saveObjectGlobalCounter++]), callback)
			}
		)
	}


	function validateData() {
		async.parallel(
		// async.series(
			validationProcessArray,
			function callback(err, results) {
				if (err) {
					console.log('Errors: ')
					console.log(validationErrorsArray)
					res.end( JSON.stringify( { result: false, message: "there were validation errors", dump: validationErrorsArray } ) )
				} else {
					console.log('Todo bien ahora hay que grabar!')
					console.log('Resultados: ')
					console.log(results)
					// res.end( JSON.stringify( { result: true, message: "datos guardados" } ) )
					saveData();
				}
			}
		)
	}

	function saveData() {
		async.parallel(
		// async.series(
			saveProcessArray,
			function callback(err, results) {
				if (err) {
					console.log('Errors: ')
					console.log(saveProcessArray)
					res.end( JSON.stringify( { result: false, message: "there were errors while saving", dump: saveProcessArray } ) )
				} else {
					console.log('Todo bien ahora hay que grabar!')
					console.log('Resultados: ')
					console.log(results)
					res.end( JSON.stringify( { result: true, message: "datos guardados" } ) )
				}
			}
		)
	}

	validateData();
	// res.end("fin")
	
}
