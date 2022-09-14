const express = require("express");

const Router = express.Router();

const eventController = require("../controllers/event");
const uploadMiddleware = require("../middleware/uploadFile");
const redisMiddleware = require("../middleware/redis");

Router.get("/", redisMiddleware.getAllEvent, eventController.getAllEvent);
Router.get(
  "/:eventId",
  redisMiddleware.getEventById,
  eventController.getEventById
);
Router.post(
  "/",
  uploadMiddleware.updateImageEvent,
  redisMiddleware.clearEvent,
  eventController.createEvent
);
Router.patch(
  "/:eventId",
  redisMiddleware.clearEvent,
  eventController.updateEvent
);
Router.delete(
  "/:eventId",
  redisMiddleware.clearEvent,
  eventController.deleteEvent
);

module.exports = Router;
