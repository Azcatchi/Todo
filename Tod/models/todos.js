const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const redis = new Redis(6379, process.env.REDIS_HOST || '127.0.0.1');
const Schema = mongoose.Schema;
const cookieParser = require('cookie-parser');
const Promise = require('bluebird');

// Create todoSchema
var todoSchema = new Schema({
  userId: { type: String },
  teamId: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },
});


// Instanciate todoSchema
Todo = mongoose.model('Todos', todoSchema);

var exportation = {
  // Create a personal todo
  createSimpleTodo : function createSimpleTodo(userId, teamId, message) {
    return Todo({userId, teamId, message, createdAt: Date.now()}).save();
  },
  // Fetch user todos
  fetchUserTodo : function fetchUserTodo(userId) {
    return Todo.find({userId}).exec();
  },
  // Fetch team todos
  fetchTeamTodo : function fetchTeamTodo(teamId) {
    return Todo.find({teamId}).exec();
  },
  // Update todo to complete
  updateTodoToComplete : function updateTodoToComplete(todoId) {
    return Todo.update({ _id: todoId }, { completedAt: Date.now() }, function(err, affected, resp) {
      console.log("Update Done");
    });
  },
  // Update todo message
  updateTodoMessage : function updateTodoMessage(todoId, message) {
    return Todo.update({ _id: todoId }, { message, updatedAt: Date.now() }, function(err, affected, resp) {
      console.log("Update Done");
    });
  },
};

module.exports = exportation;
