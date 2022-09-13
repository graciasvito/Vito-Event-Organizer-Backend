const express = require("express");

const Router = express.Router();

const userController = require("../controllers/user");
const uploadMiddleware = require("../middleware/uploadFile");

Router.patch(
  "/image/:userId",
  uploadMiddleware.updateImageUser,
  userController.updateImageUser
);
Router.get("/", userController.getAllUser);
Router.get("/:userId", userController.getAllUser);
Router.post("/", userController.createUser);
Router.patch("/:userId", userController.updateUser);
Router.delete("/:userId", userController.deleteUser);

module.exports = Router;
