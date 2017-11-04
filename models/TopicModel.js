var dbhelp = require("../utils/db_help");
var mongoose = dbhelp.mongoose;
var db = dbhelp.db;

var TopicSchema = new mongoose.Schema({
    title:String,
    content:String,
    tab:String,
    by_user:String,
    create_time:Date
});

TopicSchema.statics.createTopic = function (topicPo,callback) {
    this.create(topicPo,callback);
};

module.exports = db.model("TopicModel",TopicSchema);