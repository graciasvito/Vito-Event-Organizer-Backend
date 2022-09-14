const express = require("express");

const Router = express.Router();

const bookingController = require("../controllers/booking");

Router.post("/", bookingController.createBooking);
Router.get("/:userId", bookingController.getBookingByUserId);
Router.get("/section/:eventId", bookingController.getBookingSection);

module.exports = Router;
