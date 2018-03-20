var express = require('express');
var mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
var bodyParser=require('body-parser');
var http = require('http');
var server = http.createServer();
var url = require('url');
var fs = require('fs');
var md5= require('md5')
var appdb  = require('./models/app');
var request = require('request')
var timestamp = require('unix-timestamp')
var parseString = require('xml2js').parseString
var userlist = {}
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
		clientTracking: true,
        server: server
      });
var port = process.env.PORT || 8080;
//MongoDB
dburi='mongodb://quanminzhentanshe:quanminzhentanshe4785459Efksice41321@127.0.0.1:27017/weapp?connectTimeoutMS=300000'
//dburi='mongodb://127.0.0.1:27017/local'
var databasepromise=mongoose.connect(dburi, {
  useMongoClient: true
  /* other options */
});
const appid = "wxf0487d45228f02d3";
const mch_id = "1492985202"
const mch_key = "6e11af317a7a85a14b3387d5c6c71d3a"
databasepromise.then(
	(db) => {console.log(db._readyState) },
  err => {console.log(err)}
);
//Express
var app =express();
app.use(fileUpload());
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    // Website you wish to allow to connect
		var allowedOrigins = ['http://localhost:3000', 'https://bestlarp.com'];
	  var origin = req.headers.origin;
	  if(allowedOrigins.indexOf(origin) > -1){
	       res.setHeader('Access-Control-Allow-Origin', origin);
	  }
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Requested-With, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

//Routes
app.use('/api',require('./routes/api'));
app.post('/uploadimage',function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
		//console.log(req.files)
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let image = req.files.image;
	let filetype = req.files.image.mimetype=='image/jpeg'?'.jpg':'.png'
	let filename = req.files.image.name

	//console.log('C:/Users/edwan/OneDrive/'+filename)
  // Use the mv() method to place the file somewhere on your server
  image.mv('./pic/'+filename, function(err) {
    if (err)
      return res.status(500).send(err);
    res.send('File uploaded!');
  });
});
app.use('/auth',require('./routes/auth'));
app.use('/wxauth',require('./routes/wxauth'));
app.use('/user',require('./routes/user'));
app.use('/unionid',function(req,res){
	const weixinurl = "https://api.weixin.qq.com/sns/jscode2session?"
	var appid = req.query.appid
	var secret = req.query.secret
	var js_code= req.query.js_code
	var grant_type="authorization_code"
	request(weixinurl+'appid='+appid+'&secret='+secret+'&js_code='+js_code+'&grant_type='+grant_type, function (error, response, body) {
	 var result=JSON.parse(body)
	 console.log(result)
	 var openidpromise = appdb.find({ type:'openid',id: result.openid }).exec()
	 openidpromise.then(openid=>{
		 if (openid.length==1) {
			 var newlogin = openid[0].login.concat([new Date()])
				 console.log(newlogin)
			 //Changed
			 if (newlogin.length>20){
				 console.log("slice")
				 newlogin = newlogin.slice(newlogin.length-20)
			 }
			 	appdb.findOneAndUpdate({ id: result.openid }, { login: newlogin }).exec()
		 } else {
			 var newopenid = new appdb({
				 type: 'openid',
				 id: result.openid
			 });
			 newopenid.save(function (err, newuser) {
			 });
		 }
	 })
	 res.send(result.openid);
	 //console.log(result.openid);
	 });
});
app.use('/webunionid',function(req,res){
	const openurl = "https://api.weixin.qq.com/sns/oauth2/access_token?"
	console.log(req.query)
	var appid = req.query.appid
	var secret = req.query.secret
	var code= req.query.code
	var grant_type="authorization_code"
	request(openurl+'appid='+appid+'&secret='+secret+'&code='+code+'&grant_type='+grant_type, function (error, response, body) {
	 var result=JSON.parse(body)
	 res.send(body);
	 console.log(result)
	 })
	 //console.log(result.openid);
});
app.use('/webuserinfo',function(req,res){
	const openurl = "https://api.weixin.qq.com/sns/userinfo?"
	console.log(req.query)
	var openid = req.query.openid
	var access_token= req.query.access_token
	request(openurl+'access_token='+access_token+'&openid='+openid, function (error, response, body) {
	 var result=JSON.parse(body)
	 res.send(body);
	 console.log(result)
	 })
	 //console.log(result.openid);
});
app.post('/unifiedorder',function(req,res){
	const orderurl = "https://api.mch.weixin.qq.com/pay/unifiedorder"
	var headers = {'Content-Type': 'application/xml'}
	var trade_no = timestamp.now()*1000000+Math.floor(Math.random() * Math.floor(1000))
	if (!req.body.openid) return res.status(400).send('No openid.')
	var openid = req.body.openid
	var total_fee = req.body.total_fee
	console.log(req.body.total_fee)
	var signstring="appid=wxf0487d45228f02d3&body=test&device_info=app&mch_id=1492985202&nonce_str=123&notify_url=https://bestlarp.com&openid="+openid+"&out_trade_no="+trade_no+"&total_fee="+total_fee+"&trade_type=JSAPI&key="+mch_key
	var signature = md5(signstring).toUpperCase()
	var xmlbody = "<xml><appid>wxf0487d45228f02d3</appid>" +
   "<body>test</body>"+
   "<device_info>app</device_info>"+
   "<mch_id>1492985202</mch_id>"+
   "<nonce_str>123</nonce_str>"+
   "<openid>"+openid+"</openid>"+
	 "<notify_url>https://bestlarp.com</notify_url>"+
   "<out_trade_no>"+trade_no+"</out_trade_no>"+
   "<total_fee>"+ total_fee +"</total_fee>"+
   "<trade_type>JSAPI</trade_type>"+
   "<sign>"+signature+"</sign></xml>"
		var options={
			method:"POST",
			url:orderurl,
			body:xmlbody,
			headers:headers}
			request(options,function (error, response, body) {
				parseString(body, function (err, result) {
				    res.send(result);
				});
		 })
});
app.use('/counttable',require('./routes/counttable'));
app.post('/unlock',function(req,res){
	var openid = req.body.openid
	var gameid = req.body.gameid
	var openidpromise = appdb.find({ type:'openid',id: openid }).exec()
	openidpromise.then(thisopenid=>{
		console.log(thisopenid[0].purchase)
		if (thisopenid.length==1) {
			var newpurchase = thisopenid[0].purchase.concat([gameid])
			 appdb.findOneAndUpdate({ id: openid }, { purchase: newpurchase }).exec()
			 res.send("done")
		}else{
				res.send("error")
		}
	})
});
app.get('/',function(req,res){
	res.send('No content please close window.');
});
app.use('/pic',function(req,res){
	 var img = fs.readFileSync('./pic'+ req.path);
     //res.writeHead(200, {'Content-Type': 'image/png' });
     res.end(img, 'binary');
});
app.post('/clue',function(req,res){
	//console.log(req.body)
	var locationid=parseInt(req.body.locationid)
	appdb.findById(req.body.table_id, function (err, doc) {
			console.log(doc.cluestatus)
		 if (doc.cluestatus[locationid].includes(true)){
				var indexes = [], i;
				for(i = 0; i < doc.cluestatus[locationid].length; i++){
						if (doc.cluestatus[locationid][i] === true){
							indexes.push(i);
						}
				}
				var clueid = indexes[Math.floor(Math.random() * indexes.length)];
				newstatus = doc.cluestatus.map((loc, sidx) => {
		      if (locationid !== sidx) return loc;
		      return loc.map((clue, ssidx) => {
			      if (clueid !== ssidx) return clue;
			      return false
			    });
		    });
				doc.update({cluestatus:newstatus}).exec()
			  res.send({clueid:clueid});
		 }else{
		   res.send({clueid:-1});
		 }
	})
});

wss.broadcast = function broadcast(message,table_id) {
  wss.clients.forEach(function each(client) {
	  //var condition = { message:"Your table_id is "+ client.id + ", but target table_id id " + table_id}
	  //client.send(JSON.stringify(condition));
	  if (client.id === table_id) {
			client.send(message);
			console.log("send to "+ client.id)
		  }
  });
};
/* app.listen(3000);
console.log('API is running on 3000')*/

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
		var data = JSON.parse(message)
		console.log(data)
		if (data.message=="join"){
		ws.id= data.table_id
		}else if (data.message=="ping"){
			ws.send(message)
		}else if(data.message==="actionpoint"){
			console.log("setactionpoint")
			var getusers = appdb.find({ type:'user',tableid: data.tableid }).exec()
			getusers.then(users=>{
				users.map((user)=>{
					appdb.findByIdAndUpdate(user._id, { actionpoint:user.actionpoint+data.content }).exec()
				})
				wss.broadcast(message,data.table_id);
			})
		}else{
	    wss.broadcast(message,data.table_id);
		}
    });
});
server.on('request', app);
server.listen(port, function() {
    console.log('Listening on ' + server.address().port)
});
