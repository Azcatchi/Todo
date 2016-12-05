const express = require('express');
var router = express.Router();
const UserFct = require('../models/users.js');
const TodoFct = require('../models/todos.js');

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

router.get('/', function(req, res, next) {
   res.render('pages/indexTodo');
});

router.get('/user', function(req, res, next) {
   UserFct.checkAccessToken(req.cookies).then((params) => {
      TodoFct.fetchUserTodo(params.userId).then((todoList) => {
         if(req.query.valid == "false")
         {
            var error = "You do not have team. This is your own todos"
         }
         res.render('pages/seeTodo', { list: todoList, error, page: "user"})
      });
   });
});
router.get('/team', function(req, res, next) {
   UserFct.checkAccessToken(req.cookies).then((params) => {
      UserFct.findUserTeamId(params.userId).then((teamId) => {
         if(teamId[0].teamid != "0")
         {
            TodoFct.fetchTeamTodo(teamId[0].teamid).then((todoList) => {
               res.render('pages/seeTodo', { list: todoList, error: "", page: "team" })
            });
         } else {
            res.redirect('user?valid=false');
         }
      });
   });
});

router.get('/complete/:todoId', function(req, res, next) {
   TodoFct.updateTodoToComplete(req.params.todoId);
   res.redirect('/todos/'+req.query.redirect);
});

router.get('/modify/:todoId', function(req, res, next) {
   res.render('pages/modifyTodo', { todoId: req.params.todoId, redirect: req.query.redirect });
});

router.get('/create', function(req, res, next) {
   UserFct.checkAccessToken(req.cookies).then((params) => {
      UserFct.findUserTeamId(params.userId).then((teamId) => {
         if(teamId[0].teamid != "0")
         {
            UserFct.findUsersTeam(teamId[0].teamid).then((Usersteam) => {
               res.render('pages/createTeamTodo', { team: Usersteam, teamId: teamId[0].teamid, page: "team" });
            });
         } else {
            res.render('pages/createUserTodo', { userId: params.userId, page: "user" });
         }
      });
   });

});
router.post('/create', function(req, res, next) {
   if(req.body.messageUser) {
      TodoFct.createSimpleTodo(req.body.userId, "0", req.body.messageUser);
      res.redirect(req.query.redirect);
   } else {
      TodoFct.createSimpleTodo(req.body.selectUser, req.body.teamId, req.body.messageTeam);
      res.redirect(req.query.redirect);
   }
});

router.post('/modify', function(req, res, next) {
   if(req.body.message && req.body.message != "")
   {
      TodoFct.updateTodoMessage(req.body.todoId, req.body.message);
      res.redirect('/todos/'+req.body.redirect);
   }
});



module.exports = router;
