const bcrypt = require("bcrypt");
const userModel = require("../models/user");
// const { response } = require("../utils/wrapper");
const wrapper = require("../utils/wrapper");
const cloudinary = require("../config/cloudinary");

module.exports = {
  getAllUser: async (request, response) => {
    try {
      const result = await userModel.getAllUser();
      delete result.data[0].password;
      delete result.data[0].email;
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
      delete result.data[0].password;
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
      const {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        role,
      } = request.body;

      const checkId = await userModel.getUserById(userId);

      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }
      const today = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });

      const setData = {
        name,
        username,
        gender,
        profession,
        nationality,
        dateOfBirth,
        role,
        updatedAt: today,
      };

      const result = await userModel.updateUser(userId, setData);
      delete result.data[0].password;
      delete result.data[0].email;
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
      cloudinary.uploader.destroy(checkId.data[0].image, (result) => result);
      const result = await userModel.deleteUser(userId);

      delete result.data[0].password;
      delete result.data[0].email;
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
      const checkId = await userModel.getUserById(userId);
      if (checkId.data.length < 1) {
        return wrapper.response(
          response,
          404,
          `Data By Id ${userId} Not Found`,
          []
        );
      }
      if (!request.file) {
        return wrapper.response(response, 400, "image must be filled", null);
      }
      const { filename } = request.file;
      const today = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });
      const setData = {
        image: filename || "",
        // createdAt,
        updatedAt: today,
      };
      cloudinary.uploader.destroy(checkId.data[0].image, (result) => result);
      const result = await userModel.updateImageUser(userId, setData);
      // console.log(result);
      const dataSet = result.data.map(({ image, createdAt, updatedAt }) => ({
        userId,
        image,
        createdAt,
        updatedAt,
      }));
      return wrapper.response(
        response,
        result.status,
        "Success Update Image",
        dataSet
        // {
        //   userId,
        //   image: setData.image,
        //   // createdAt: setData.createdAt,
        //   // updatedAt: setData.updatedAt,
        // }
      );
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      // console.log(error);
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
          return wrapper.response(response, 400, "Wrong Old Password", null);
        }
      });
      const today = new Date().toISOString();
      const setData = {
        userId,
        updatedAt: today,
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
