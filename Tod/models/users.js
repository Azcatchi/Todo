const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const redis = new Redis();
const Schema = mongoose.Schema;
const cookieParser = require('cookie-parser');
const Promise = require('bluebird');

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: String, enum: [true, false] },
  teamid: { type: Number },
  date_created: Date,
});

var exportation = {
  insertIntoDatabase : function insertIntoDatabase(postCreateUser){
    hashPassword = exportation.encryptPassword(postCreateUser.password);
    User = mongoose.model('Users', userSchema);
    var newUser = User({
      username: postCreateUser.username,
      password: hashPassword,
      isAdmin: false
    });
    // save the user
    return newUser.save();
  },
  encryptPassword : function encryptPassword(password) {
    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },
  findOneUserLogin : function findOneUserLogin(postLogin){
    hashPassword = exportation.encryptPassword(postLogin.password);
    User = mongoose.model('Users', userSchema);

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
                          accessToken : token
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
  insertSessionIntoDatabase : function insertSessionIntoDatabase(userId, accessToken)
  {
    let expiresTime = new Date();
    let pipeline = redis.pipeline();
    pipeline.hmset(`session:${accessToken}`, {userId, accessToken, createdAt:Date.now(), expiresAt:expiresTime.setHours(expiresTime.getHours() + 3)});
    pipeline.sadd('sessions', accessToken);
    return pipeline.exec();
  },
  checkCookieIntoDatabase : function checkCookieIntoDatabase(params)
  {
    let session = {
      accessToken : "",
      expiresAt : ""
    };
    let pipeline = redis.pipeline();
    pipeline.hmget(`session:${params.accessToken}`,"accessToken","expiresAt");
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
  compareTimeStamp : function compareTimeStamp(params) {
    if(Date.now() < params.expiresAt)
    {
      return true;
    }
    return false;
  }
};

module.exports = exportation;
