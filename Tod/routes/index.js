const express = require('express');
var router = express.Router();
const UserFct = require('../models/users.js');

router.use(function(req, res, next)
{
  if(req.cookies.accessToken)
  {
    UserFct.checkCookieIntoDatabase(req.cookies).then((isValid) => {
      if(isValid)
      {
        next();
      } else {
        res.clearCookie("accessToken");
        res.redirect("/?session=false");
      }

    });
  }
});

router.get('/', function(req, res, next) {
  res.redirect('/users');
});

router.get('/admin', function(req, res, next) {
   console.log('caca');
 });


module.exports = router;
