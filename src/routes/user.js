const express = require("express");

const Router = express.Router();

const userController = require("../controllers/user");
const uploadMiddleware = require("../middleware/uploadFile");
const authMiddleware = require("../middleware/auth");

Router.patch(
  "/image/:userId",
  uploadMiddleware.updateImageUser,
  userController.updateImageUser
);
Router.get("/", userController.getAllUser);
Router.get(
  "/:userId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  userController.getUserById
);
Router.post("/", userController.createUser);
Router.patch("/:userId", userController.updateUser);
Router.delete("/:userId", userController.deleteUser);
Router.patch("/password/:userId", userController.updateUserPassword);

module.exports = Router;
