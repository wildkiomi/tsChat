const mongoose = require("mongoose");
 
const Schema = mongoose.Schema;

const messageScheme = new Schema({
    time: String,
    writer: String,
    value: String,
    toWho: String
});
module.exports = mongoose.model("Message", messageScheme);