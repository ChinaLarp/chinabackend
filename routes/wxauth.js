var express  = require('express');
var web  = require('../models/web');
//var bcrypt  = require('bcrypt');
var jwt  = require('jsonwebtoken');
var config  = require('../config');
let router = express.Router();
router.post('/', (req, res) => {
  const { openid, username } = req.body;
console.log(openid)
  var promise = web.find({ type:'user',email: openid }).exec()
  promise.then(
    user => {
		console.log(user)
  if (user.length!=0) {
        const token = jwt.sign({
          id: user[0]._id,
          email: user[0].email,
          username:username
        }, config.jwtSecret);
        res.json({ token });
  } else {
    var newuser = new web({
      type: 'user',
      email: openid,
      username:username
    });
    newuser.save(function (err, newuser) {
        if (err) {
          res.status(500).json({ error: err })
        }else{
          const token = jwt.sign({
            id: newuser._id,
            email: newuser.email,
            username:username
          }, config.jwtSecret);
          res.json({ token });
        };
      });
  }
})
});


module.exports = router;
