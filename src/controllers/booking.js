const bookingModel = require("../models/booking");
const wrapper = require("../utils/wrapper");
const groupingSection = require("../utils/groupingSection");

module.exports = {
  createBooking: async (request, response) => {
    try {
      // Proses 1
      const {
        userId,
        eventId,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment = "success",
        section,
      } = request.body;

      const setDataBooking = {
        userId,
        eventId,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment,
      };

      const resultBooking = await bookingModel.createBooking(setDataBooking);

      // Proses 2
      let setBookingSection;

      for (let i = 0; i < section.length; i += 1) {
        setBookingSection = {
          bookingId: resultBooking.data[0].bookingId,
          section: section[i],
          statusUsed: false,
        };
        bookingModel.createBookingSection(setBookingSection);
      }

      const result = resultBooking.data.map(({ bookingId }) => ({
        bookingId,
        userId,
        eventId,
        totalTicket,
        totalPayment,
        paymentMethod,
        section,
      }));
      // console.log(result);

      return wrapper.response(
        response,
        resultBooking.status,
        "Success Create Booking",
        result
      );
    } catch (error) {
      // console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getBookingByUserId: async (request, response) => {
    try {
      const { userId } = request.params;
      if (request.decodeToken.userId !== userId) {
        return wrapper.response(response, 400, "Data not found", null);
      }
      const result = await bookingModel.getBookingByUserId(userId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `You don't have any booking history.`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get Data By Id",
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
  getBookingSection: async (request, response) => {
    try {
      const { eventId } = request.params;
      const result = await bookingModel.getBookingSection(eventId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${eventId} Not Found`,
          []
        );
      }
      // console.log(result.data);
      const resultSection = groupingSection(result);

      return wrapper.response(
        response,
        result.status,
        "Success Get Booking Section By Event Id",
        resultSection
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
// {
//   "bookingId": "3c3becd5-9a9d-43fc-b3fe-5736db8818ec",
//   "userId": "ca2973ed-9414-4135-84ac-799b6602d7b2",
//   "eventId": "fd958bab-7eaf-460b-9ec5-178c8d5ea904",
//   "totalTicket": 2,
//   "totalPayment": 200000,
//   "paymentMethod": "OVO",
//   "section": ["REG1-1", "REG1-2"]
// }
