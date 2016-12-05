const express = require('express');
var router = express.Router();

// LOGIN interface
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

  res.render('index', { success });
});

module.exports = router;
