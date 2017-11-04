var mongoose = require("mongoose");
var db = mongoose.createConnection("mongodb://127.0.0.1:27017/node_club");

module.exports = {
    mongoose: mongoose,
    db: db
};