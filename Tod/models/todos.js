const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const redis = new Redis();
const Schema = mongoose.Schema;
const cookieParser = require('cookie-parser');
const Promise = require('bluebird');

var todoSchema = new Schema({
  userId: { type: Number },
  message: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  completedAt: { type: Date },
});

var exportation = {
  getUserIdFromToken: function getUserIdFromToken(params)
  {
    let user = {
      userId : "",
    };
    let pipeline = redis.pipeline();
    pipeline.hmget(`session:${params.accessToken}`,"userId");
    return pipeline.exec().then((res) => {
      for(var i in res)
      {
        tmpArray = res[i][1];
        user.userId = tmpArray[0];
      }
     return user;
    });
  }
};

module.exports = exportation;
