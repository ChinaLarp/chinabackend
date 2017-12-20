var express = require('express');
var mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
var bodyParser=require('body-parser');
var http = require('http');
var server = http.createServer();
var url = require('url');
var fs = require('fs');
var request = require('request')
var userlist = {}
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
		clientTracking: true,
        server: server
      });
var port = process.env.PORT || 8080;
//MongoDB
//dburi='mongodb://weapp:weapp-dev@127.0.0.1:27017/weapp?connectTimeoutMS=300000'
dburi='mongodb://127.0.0.1:27017/local'
var databasepromise=mongoose.connect(dburi, {
  useMongoClient: true
  /* other options */
});
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
		var allowedOrigins = ['http://localhost:3000', 'https://chinabackend.bestlarp.com'];
	  var origin = req.headers.origin;
	  if(allowedOrigins.indexOf(origin) > -1){
	       res.setHeader('Access-Control-Allow-Origin', origin);
	  }
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
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
app.use('/user',require('./routes/user'));
app.use('/unionid',function(req,res){
	var weixinurl = "https://api.weixin.qq.com/sns/jscode2session?"
	var appid = req.query.appid
	var secret = req.query.secret
	var js_code= req.query.js_code
	var grant_type="authorization_code"
	request(weixinurl+'appid='+appid+'&secret='+secret+'&js_code='+js_code+'&grant_type='+grant_type, function (error, response, body) {
	 var result=JSON.parse(body)
	 res.send(result.openid);
	 //console.log(result.openid);
	 });
});
app.get('/',function(req,res){
	res.send('working');
});
app.use('/pic',function(req,res){
	 var img = fs.readFileSync('./pic'+ req.path);
     //res.writeHead(200, {'Content-Type': 'image/png' });
     res.end(img, 'binary');
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
		if (data.message=="join"){
		ws.id= data.table_id
		}
    wss.broadcast(message,data.table_id);
    });
});
server.on('request', app);
server.listen(port, function() {
    console.log('Listening on ' + server.address().port)
});
