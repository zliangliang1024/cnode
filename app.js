var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('ejs-mate');
var session = require("express-session");
var RedisStore = require("connect-redis")(session);
var webRoutes = require('./routes/web_routes');
var config = require("./config");

var app = express();

// view engine setup
app.engine("html", engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "cnode_club_demo",
    store: new RedisStore({
        port: 6379,
        host: "127.0.0.1"
    }),
    resave: true,
    saveUninitialized: true

}));
app.use(function (req, res, next) {
    app.locals.cur_user = req.session.user;
    console.log(JSON.stringify(app.locals.cur_user));
    next();
});
app.locals.config = config;
app.use("/", webRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
