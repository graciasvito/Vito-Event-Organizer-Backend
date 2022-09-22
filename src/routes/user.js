const express = require("express");

const Router = express.Router();

const userController = require("../controllers/user");
const uploadMiddleware = require("../middleware/uploadFile");
const authMiddleware = require("../middleware/auth");

Router.patch(
  "/image/:userId",
  authMiddleware.authentication,
  uploadMiddleware.updateImageUser,
  userController.updateImageUser
);
Router.get(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  userController.getAllUser
);
Router.get(
  "/:userId",
  authMiddleware.authentication,
  userController.getUserById
);
Router.post("/", authMiddleware.authentication, userController.createUser);
Router.patch(
  "/:userId",
  authMiddleware.authentication,
  userController.updateUser
);
Router.delete(
  "/:userId",
  authMiddleware.authentication,
  userController.deleteUser
);
Router.patch(
  "/password/:userId",
  authMiddleware.authentication,
  userController.updateUserPassword
);

module.exports = Router;
