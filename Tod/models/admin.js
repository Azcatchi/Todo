const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var teamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  date_created: Date,
});

Team = mongoose.model('Teams', teamSchema);

var exportation = {

  insertIntoDatabase : function insertIntoDatabase(postCreateTeam) {
    var newTeam = Team({
      name: postCreateTeam.name,
      date_created: Date.now()
    });
    // save the user
    return newTeam.save();
  },
  findTeams : function findTeams() {
    return new Promise(function(resolve,reject)
    {
      Team.find({}, function(err, teams) {
        if(teams)
        {
          resolve(teams);
        } else {
          reject(err);
        }
      });
    });
  }

};

module.exports = exportation;
