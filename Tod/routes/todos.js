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

 router.get('/', function(req, res, next) {
   // On affiche les todos assignées à l'utilisateur 
   // Un boutton pour les modifier -> /edit/:id  Voir pour
   // Checkbox de finition de todo

   res.send("caca");
 });

 router.post('/add', function(req, res, next) {
   res.send("caca");
   // Enregistre une todo et on redirige vers todos
 });


module.exports = router;