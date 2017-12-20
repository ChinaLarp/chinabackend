var restful = require('node-restful');
var mongoose = restful.mongoose;



var tableSchema = new mongoose.Schema({
	type:String,//what type of data eg. news, comments, productlist, etc.
	title:String,//what type of data eg. news, comments, productlist, etc.
	contentid: String, // identifyer
	content:[mongoose.Schema.Types.Mixed], //content can be array of any format (directory, array, string,etc.)
	date:{ type: Date, default: Date.now },
	email: String,
	password: String,
	username: String,
	lastname: String,
	message: String
});



module.exports = restful.model('Web',tableSchema);
