const express = require("express");

const Router = express.Router();

const eventController = require("../controllers/event");
const uploadMiddleware = require("../middleware/uploadFile");
const redisMiddleware = require("../middleware/redis");
const authMiddleware = require("../middleware/auth");

Router.get("/", redisMiddleware.getAllEvent, eventController.getAllEvent);
Router.get(
  "/:eventId",
  redisMiddleware.getEventById,
  eventController.getEventById
);
Router.post(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.updateImageEvent,
  redisMiddleware.clearEvent,
  eventController.createEvent
);
Router.patch(
  "/:eventId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  uploadMiddleware.updateImageEvent,
  redisMiddleware.clearEvent,
  eventController.updateEvent
);
Router.delete(
  "/:eventId",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.clearEvent,
  eventController.deleteEvent
);

module.exports = Router;
