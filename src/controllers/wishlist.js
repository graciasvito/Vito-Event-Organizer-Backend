const { request } = require("express");
const wishlistModel = require("../models/wishlist");
const wrapper = require("../utils/wrapper");
const userModel = require("../models/user");

module.exports = {
  getAllWishlist: async (request, response) => {
    try {
      // console.log(request.query);
      let { page, limit, userId } = request.query;
      page = +page;
      limit = +limit;

      const checkId = await userModel.getUserById(userId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }
      const totalData = await wishlistModel.getCountWishlist();
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        // page, totalPage, limit, totalData
        page,
        totalPage,
        limit,
        totalData,
      };
      const offset = page * limit - limit;

      const result = await wishlistModel.getAllWishlist(offset, limit, userId);
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
  createWishlist: async (request, response) => {
    try {
      // console.log(request.body);
      const { eventId, userId } = request.body;
      const setData = {
        eventId,
        userId,
      };

      const result = await wishlistModel.createWishlist(setData);

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
  getWishlistById: async (request, response) => {
    try {
      const { wishlistId } = request.params;

      const result = await wishlistModel.getWishlistById(wishlistId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${wishlistId} Not Found`,
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
  deleteWishlist: async (request, response) => {
    try {
      const { wishlistId } = request.params;

      const checkId = await wishlistModel.getWishlistById(wishlistId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${wishlistId} Not Found`,
          []
        );
      }
      const result = await wishlistModel.deleteWishlist(wishlistId);

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
  getWishlistByUserId: async (request, response) => {
    try {
      const { userId } = request.params;

      const result = await wishlistModel.getWishlistByUserId(userId);

      if (result.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }

      return wrapper.response(
        response,
        result.status,
        "Success Get Data By UserId",
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
