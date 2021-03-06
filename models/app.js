var restful = require('node-restful');
var mongoose = restful.mongoose;



var userSchema = new mongoose.Schema({
	type: String,
	author: String,
	price: Number,
	//user
	tableid: String,
  gameid: String,
  characterid: Number,
	usernickname: String,
	acquiredclue:[mongoose.Schema.Types.Mixed],
  broadcast:String,
	vote:Number,
	actionpoint:Number,
	//table
	hostid:String,
	gamename: String,
	passcode :Number,
	vote:[mongoose.Schema.Types.Mixed],
  roundnumber:Number,
	cluestatus:[mongoose.Schema.Types.Mixed],
	//character
	gamename: String,
	charactername :String,
	banlocation :Number,
	characterdescription:String,
	charactersex:String,
	characterplot:[mongoose.Schema.Types.Mixed],
	characterinfo:[mongoose.Schema.Types.Mixed],
	characterabilityid:String,
	token:String,
	//game
	name: String,
	id:String,
	iconurl:String,
	coverurl:String,
	playernumber :Number,
	malenumber :Number,
	femalenumber: Number,
	cluemethod:String,
	category:String,
	mapurl:String,
	instruction:[mongoose.Schema.Types.Mixed],
	descripion:String,
	detailDescription:[mongoose.Schema.Types.Mixed],
	actionpoint:Number,
	cluelocation:[mongoose.Schema.Types.Mixed],
	mainplot:[mongoose.Schema.Types.Mixed],
	characterlist:[mongoose.Schema.Types.Mixed],
	cluestatus:[mongoose.Schema.Types.Mixed],
	//general
	date:{ type: Date, default: Date.now },
	//openid
	purchase:[mongoose.Schema.Types.Mixed],
	login:[mongoose.Schema.Types.Mixed],

	//All references
	userreferences:[{ type: mongoose.Schema.Types.ObjectId, ref: 'App' }],
	purchasehistory:[{ type: mongoose.Schema.Types.ObjectId, ref: 'App' }],
	reference:{ type: mongoose.Schema.Types.ObjectId, ref: 'App' }
});



module.exports = restful.model('App',userSchema);
