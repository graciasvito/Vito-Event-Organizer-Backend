const express = require("express");

const Router = express.Router();

const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

Router.post("/register", authController.register);
Router.post("/login", authMiddleware.isVerify, authController.login);
Router.post("/logout", authController.logout);
Router.post("/refresh", authController.refresh);
Router.get("/verify/:otp", authController.verify);

module.exports = Router;
