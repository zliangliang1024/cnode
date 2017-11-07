var dbhelp = require("../utils/db_help");
var mongoose = dbhelp.mongoose;
var db = dbhelp.db;

var ReplyScehma = new mongoose.Schema({
    topic_id: String,
    reply_user: String,
    reply_content: String,
    reply_time: Date
});

ReplyScehma.statics.addReply = function (reply, callback) {
    this.create(reply, callback);
};

ReplyScehma.statics.getReplys = function (query, callback) {
    this.find(query, callback);
};

module.exports = db.model("Reply", ReplyScehma);