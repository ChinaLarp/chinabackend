var restful = require('node-restful');
var mongoose = restful.mongoose;



var userSchema = new mongoose.Schema({
	type: String,
	date:{ type: Date, default: Date.now },
	id: String,
	price: Number,
	//user
	myfav:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Closet' }],
	today:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Closet' }],
	inventory:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Closet' }],

  gameid: String,
  characterid: Number,
	usernickname: String,
	my:[mongoose.Schema.Types.Mixed],
  broadcast:String,
	vote:Number,
	actionpoint:Number,
	//item
	image:String,
	itemtype: String,
	owner: String,
	tag :[mongoose.Schema.Types.Mixed],
  season:String,
  color: String,
  occasion: String,
	savetoday:Number,

	vote:[mongoose.Schema.Types.Mixed],
  roundnumber:Number,
	cluestatus:[mongoose.Schema.Types.Mixed],
	//set
	item:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Closet' }],
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



module.exports = restful.model('Closet',userSchema);
