const express = require('express');
var router = express.Router();
const UserFct = require('../models/users.js');
const TeamFct = require('../models/admin.js');

// RENDER create new user page
router.get('/create', function(req, res, next) {
  var error = "";

  if(req.query.valid == "false")
  {
    error = "Une erreur est survenue veuillez recommencer.";
  }
  res.render('pages/create', { error });
});

// CREATE a new user
router.post('/create', function(req, res, next) {
  if (!req.body.username || req.body.username === '' ||!req.body.password || req.body.password === '') {
    res.redirect('/create?valid=false');
  }
  UserFct.insertIntoDatabase(req.body).then((isValid) => {
    if(isValid)
    {
      res.redirect('/?valid=true');
    } else {
      res.redirect('/?valid=false');
    }
  })
});

// Connect user and create ACCESSTOKEN
router.post('/login', function(req, res, next) {
  if (!req.body.username || req.body.username === '' ||!req.body.password || req.body.password === '') {
    res.redirect('/?valid=false');
  }
  UserFct.findOneUserLogin(req.body).then((cookieArray) => {
    res.format({
      html : () => {
        res.cookie('accessToken',cookieArray.accessToken);
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
    res.redirect('/?valid=false');
  });
});

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
  } else {
    res.redirect('/?session=false');
  }
});

// ADMIN interface if true
router.get('/admin', function(req, res, next) {
  if(req.cookies !== undefined && req.cookies.accessToken.split('&admin=')[1] == "true")
  {
    TeamFct.findTeams().then((teams) => {
      res.render('pages/admin', { teams });
    });
  } else {
    res.redirect('../todos');
  }
});

// INSERT new team into database
router.post('/admin', function(req, res, next) {
  if (!req.body.name || req.body.name === '') {
    res.redirect('/users?valid=false');
  }
  TeamFct.insertIntoDatabase(req.body).then(() => {
    res.redirect('/users/admin');
  });
});

// DELETE user from team on admin page
router.post('/admin/remove', function(req, res, next) {
  if(req.body.username && req.body.username !== '')
  {
    UserFct.updateUser(req.body.username, 0);
    res.redirect('/users/admin/'+req.body.param);
  }
});

// ADD user in team from admin page
router.post('/admin/add', function(req, res, next) {
  if(req.body.username && req.body.username !== '')
  {
    UserFct.updateUser(req.body.username, req.body.param);
    res.redirect('/users/admin/'+req.body.param);
  }
});

// Modify users in team from admin page
router.get('/admin/:teamId', function(req, res, next) {
  UserFct.findUsersTeam(req.params.teamId).then((usersInTeam) => {
    UserFct.fetchAllUserWithoutTeamId().then((freeAgents) => {
      param = req.params.teamId;
      res.render('pages/editTeam', { usersInTeam, freeAgents, param});
    });
  });
});

module.exports = router;
