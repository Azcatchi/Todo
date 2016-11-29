const express = require('express');
var router = express.Router();
const UserFct = require('../models/users.js');



router.use(function(req, res, next)
{
  console.log(req.cookies);
  if(req.cookies.accessToken)
  {
    UserFct.checkCookieIntoDatabase(req.cookies).then((isValid) => {
      if(isValid)
      {
        res.redirect("/todos");
      } else {
        res.clearCookie("accessToken");
        res.redirect("/?session=false");
      }

    });
  }
    next();
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
  UserFct.findOneUserLogin(req.body).then((cookieArray) => {
    res.format({
      html : () => {
        res.cookie('accessToken',cookieArray.accessToken).redirect('/todos');
      },
      json : () => {
        res.send({'accessToken' : cookieArray.accessToken});
      }
    });
  });
});

module.exports = router;
