var TopicModel = require("../models/TopicModel");
var EventProxy = require("eventproxy");
var _ = require("lodash");
var Tool = require("../utils/tools");
exports.index = function (req, res) {
    var page = parseInt(req.query.page) || 1;
    page = page > 0 ? page : 1;
    var tab = req.query.tab || "all";
    var query = {};
    if (tab !== "all") {
        query.tab = tab;
    }
    var ep = new EventProxy();
    var count = 10;
    var option = {};
    TopicModel.getTopics(query, option, function (err, topics) {
        if (err) {
            ep.emit("topic_data_ok", [{_id: NaN, title: NaN, create_time: "00:00:00", by_user: "xxx"}]);
            console.log(err);
            return;
        }
        topics = _.map(topics, function (topic) {
            topic.formatStr = Tool.formatTime(topic.create_time);
            return topic;
        });
        ep.emit("topic_data_ok", topics);
    });
    TopicModel.count(query, function (err, topicCount) {
        if (err) {
            ep.emit("page_count_ok", 1);
            console.log(err);
            return;
        }
        var pageCount = Math.ceil(topicCount / count);
        ep.emit("page_count_ok", pageCount);
    });
    ep.all("topic_data_ok", "page_count_ok", function (topics, pageCount) {
        res.render('index', {topics: topics, tab: tab, page: page, pageCount: pageCount});
    });
};
