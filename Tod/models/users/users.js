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
  role: { type: String, enum: ['admin', 'user'] },
  date_created: Date,
});

var exportation = {
  insertIntoDatabase : function insertIntoDatabase(postCreateUser){
    hashPassword = exportation.encryptPassword(postCreateUser.password);
    User = mongoose.model('Users', userSchema);
    var newUser = User({
      username: postCreateUser.username,
      password: hashPassword,
      role: postCreateUser.role
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
        bcrypt.compare(postLogin.password, user[0]['password'], function(err, res) {
          if(res) {
               require('crypto').randomBytes(48, function(err, buffer) {
                  if(!err)
                  {
                    let token = buffer.toString('hex');
                    exportation.insertSessionIntoDatabase(user[0]['_id'],token);
                      resolve(user[0]['_id']+token);
                  }
              });
            console.log("Authentification OK");
          }
      });
    });
  });
  },
  insertSessionIntoDatabase : function insertSessionIntoDatabase(userId, accessToken)
  {
    let expiresTime = new Date();
    let pipeline = redis.pipeline();
    let id = require('uuid').v4();
    pipeline.hmset(`session:${id}`, {userId, accessToken, createdAt:Date.now(), expiresAt:expiresTime.setHours(expiresTime.getHours() + 3)});
    pipeline.sadd('sessions', id);
    return pipeline.exec();
  },
};

module.exports = exportation;
