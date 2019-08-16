const express = require("express");
const chatController = require("../controllers/chatController.js");
const chatRouter = express.Router();
 
chatRouter.ws("/operator", chatController.operatorChat);
chatRouter.ws("/", chatController.chatting);

module.exports = chatRouter;