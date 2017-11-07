var path = require("path");
var fs = require("fs");
var ReplyModel = require("../models/ReplyModel");

exports.addReply = function (req, res) {

    // 获取前台回复表单内容
    var topicId = req.body.topicId;
    var reply_content = req.body.reply_content;

    var ReplyBean = {
        topic_id: topicId,
        reply_user: req.session.user.username,
        reply_content: reply_content,
        reply_time: Date.now()
    };

    if (reply_content === undefined || reply_content.length === 0) {
        res.redirect("/topic/" + topicId);
        return;
    }
    ReplyModel.addReply(ReplyBean, function (err, result) {
        if (err) {
            console.log("Post Reply Error: " + err);
        }
        res.redirect("/topic/" + topicId);
    });
};
exports.upload = function (req, res) {
    req.pipe(req.busboy);
    req.busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
        var uploadName = String(new Date().getTime()) + path.extname(filename);
        var filePath = __dirname + "/../public/upload/" + uploadName;
        var url = "/public/upload/" + uploadName;
        file.pipe(fs.createWriteStream(filePath));
        file.on("end", function () {
            res.json({success: true, url: url});
        });
    });
};