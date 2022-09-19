const express = require("express");

const Router = express.Router();

const wishlistController = require("../controllers/wishlist");
const authMiddleware = require("../middleware/auth");

Router.get(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  wishlistController.getAllWishlist
);
Router.post("/", wishlistController.createWishlist);
Router.get(
  "/:wishlistId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  wishlistController.getWishlistById
);
Router.delete("/:wishlistId", wishlistController.deleteWishlist);
Router.get(
  "/user/:userId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  wishlistController.getWishlistByUserId
);
module.exports = Router;
