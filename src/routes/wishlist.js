const express = require("express");

const Router = express.Router();

const wishlistController = require("../controllers/wishlist");

Router.get("/", wishlistController.getAllWishlist);
Router.post("/", wishlistController.createWishlist);
Router.get("/:wishlistId", wishlistController.getWishlistById);
Router.delete("/:wishlistId", wishlistController.deleteWishlist);
module.exports = Router;