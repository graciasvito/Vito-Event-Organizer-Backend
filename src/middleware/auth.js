/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const client = require("../config/redis");
const wrapper = require("../utils/wrapper");

module.exports = {
  authentication: async (request, response, next) => {
    try {
      let token = request.headers.authorization;

      if (!token) {
        return wrapper.response(response, 403, "Please Login First", null);
      }

      // eslint-disable-next-line prefer-destructuring
      token = token.split(" ")[1];
      const checkTokenBlacklist = await client.get(`accessToken:${token}`);
      // console.log(checkTokenBlacklist);

      if (checkTokenBlacklist) {
        return wrapper.response(
          response,
          403,
          "Your token is destroyed please login again",
          null
        );
      }

      jwt.verify(token, process.env.ACCESS_KEYS, (error, result) => {
        if (error) {
          return wrapper.response(response, 403, error.message, null);
        }

        // console.log(result);
        // result = {
        //     userId: 'ca2973ed-9414-4135-84ac-799b6602d7b2',
        //     role: 'user',
        //     iat: 1662696652,
        //     exp: 1662783052
        //   }
        request.decodeToken = result;
        next();
      });
    } catch (error) {
      // console.log(error);
    }
  },
  isAdmin: async (request, response, next) => {
    try {
      // PROSES UNTUK PENGECEKAN ROLE
      const result = request.decodeToken;
      if (result.role === "user") {
        return wrapper.response(response, 403, "You're Not Admin", null);
      }
      return next();

      // console.log(request.decodeToken);
    } catch (error) {
      // console.log(error);
    }
  },
};
