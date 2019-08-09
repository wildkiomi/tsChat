const express = require("express");
const homeController = require("../controllers/homeController.js");
const homeRouter = express.Router();
 
homeRouter.get("/operator", homeController.operator);
homeRouter.get("/configurator", homeController.configurator);
homeRouter.get("/", homeController.home);

module.exports = homeRouter;