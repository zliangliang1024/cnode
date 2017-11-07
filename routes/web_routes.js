var express = require('express');
var router = express.Router();
var SignController = require("../controllers/sign");
var TopicController = require("../controllers/topic");
var SiteController = require("../controllers/site");
var ReplyController = require("../controllers/reply");
var Auth = require("../middlewares/auth");

/* GET home page. */
router.get('/', SiteController.index);

// 注册页面
router.get('/signup', SignController.showSignup);

// 提交注册信息
router.post('/signup', SignController.signup);

// 登录页面
router.get('/signin', SignController.showSignin);

// 提交登录信息
router.post('/signin', SignController.signin);

// 退出登录
router.get('/signout', SignController.signout);

// 显示发表话题页面
router.get("/topic/create", Auth.requiredLogin, TopicController.showTopicCreate);

// 提交话题
router.post("/topic/create", Auth.requiredLogin, TopicController.topicCreate);

// 显示话题详情页
router.get("/topic/:tid", TopicController.detail);

// 处理用户回复信息
router.post("/reply/reply", Auth.requiredLogin, ReplyController.addReply);

// 处理用户上传图片
router.post("/upload", Auth.requiredLogin, ReplyController.upload);

module.exports = router;