var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
const Redis = require('ioredis');
const redis = new Redis();
var Schema = mongoose.Schema;

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

    User.find({ username: postLogin.username }).exec(function(err, user) {
      bcrypt.compare(postLogin.password, user[0]['password'], function(err, res) {
          if(res) {
            console.log("Authentification OK");
          }
      });
    });
  },
};

module.exports = exportation;
