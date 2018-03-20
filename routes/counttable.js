var express  = require('express');
var app  = require('../models/app');
//var bcrypt  = require('bcrypt');
let router = express.Router();
router.get('/', (req, res) => {
  console.log(req.query)
  var { tableid } = req.query
  app.count({type:'user', tableid: tableid }).exec().then(count=>{
        res.json(count)
      })

})



module.exports = router;
