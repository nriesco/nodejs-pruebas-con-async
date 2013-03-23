var Schema = require('mongoose').Schema

// email
var emailSchema = new Schema({
	email				: { type: String },
	tipo 				: { type: String }
})
var Email = module.exports = emailSchema

// person

var personSchema = new Schema({
	nombre 				: { type: String }
	, emails 			: [Email]
})
var Person = module.exports = personSchema

// constraints
// person
personSchema.path('nombre').validate(function (value) {
	if (typeof(value) === 'undefined') {
		return false
	}
	
	if (value.length >= 2) {
		return true
	} else {
		return false
	}
}, 'Nombre debe ser de al menos 2 caracteres!'  )

emailSchema.path('email').validate(function (value) {
	if (typeof(value) === 'undefined') {
		return false
	}
	
	if (value.length >= 2) {
		return true
	} else {
		return false
	}
}, 'email debe ser de al menos 2 caracteres!'  )
