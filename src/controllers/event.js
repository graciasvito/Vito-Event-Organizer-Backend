const { request } = require("express");
const eventModel = require("../models/event");
const wrapper = require("../utils/wrapper");
// const cloudinary = require("../config/cloudinary");
// const { search } = require("../config/cloudinary");

module.exports = {
  getAllEvent: async (request, response) => {
    try {
      let { page, limit, searchName, sort } = request.query;
      page = +page || 1;
      limit = +limit || 10;
      searchName = `%${searchName}%` || "";
      // // searchDateShow = "";

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
      // const day = new Date(searchDateShow);
      // const nextDay = new Date(new Date(day).setDate(day.getDate() + 1));
      const sortColumn = sort.split(" ")[0];
      let sortType = sort.split(" ")[1];

      if (sortType.toLowerCase() === "asc") {
        sortType = true;
      } else {
        sortType = false;
      }

      const result = await eventModel.getAllEvent(
        offset,
        limit,
        searchName,
        sortColumn,
        sortType
        // day,
        // nextDay
      );
      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
        result.data,
        pagination
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
      // console.log(request.file);
      // console.log(request.body);
      const { filename } = request.file;
      const { name, category, location, detail, dateTimeShow, price } =
        request.body;
      const setData = {
        name,
        category,
        location,
        detail,
        dateTimeShow,
        price,
        image: filename || "",
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
      // console.log(request.params);
      // console.log(request.body);
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

// const sortColumn = sort.split(" ")[0];
// let sortType = sort.split(" ")[1];

// if (sortType.toLowerCase() === "asc") {
// sortType = true;
// } else {
// sortType = false
// }
/* const day = new Date("dari postman");
const nextDay = new Date(new Date(day).setDate(day.getDate() + 1)); 
default nya gimana yang search by dateTimeShow?
datanya bakal ketampil semua */
