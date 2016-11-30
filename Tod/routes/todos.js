const express = require('express');
var router = express.Router();
const UserFct = require('../models/users.js');
const TodosFct = require('../models/todos.js');


router.use(function(req, res, next)
{
  console.log(req.cookies);
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
   // On affiche les todos assignées à l'utilisateur
   // Un boutton pour les modifier -> /edit/:id  Voir pour
   // Checkbox de finition de todo


   // TeamId sur schémas todo et sur l'user(à rajouter)
   res.send("caca");
 });

 router.get('/add', function(req, res, next) {
      TodosFct.getUserIdFromToken(req.cookies).then((userId) => {
        console.log(userId);
        res.render('pages/addTodo', { success:"lol"});
      });
   // Enregistre une todo et on redirige vers todos
 });


module.exports = router;
