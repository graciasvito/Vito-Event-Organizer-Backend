const express = require("express");

const Router = express.Router();

const wishlistController = require("../controllers/wishlist");
const authMiddleware = require("../middleware/auth");

Router.get(
  "/",
  authMiddleware.authentication,

  wishlistController.getAllWishlist
);
Router.post("/", wishlistController.createWishlist);
Router.get(
  "/:wishlistId",
  authMiddleware.authentication,
  wishlistController.getWishlistById
);
Router.delete(
  "/:wishlistId",
  authMiddleware.authentication,
  wishlistController.deleteWishlist
);
Router.get(
  "/user/:userId",
  authMiddleware.authentication,
  wishlistController.getWishlistByUserId
);
module.exports = Router;
