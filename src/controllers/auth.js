const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authModel = require("../models/auth");
const wrapper = require("../utils/wrapper");
const client = require("../config/redis");
const userModel = require("../models/user");

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
      };
      if (checkEmail.data.length > 0) {
        return wrapper.response(
          response,
          400,
          "Email is Already Registered",
          null
        );
      }
      const result = await userModel.createUser(setData);
      // store hash in the database
      // console.log(setData);
      return wrapper.response(response, result.status, "Success Create Data", {
        userId: result.data[0].userId,
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

  // PROSES PENGECEKAN APAKAH EMAIL YANG MAU DI DAFTARKAN SUDAH ADA ATAU BELUM ?

  // PROSES MENYIMPAN DATA KE DATABASE LEWAT MODEL

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

      const token = jwt.sign(payload, "RAHASIA", { expiresIn: "24h" });
      // 4. PROSES REPON KE USER
      bcrypt.compare(password, checkEmail.data[0].password, (err, same) => {
        if (same) {
          return wrapper.response(response, 200, "Success Login", {
            userId: payload.userId,
            token,
          });
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
      token = token.split(" ")[1];
      client.setEx(`accessToken:${token}`, 3600 * 48, token);
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
};
