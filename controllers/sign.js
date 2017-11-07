var EventProxy = require("eventproxy");
var UserModel = require("../models/UserModel");

/***
 * 登录相关的控制器
 */
exports.showSignup = function (req, res) {
    res.render('sign/signup');
};
exports.signup = function (req, res) {
    // 获取前台表单提交信息
    var username = req.body.login_name;
    var userpwd = req.body.login_pwd;
    var user_repwd = req.body.login_repwd;
    var useremail = req.body.login_email;
    var ep = new EventProxy();
    ep.on("info_error", function (msg) {
        res.status(422);
        res.render("sign/signup", {error: msg});
    });

    // 校验数据
    // 是否为空
    var hasFieldEmpty = [username, userpwd, user_repwd, useremail].some(function (item) {
        return item === "" || item === undefined;
    });

    var isPwdDiff = userpwd !== user_repwd;
    if (hasFieldEmpty || isPwdDiff) {
        ep.emit("info_error", "注册信息有误!");
        return;
    }

    // 存入数据库
    UserModel.getUserBySignupInfo(username, useremail, function (err, result) {
        if (err) {
            ep.emit("info_error", "获取数据失败");
            return;
        }
        if (result.length > 0) {
            ep.emit("info_error", "用户名或邮箱已被注册!");
            return;
        }

        UserModel.addUser({username: username, password: userpwd, useremail: useremail}, function (err, result) {
            if (result) {
                return res.render("sign/signup", {success: "恭喜您，注册成功!"});
            } else {
                ep.emit("info_error", "注册失败");
            }
        });
    });

};
exports.showSignin = function (req, res) {
    res.render('sign/signin');
};

exports.signin = function (req, res) {
    // 获取前台表单提交信息
    var username = req.body.signin_name;
    var userpwd = req.body.signin_pwd;

    // 校验数据
    if (!username || !userpwd) {
        res.status(422);
        return res.render('sign/signin', {error: "您填写的信息有误!"});
    }

    // 查询数据库
    UserModel.getUser(username, userpwd, function (err, user) {
        if (user) {
            req.session.user = user;
            return res.redirect("/");
        } else {
            res.render('sign/signin', {error: "用户名或密码错误!"});
        }
    });
};

exports.signout = function (req, res) {
    req.session.destroy();
    res.redirect("/");
};