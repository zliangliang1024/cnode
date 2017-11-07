var validator = require("validator");
var TopicModel = require("../models/TopicModel");
var ReplyModel = require("../models/ReplyModel");
var EventProxy = require("eventproxy");
var Tool = require("../utils/tools");
var _ = require("lodash");

exports.showTopicCreate = function (req, res) {
    res.render("topic/create");
};

exports.topicCreate = function (req, res) {
    // 获取前台表单内容
    var title = validator.trim(req.body.topic_title);
    var tab = validator.trim(req.body.tab);
    var content = validator.trim(req.body.t_content);

    // 检验
    var isNotValid = [title, tab, content].some(function (item) {
        return item === '' || item === undefined;
    });

    if (isNotValid) {
        return res.render("topic/create", {error: "信息输入有误"});
    }
    // 插入数据库
    var TopicPo = {
        title: title,
        content: content,
        tab: tab,
        by_user: req.session.user.username,
        create_time: new Date()
    };

    TopicModel.createTopic(TopicPo, function (err, result) {
        if (result) {
            return res.render("topic/create", {success: "发布话题成功"});
        } else {
            res.status(422);
            return res.render("topic/create", {error: "话题发布失败"});
        }
    });

};

exports.detail = function (req, res) {
    var topicId = req.params.tid;
    var ep = new EventProxy();
    TopicModel.getTopic(topicId, function (err, topic) {
        if (err) {
            console.log("Get Topic Error: " + err);
            ep.emit("topic_data_ok", {topic: "XXX", by_user: "XXX", formatStr: "XXX"});
            return;
        }
        topic.formatStr = Tool.formatTime(topic.create_time);
        ep.emit("topic_data_ok", topic);
    });
    ReplyModel.count({topic_id: topicId}, function (err, replyCount) {
        if (err) {
            console.log("Get replyCount Error: " + err);
            ep.emit("reply_count_ok", 0);
            return;
        }
        ep.emit("reply_count_ok", replyCount);
    });
    ReplyModel.getReplys({topic_id: topicId}, function (err, replys) {
        if (err) {
            console.log("Get replys Error: " + err);
            ep.emit("reply_data_ok", [{error: true}]);
            return;
        }
        replys = _.map(replys, function (item) {
            item.formatStr = Tool.formatTime(item.reply_time);
            return item;
        });
        console.log("replys: " + replys);
        ep.emit("reply_data_ok", replys);
    });
    ep.all("topic_data_ok", "reply_count_ok", "reply_data_ok", function (topic, replyCount, replys) {
        res.render("topic/details", {topic: topic, replyCount: replyCount, replys: replys});
    });
};