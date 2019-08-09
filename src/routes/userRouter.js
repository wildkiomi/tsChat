const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();
 
userRouter.use("/delete", userController.deleteUser);
userRouter.use("/change", userController.changeUser);
userRouter.use("/", userController.getUsers);
 
module.exports = userRouter;