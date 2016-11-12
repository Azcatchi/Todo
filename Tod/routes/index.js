var express = require('express');
var router = express.Router();
const UserFct = require('../models/users/users.js');
/* GET users listing. */
router.get('/', function(req, res, next) {
  var success = "";

  if(req.query.valid == "true")
  {
    success = "Votre compte a été crée, veuillez vous connecter.";
  }
  else if(req.query.valid == "false") {
    success = "Une erreur est survenue, veuillez réesayer";
  }

  res.render('index', { success });
});

router.get('/create', function(req, res, next) {
  var error = "";

  if(req.query.valid == "false")
  {
    error = "Une erreur est survenue veuillez recommencer.";
  }

  res.render('users/create', { error });
});

router.post('/create', function(req, res, next) {
  if (!req.body.username || req.body.username === '' ||!req.body.password || req.body.password === '' ||!req.body.role || req.body.role === '') {
    res.redirect('/create?valid=false');
  }

  UserFct.insertIntoDatabase(req.body).then(() => {
    res.redirect('/?valid=true');
  }).catch((err) => {
    res.redirect('/create?valid=false');
  });
});

router.post('/login', function(req, res, next) {

  if (!req.body.username || req.body.username === '' ||!req.body.password || req.body.password === '') {
    res.redirect('/?valid=false');
  }
  UserFct.findOneUserLogin(req.body);
});

module.exports = router;
