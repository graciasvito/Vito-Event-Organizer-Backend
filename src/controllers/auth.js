/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");
const client = require("../config/redis");
const userModel = require("../models/user");
// const gmail = require("../config/gmail");
const { sendMail } = require("../utils/mail");

module.exports = {
  register: async (request, response) => {
    try {
      const { username, email, password } = request.body;
      const checkEmail = await authModel.getUserByEmail(email);
      const hashedPassword = await bcrypt.hash(password, 10);
      const setData = {
        username,
        email,
        password: hashedPassword,
        role: "user",
        statusUser: "Unverified",
      };

      // checking email in database
      if (
        checkEmail.data.length > 0 &&
        checkEmail.data[0].statusUser === "Unverified"
      ) {
        return wrapper.response(
          response,
          400,
          "Email is not verified, please check your email !",
          null
        );
      }
      if (checkEmail.data.length > 0) {
        return wrapper.response(
          response,
          400,
          "Email is Already Registered",
          null
        );
      }
      // save data by model
      const result = await userModel.createUser(setData);

      // create otp
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      const { userId } = result.data[0];
      // mailing
      const setMailOptions = {
        to: email,
        name: username,
        subject: "Email Verification !",
        otp,
        template: "verificationEmail.html",
        buttonUrl: `https://vito-event-organizer-backend.vercel.app/api/auth/verify/${otp}`,
      };
      // save otp in redis
      await client.setEx(`otp:${otp}`, 3600, userId);

      await sendMail(setMailOptions);

      return wrapper.response(
        response,
        200,
        "Success Register Please Check Your Email",
        { userId: result.data[0].userId }
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
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      // check email in database
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.data.length < 1) {
        return wrapper.response(response, 404, "Email Not Registed", null);
      }

      const payload = {
        userId: checkEmail.data[0].userId,
        role: !checkEmail.data[0].role ? "user" : checkEmail.data[0].role,
      };

      const token = jwt.sign(payload, process.env.ACCESS_KEYS, {
        expiresIn: "12h",
      });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_KEYS, {
        expiresIn: "24h",
      });
      // response to user
      const newResult = {
        userId: payload.userId,
        token,
        refreshToken,
      };
      // compare input password with password in database
      bcrypt.compare(password, checkEmail.data[0].password, (err, same) => {
        if (same) {
          return wrapper.response(response, 200, "Success Login", newResult);
        }
        return wrapper.response(response, 400, "Wrong Password", null);
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
  logout: async (request, response) => {
    try {
      const token = request.headers.authorization;
      const { refreshtoken } = request.headers;

      token.split(" ")[1] = token;

      client.setEx(`accessToken:${token.split(" ")[1]}`, 3600 * 24, token);
      client.setEx(`refreshToken:${refreshtoken}`, 3600 * 24, refreshtoken);

      return wrapper.response(response, 200, "Success Logout", null);
    } catch (error) {
      const {
        status = 500,
        statusText = "Internal Server Error",
        error: errorData = null,
      } = error;
      return wrapper.response(response, status, statusText, errorData);
    }
  },
  refresh: async (request, response) => {
    try {
      const { refreshtoken } = request.headers;

      if (!refreshtoken) {
        return wrapper.response(response, 400, "Refresh Token Must Be Filled");
      }

      const checkTokenBlacklist = await client.get(
        `refreshToken:${refreshtoken}`
      );

      if (checkTokenBlacklist) {
        return wrapper.response(
          response,
          403,
          "Your token is destroyed please login again",
          null
        );
      }

      let payload;
      let token;
      let newRefreshToken;

      jwt.verify(refreshtoken, process.env.REFRESH_KEYS, (error, result) => {
        if (error) {
          return wrapper.response(response, 403, error.message, null);
        }
        payload = {
          userId: result.userId,
          role: result.role,
        };
        token = jwt.sign(payload, process.env.ACCESS_KEYS, {
          expiresIn: "12h",
        });
        newRefreshToken = jwt.sign(payload, process.env.REFRESH_KEYS, {
          expiresIn: "36h",
        });
        client.setEx(`refreshToken:${refreshtoken}`, 3600 * 36, refreshtoken);
      });

      return wrapper.response(response, 200, "Success Refresh Token", {
        userId: payload.userId,
        token,
        refreshToken: newRefreshToken,
      });
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
  verify: async (request, response) => {
    try {
      const { otp } = request.params;

      const checkOTP = await client.get(`otp:${otp}`);

      if (!checkOTP) {
        return wrapper.response(response, 403, "Wrong OTP", null);
      }
      const setData = {
        statusUser: "Verified",
      };
      const result = await userModel.updateUser(checkOTP, setData);

      client.del(`otp:${otp}`);
      return wrapper.response(
        response,
        result.status,
        "Success Verified, Please Login",
        { userId: checkOTP }
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
};
