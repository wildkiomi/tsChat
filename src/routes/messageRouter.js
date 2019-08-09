const express = require("express");
const messageController = require("../controllers/messageController.js");
const messageRouter = express.Router();
 
messageRouter.get("/delete", messageController.deleteMessage);
messageRouter.get("/add", messageController.addMessage);
messageRouter.get("/", messageController.getMessages);

module.exports = messageRouter;