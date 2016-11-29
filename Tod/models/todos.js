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
};

module.exports = exportation;
