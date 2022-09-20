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
  showGreetings: async (request, response) => {
    try {
      // return response.status(200).send("Hello World!");
      return wrapper.response(
        response,
        200,
        "Success Get Greetings",
        "Hello World !"
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
  register: async (request, response) => {
    try {
      const { username, email, password } = request.body;
      const checkEmail = await authModel.getUserByEmail(email);
      const hashedPassword = await bcrypt.hash(password, 10);
      const setData = {
        username,
        email,
        password: hashedPassword, // UNTUK PASSWORD BISA DI ENKRIPSI
        role: "user",
        statusUser: "Unverified",
      };
      // console.log(checkEmail);

      // PROSES PENGECEKAN APAKAH EMAIL YANG MAU DI DAFTARKAN SUDAH ADA ATAU BELUM ?
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
      // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL
      const result = await userModel.createUser(setData);
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      // console.log(otp);
      const setMailOptions = {
        to: email,
        name: username,
        subject: "Email Verification !",
        otp,
        template: "verificationEmail.html",
        buttonUrl: "http://localhost:3001/api/auth/verif/123456",
      };

      await sendMail(setMailOptions);
      client.setEx(`otp:${(otp, result.data[0].userId)}`, 3600, {
        result: result.data,
      });
      return wrapper.response(
        response,
        200,
        "Success Register Please Check Your Email",
        { userId: result.data[0].userId }
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
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      // 1. PROSES PENGECEKAN EMAIL
      const checkEmail = await authModel.getUserByEmail(email);
      if (checkEmail.data.length < 1) {
        return wrapper.response(response, 404, "Email Not Registed", null);
      }

      // 2. PROSES PENCOCOKAN PASSWORD
      // if (password !== checkEmail.data[0].password) {
      // return wrpper.response(response, 400, "Wrong Password", null);
      // }

      // 3. PROSES PEMBUATAN TOKEN JWT
      // PAYLOAD = DATA YANG MAU DISIMPAN/DIJADIKAN TOKEN
      // KEY = KATA KUNCI BISA DI GENERATE ATAU DIBUAT LANGSUNG
      // const payload = checkEmail.data[0];
      // delete payload.password;

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
      // 4. PROSES REPON KE USER
      const newResult = {
        userId: payload.userId,
        token,
        refreshToken,
      };
      bcrypt.compare(password, checkEmail.data[0].password, (err, same) => {
        if (same) {
          return wrapper.response(response, 200, "Success Login", newResult);
          // eslint-disable-next-line no-else-return
        } else {
          // eslint-disable-next-line no-else-return
          wrapper.response(response, 400, "Wrong Password", null);
        }
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
      let token = request.headers.authorization;
      const { refreshtoken } = request.headers;

      // eslint-disable-next-line prefer-destructuring
      token = token.split(" ")[1];
      client.setEx(`accessToken:${token}`, 3600 * 24, token);
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
  // verify: async (request, response) => {
  //   try {
  //     let otp = request.params;
  //     // console.log(otp);
  //     if (!otp) {
  //       return wrapper.response(response, 403, "Please Enter OTP", null);
  //     }

  //     // eslint-disable-next-line prefer-destructuring
  //     otp = Object.keys(otp).map((k) => otp[k])[0];
  //     // console.log(otp);
  //     const checkOTP = await client.get(`otp:${otp}`);

  //     if (checkOTP) {
  //       return wrapper.response(
  //         response,
  //         200,
  //         "Success Verified, Please Login",
  //         null
  //       );
  //     }
  //     // return wrapper.response(
  //     //   response,
  //     //   200,
  //     //   "Success Get Greetings",
  //     //   "Hello World !"
  //     // );
  //     // const checkOtp = await client.get(`otp:${otp}`);

  //     // if (checkOtp) {
  //     //   return wrapper.response(
  //     //     response,
  //     //     200,
  //     //     "Success Verified Email, Please Login !",
  //     //     null
  //     //   );
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //     const {
  //       status = 500,
  //       statusText = "Internal Server Error",
  //       error: errorData = null,
  //     } = error;
  //     return wrapper.response(response, status, statusText, errorData);
  //   }
  // },
};
