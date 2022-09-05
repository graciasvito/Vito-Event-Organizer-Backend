const express = require("express");

const Router = express.Router();

const userController = require("../controllers/user");

Router.get("/greetings", userController.showGreetings);
Router.get("/getuser", userController.getAllUser);
Router.get("/:userId", userController.getAllUser);
Router.get("/", userController.getAllUser);

module.exports = Router;
