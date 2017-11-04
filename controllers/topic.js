var validator = require("validator");
var TopicModel = require("../models/TopicModel");

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
        by_user: req.session.user,
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