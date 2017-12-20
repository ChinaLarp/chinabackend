var express =require('express');
//import commonValidations from '../shared/validations/signup';
//import bcrypt from 'bcrypt';
var isEmpty  =require('lodash').isEmpty;

var web =require('../models/web');

let router = express.Router();

function validateInput(data) {
  let errors = {}
  return web.find({ type:'user',email: data.email }).exec().then(
    user => {
      if (user.length!=0) {
          if (user[0].email === data.email) {
            errors.email = 'There is user with such email';
          }
        }
        console.log(errors)
        console.log(isEmpty(errors))
    return {
      errors,
      isValid: isEmpty(errors)
    };
  })

}

router.get('/:identifier', (req, res) => {
	web.find({ type:'user', email: req.params.identifier }).select({email:1,username:1}).exec().then(
    user => {
      console.log(user.length)
      if (user.length!=0) {
          res.json({ user })
	}else{
		res.status(401).json({ errors: { form: 'No such user' } });
	}})

});


router.post('/', (req, res) => {
  validateInput(req.body).then(({ errors, isValid }) => {
    if (isValid) {
      console.log("valid")
      //const { email, password, firstname, lastname } = req.body;
      //const password_digest = password;
    var newuser = new web({
      type: 'user',
      email: req.body.email,
      password: req.body.password,
      username: req.body.username
    });
    newuser.save(function (err, newuser) {
        if (err) {
          res.status(500).json({ error: err })
        }else{
          res.json({ success: true })
        };
      });
        //.then(user => res.json({ success: true }))
        //.catch(err => res.status(500).json({ error: err }));

    } else {
      console.log("nonvalid")

      res.status(400).json(errors);
    }
  });
})



module.exports = router;
