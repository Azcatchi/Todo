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
  else if(req.query.session == "false") {
    success = "Votre session est expirée ! Veuillez-vous reconnecter";
  }

  res.render('index', { success });
});

router.get('/create', function(req, res, next) {
  var error = "";

  if(req.query.valid == "false")
  {
    error = "Une erreur est survenue veuillez recommencer.";
  }
  res.render('pages/create', { error });
});

router.get('/admin', function(req, res, next) {
  if(cookieArray.accessToken.split('&admin=')[1] == "true")
  {

  } else {
    res.redirect('../todos');
  }
});

router.post('/create', function(req, res, next) {
  if (!req.body.username || req.body.username === '' ||!req.body.password || req.body.password === '' ||!req.body.role || req.body.role === '') {
    res.redirect('/create?valid=false');
  }

  UserFct.insertIntoDatabase(req.body).then(() => {
    res.redirect('/users?valid=true');
  }).catch((err) => {
    res.redirect('/users/create?valid=false');
  });
});

router.post('/login', function(req, res, next) {
  if (!req.body.username || req.body.username === '' ||!req.body.password || req.body.password === '') {
    res.redirect('/users?valid=false');
  }
  UserFct.findOneUserLogin(req.body).then((cookieArray) => {
    res.format({
      html : () => {
        res.cookie('accessToken',cookieArray.accessToken);
        console.log(cookieArray.accessToken.split('&admin=')[1]);
        if(cookieArray.accessToken.split('&admin=')[1] == "false")
        {
          res.redirect('../todos');
        } else {
          res.redirect('admin');
        }
      },
      json : () => {
        res.send({'accessToken' : cookieArray.accessToken});
      }
    });
  }).catch(() => {
    res.redirect('/users?valid=false');
  });
});

module.exports = router;
