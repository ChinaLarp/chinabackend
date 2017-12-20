var express  = require('express');
var web  = require('../models/web');
//var bcrypt  = require('bcrypt');
var jwt  = require('jsonwebtoken');
var config  = require('../config');
let router = express.Router();
router.post('/', (req, res) => {
  const { email, password } = req.body;
console.log(email)
  var query = web.find({ type:'user',email: email });
  var promise=query.exec()
  console.log(promise)
  promise.then(
    user => {
		console.log(user)
  if (user.length!=0) {
      if (password==user[0].password) {
        const token = jwt.sign({
          id: user[0]._id,
          email: user[0].email,
          username: user[0].username
        }, config.jwtSecret);
        res.json({ token });
      } else {
        res.status(401).json({ errors: { form: 'Invalid Credentials' } });
      }
  } else {
    res.status(401).json({ errors: { form: 'Invalid Credentials' } });
  }
})
});


module.exports = router;
