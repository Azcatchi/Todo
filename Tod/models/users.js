const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const redis = new Redis(6379, process.env.REDIS_HOST || '127.0.0.1');
const Schema = mongoose.Schema;
const cookieParser = require('cookie-parser');
const Promise = require('bluebird');

// Create userSchema with mongo
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: String, enum: [true, false] },
  teamid: { type: String },
  date_created: Date,
});


// Instanciate model
User = mongoose.model('Users', userSchema);

var exportation = {

  //Insert user into DataBase
  insertIntoDatabase : function insertIntoDatabase(postCreateUser){
    hashPassword = exportation.encryptPassword(postCreateUser.password);
    User = mongoose.model('Users', userSchema);
    var newUser = User({
      username: postCreateUser.username,
      password: hashPassword,
      isAdmin: false,
      teamid: 0,
      date_created: Date.now()
    });
    // save the user
    return newUser.save();
  },

  // Encrypt Password with Bcrypt
  encryptPassword : function encryptPassword(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },

  // Fetching all user with no team
  fetchAllUserWithoutTeamId : function fetchAllUserWithoutTeamId() {
    return new Promise(function(resolve,reject)
    {
      User.find({}).where('teamid').equals(0).exec(function(err, user) {
        if(user)
        {
          resolve(user);
        } else {
          reject(err);
        }
      });
    });
  },

  // Update user information
  updateUser : function updateUser(username, param) {
    return User.update({username: username}, {teamid: param}, function(err, affected, resp) {
        console.log("Update Done");
    });
  },

  // Find user with his username
  findOneUserLogin : function findOneUserLogin(postLogin){
    hashPassword = exportation.encryptPassword(postLogin.password);
    return new Promise(function(resolve,reject)
    {
      User.find({ username: postLogin.username }).exec(function(err, user) {
        if(user[0] !== undefined)
        {
          bcrypt.compare(postLogin.password, user[0]['password'], function(err, res) {
              if(res) {
                   require('crypto').randomBytes(48, function(err, buffer) {
                      if(!err)
                      {
                        let token = buffer.toString('hex');
                        let cookieArray = {
                          userId : user[0]['_id'],
                          accessToken : token+"&admin="+user[0]['isAdmin']
                        };
                        exportation.insertSessionIntoDatabase(user[0]['_id'],token);
                          resolve(cookieArray);
                      }
                  });
                }
            });
          } else {
            reject("An error occured");
          }
       });
    });
  },

  // Find user with his teamId
  findUsersTeam : function findUsersTeam(teamId){
    return new Promise(function(resolve,reject)
    {
      User.find({ teamid: teamId }).exec(function(err, users) {
        if(users)
        {
          resolve(users);
        } else {
          reject(err);
        }
      });
    });
  },

  // Find teamId with UserId
  findUserTeamId : function findUserTeamId(userId){
    return User.find({ _id: userId }).exec();
  },

  // Insert session into database
  insertSessionIntoDatabase : function insertSessionIntoDatabase(userId, accessToken)
  {
    let expiresTime = new Date();
    let pipeline = redis.pipeline();
    pipeline.hmset(`session:${accessToken}`, {userId, accessToken, createdAt:Date.now(), expiresAt:expiresTime.setHours(expiresTime.getHours() + 3)});
    pipeline.sadd('sessions', accessToken);
    return pipeline.exec();
  },

  // checking accesToken
  checkAccessToken : function checkAccessToken(params)
  {
    let user = { userId: "" };
    let pipeline = redis.pipeline();
    let accessToken = params.accessToken.split('&admin=')[0];
    pipeline.hmget(`session:${accessToken}`,"userId");
    return pipeline.exec().then((res) => {
      for(var i in res)
      {
        tmpArray = res[i][1];
        user.userId = tmpArray[0];
      }
     return user;
    });
  },

  // checking cookie into database
  checkCookieIntoDatabase : function checkCookieIntoDatabase(params)
  {
    let session = {
      accessToken : "",
      expiresAt : ""
    };
    let pipeline = redis.pipeline();
    let accessToken = params.accessToken.split('&admin=')[0];
    pipeline.hmget(`session:${accessToken}`,"accessToken","expiresAt");
    return pipeline.exec().then((res) => {
      for(var i in res)
      {
        tmpArray = res[i][1];
        session.accessToken = tmpArray[0];
        session.expiresAt = tmpArray[1];
      }
     return exportation.compareTimeStamp(session);
    });
  },

  // Check if cookie is valid
  compareTimeStamp : function compareTimeStamp(params) {
    if(Date.now() < params.expiresAt)
    {
      return true;
    }
    return false;
  }
};

module.exports = exportation;
