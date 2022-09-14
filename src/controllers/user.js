const { request } = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
// const { response } = require("../utils/wrapper");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

module.exports = {
  getAllUser: async (request, response) => {
    try {
      // console.log(request.query);
      const result = await userModel.getAllUser();
      return wrapper.response(
        response,
        result.status,
        "Success Get Data !",
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
  getUserById: async (request, response) => {
    try {
      const { userId } = request.params;

      const result = await userModel.getUserById(userId);

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
  createUser: async (request, response) => {
    try {
      // console.log(request.body);
      const {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        email,
        password,
      } = request.body;
      const setData = {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        email,
        password,
      };

      const result = await userModel.createUser(setData);

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
  updateUser: async (request, response) => {
    try {
      // console.log(request.params);
      // console.log(request.body);
      const { userId } = request.params;
      const { name, username, gender, profession, nationality, dateOfBirth } =
        request.body;

      const checkId = await userModel.getUserById(userId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }

      const setData = {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
      };

      const result = await userModel.updateUser(userId, setData);
      delete result.data.email;
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
  deleteUser: async (request, response) => {
    try {
      const { userId } = request.params;

      const checkId = await userModel.getUserById(userId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }
      const result = await userModel.deleteUser(userId);

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
  updateImageUser: async (request, response) => {
    try {
      // console.log(request.file);
      const { userId } = request.params;
      const { filename } = request.file;
      const checkId = await userModel.getUserById(userId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }

      const setData = {
        image: filename || "",
      };

      const result = await userModel.updateImageUser(userId, setData);
      // console.log(data);
      return wrapper.response(response, result.status, "Success Update Image", {
        userId,
        image: setData.image,
      });
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      console.log(error);
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  updateUserPassword: async (request, response) => {
    try {
      // console.log(request.params);
      // console.log(request.body);
      const { userId } = request.params;
      const { oldPassword, newPassword, confirmPassword } = request.body;

      const checkId = await userModel.getUserById(userId);
      // console.log(checkId);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      if (newPassword !== confirmPassword) {
        return wrapper.response(
          response,
          400,
          "Please Confirm the Correct Password",
          null
        );
      }
      bcrypt.compare(oldPassword, checkId.data[0].password, (error, same) => {
        if (same) {
          return hashedPassword;
        } // eslint-disable-next-line no-else-return
        else {
          // eslint-disable-next-line no-else-return
          wrapper.response(response, 400, "Wrong Old Password", null);
        }
      });
      const setData = {
        userId,
      };

      const result = await userModel.updateUser(userId, setData);

      return wrapper.response(response, result.status, "Success Update Data", {
        userId: setData.userId,
      });
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
