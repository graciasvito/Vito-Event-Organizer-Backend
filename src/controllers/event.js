const { request } = require("express");
const eventModel = require("../models/event");
const wrapper = require("../utils/wrapper");

module.exports = {
  getAllEvent: async (request, response) => {
    try {
      console.log(request.query);
      let { page, limit } = request.query;
      page = +page;
      limit = +limit;

      const totalData = await eventModel.getCountEvent();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        // page, totalPage, limit, totalData
        page,
        totalPage,
        limit,
        totalData,
      };
      const offset = page * limit - limit;

      const result = await eventModel.getAllEvent(offset, limit);
      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
        result.data,
        pagination
      );
    } catch (error) {
      console.log(error);
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  getEventById: async (request, response) => {
    try {
      const { eventId } = request.params;

      const result = await eventModel.getEventById(eventId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${eventId} Not Found`,
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
  createEvent: async (request, response) => {
    try {
      console.log(request.body);
      const { name, category, location, detail, dateTimeShow, price } =
        request.body;
      const setData = {
        name,
        category,
        location,
        detail,
        dateTimeShow,
        price,
      };

      const result = await eventModel.createEvent(setData);

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
  updateEvent: async (request, response) => {
    try {
      console.log(request.params);
      console.log(request.body);
      const { eventId } = request.params;
      const { name, category, location, detail, dateTimeShow, price } =
        request.body;

      const checkId = await eventModel.getEventById(eventId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${eventId} Not Found`,
          []
        );
      }

      const setData = {
        name,
        category,
        location,
        detail,
        dateTimeShow,
        price,
      };

      const result = await eventModel.updateEvent(eventId, setData);

      return wrapper.response(
        response,
        result.status,
        "Success Update Data",
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
  deleteEvent: async (request, response) => {
    try {
      const { eventId } = request.params;

      const checkId = await eventModel.getEventById(eventId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${eventId} Not Found`,
          []
        );
      }
      const result = await eventModel.deleteEvent(eventId);

      return wrapper.response(
        response,
        result.status,
        "Success Delete Data",
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
