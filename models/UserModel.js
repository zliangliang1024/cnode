var dbhelp = require("../utils/db_help");
var mongoose = dbhelp.mongoose;
var db = dbhelp.db;

var UserScehma = new mongoose.Schema({
    username: String,
    password: String,
    useremail: String
});

UserScehma.statics.getUserBySignupInfo = function (username, useremail, callback) {
    var cond = {"$or":[{username: username}, {useremail: useremail}]};
    this.find(cond, callback);
};

UserScehma.statics.addUser = function (user, callback) {
    this.create(user, callback);
};

UserScehma.statics.getUser = function (username, userpwd, callback) {
    this.findOne({username: username, password: userpwd}, callback);
};

module.exports = db.model("User", UserScehma);