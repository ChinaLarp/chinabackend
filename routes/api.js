var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var md5= require('md5')

var App = require('../models/app');
var Web = require('../models/web');
var Closet = require('../models/closet');


App.methods(['get','put','post','delete']);
App.before('delete',function(req, res, next){
  if(md5(req.params.id+"xiaomaomi")===req.body.signature){
    next()
  }else{
  res.status(401).json({ error:'Signature error'  });
}
})
App.before('post',function(req, res, next){
  if(md5("xiaomaomi")===req.body.signature){
    next()
  }else{
  res.status(401).json({ error:'Signature error'});
  }
})
App.after('post',function(req, res, next){
    if("user"===req.body.type){
      var tableid=req.body.tableid
      var objectid=res.locals.bundle._id
      App.findOne({type:"openid", id:req.body.usernickname}).exec(function (err, openid) {App.findByIdAndUpdate(objectid,{ $set: { "reference": openid._id } }).exec()})
      //console.log(reference)
      App.findOneAndUpdate({type:"table", tableid:tableid},{ $push: { "userreferences": objectid } }).exec()
    }else if("purchase"===req.body.type){
    	  var openid = req.body.openid
    	  var gameid = req.body.gameid
        var objectid = res.locals.bundle._id
        App.findOneAndUpdate({type:"game", id:gameid},{ $push: { "purchasehistory": objectid } }).exec()
        App.findOneAndUpdate({type:"openid", id:openid},{ $push: { "purchasehistory": objectid } }).exec()
    }
    next()
})
App.before('put',function(req, res, next){
  if(md5(req.params.id+"xiaomaomi")===req.body.signature){
    next()
  }else{
  res.status(401).json({ error:'Signature error'  });
}
})
App.register(router,'/app');
Web.methods(['get','put','post','delete']);
Web.before('delete',function(req, res, next){
  if(md5(req.params.id+"xiaomaomi")===req.body.signature){
    next()
  }else{
  res.status(401).json({ error:'Signature error'  });
}
})
Web.before('post',function(req, res, next){
  if(md5("xiaomaomi")===req.body.signature){
    next()
  }else{
  res.status(401).json({ error:'Signature error'});
}
})
Web.before('put',function(req, res, next){
  if(md5(req.params.id+"xiaomaomi")===req.body.signature){
    next()
  }else{
  res.status(401).json({ error:'Signature error'  });
}
})
Web.after('post', function(req, res, next) {
  console.log("got")
  if (req.body.type=="contact"){
  var smtpTransport  = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
      user: 'edwang09@hotmail.com',
      pass: 'wjnshi250'
    }
  });
  var mailOptions = {
    from: 'edwang09@hotmail.com',
    to: 'edwang09@hotmail.com',
    subject: "new contact form submitted",
    text: req.body.message
  };
  //res.send("error");
  smtpTransport.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ');
    }
  });
  smtpTransport.close()
}
  next()
});

Web.register(router,'/web');
Closet.methods(['get','put','post','delete']);
Closet.after('post', function(req, res, next) {
  const unionid = req.body.owner
  const objectid=res.locals.bundle._id
  console.log(unionid)
  if (req.body.type=="item"){
    Closet.findOneAndUpdate({type:"user", id:unionid},{ $push: { "inventory": objectid } }).exec()
  }
  next()
});
Closet.register(router,'/closet');


module.exports = router;
