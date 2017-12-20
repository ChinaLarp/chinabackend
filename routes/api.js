var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var md5= require('md5')

var App = require('../models/app');
var Web = require('../models/web');


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


module.exports = router;
