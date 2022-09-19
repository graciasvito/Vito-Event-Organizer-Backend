const express = require("express");

const Router = express.Router();

const bookingController = require("../controllers/booking");
const authMiddleware = require("../middleware/auth");

Router.post("/", bookingController.createBooking);
Router.get(
  "/:userId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  bookingController.getBookingByUserId
);
Router.get("/section/:eventId", bookingController.getBookingSection);

module.exports = Router;
