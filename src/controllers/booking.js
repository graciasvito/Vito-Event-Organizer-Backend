const { request } = require("express");
const bookingModel = require("../models/booking");
const wrapper = require("../utils/wrapper");

module.exports = {
  createBooking: async (request, response) => {
    try {
      console.log(request.body);
      const { userId, eventId, totalTicket, totalPayment, statusPayment } =
        request.body;
      const setData = {
        userId,
        eventId,
        totalTicket,
        totalPayment,
        statusPayment,
      };

      const result = await bookingModel.createBooking(setData);

      return wrapper.response(
        response,
        result.status,
        "Success Create Data",
        result.data
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
};
