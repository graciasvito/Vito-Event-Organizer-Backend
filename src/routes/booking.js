const express = require("express");

const Router = express.Router();

const bookingController = require("../controllers/booking");
const authMiddleware = require("../middleware/auth");

Router.post(
  "/",
  authMiddleware.authentication,
  bookingController.createBooking
);
Router.get(
  "/:userId",
  authMiddleware.authentication,
  bookingController.getBookingByUserId
);
Router.get(
  "/section/:eventId",
  authMiddleware.authentication,
  bookingController.getBookingSection
);

module.exports = Router;
