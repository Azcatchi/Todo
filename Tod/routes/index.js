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
  var success = "";

  if(req.query.valid == "true")
  {
    success = "Votre compte a été crée, veuillez vous connecter.";
  }
  else if(req.query.valid == "false") {
    success = "Une erreur est survenue, veuillez réesayer";
  }
  else if(req.query.session == "false") {
    success = "Votre session est expirée ! Veuillez-vous reconnecter";
  }
  res.redirect('/users');
});

module.exports = router;
