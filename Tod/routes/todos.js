const express = require('express');
var router = express.Router();
const UserFct = require('../models/users.js');

<<<<<<< HEAD
// router.use(function(req, res, next)
// {
//   if(req.cookies.accessToken)
//   {
//     UserFct.checkCookieIntoDatabase(req.cookies).then((isValid) => {
//       if(isValid)
//       {
//         next();
//       } else {
//         res.clearCookie("accessToken");
//         res.redirect("/?session=false");
//       }
//
//     });
//   }
// });

=======
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

>>>>>>> 7a81872a910406598e4f54bcca72ab866aa9efcf
router.get('/', function(req, res, next) {
   // On affiche les todos assignées à l'utilisateur
   // Un boutton pour les modifier -> /edit/:id  Voir pour
   // Checkbox de finition de todo
   res.send("caca");
});

 router.post('/add', function(req, res, next) {
   res.render('pages/addTodo', { success: "lol" });
   // Enregistre une todo et on redirige vers todos
});


module.exports = router;
