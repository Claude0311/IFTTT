var mongoose = require('./database'),
    Schema = mongoose.Schema;

var Air_Schema = new Schema({
    airOn: Number,
	airMode: Number,
	temperature: Number,
	fanON: Number,
	ID: String
})

module.exports = mongoose.model('air',Air_Schema);