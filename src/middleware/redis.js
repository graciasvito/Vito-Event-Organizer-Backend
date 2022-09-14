const client = require("../config/redis");

const wrapper = require("../utils/wrapper");

module.exports = {
  getProductById: async (request, response, next) => {
    try {
      const { id } = request.params;
      let result = await client.get(`getProduct:${id}`);
      if (result !== null) {
        console.log("DATA ADA DI DALAM REDIS");
        result = JSON.parse(result);
        return wrapper.response(
          response,
          200,
          "Success Get Data by Id",
          result
        );
      }
      console.log("DATA TIDAK ADA DI DALAM REDIS");
      return next();
    } catch (error) {
      return wrapper.response(response, 400, error.message, null);
    }
  },
  getAllProduct: async (request, response, next) => {
    try {
      let result = await client.get(
        `getProduct:${JSON.stringify(request.query)}`
      );
      if (result !== null) {
        result = JSON.parse(result);
        return wrapper.response(
          response,
          200,
          "Success Get Data !",
          result.result,
          result.pagination
        );
      }
      return next();
    } catch (error) {
      return wrapper.response(response, 400, error.message, null);
    }
  },
  clearProduct: async (request, response, next) => {
    try {
      const keys = await client.keys("getProduct:*");
      if (keys.length > 0) {
        keys.forEach(async (element) => {
          await client.del(element);
        });
      }
      return next();
    } catch (error) {
      return wrapper.response(response, 400, error.message, null);
    }
  },
  getAllEvent: async (request, response, next) => {
    try {
      let result = await client.get(
        `getEvent:${JSON.stringify(request.query)}`
      );
      if (result !== null) {
        result = JSON.parse(result);
        return wrapper.response(
          response,
          200,
          "Success Get Data !",
          result.result,
          result.pagination
        );
      }
      return next();
    } catch (error) {
      return wrapper.response(response, 400, error.message, null);
    }
  },
  getEventById: async (request, response, next) => {
    try {
      const { eventId } = request.params;
      let result = await client.get(`getEvent:${eventId}`);
      if (result !== null) {
        result = JSON.parse(result);
        return wrapper.response(
          response,
          200,
          "Success Get Data by Id",
          result
        );
      }

      return next();
    } catch (error) {
      return wrapper.response(response, 400, error.message, null);
    }
  },
  clearEvent: async (request, response, next) => {
    try {
      const keys = await client.keys("getEvent:*");
      if (keys.length > 0) {
        keys.forEach(async (element) => {
          await client.del(element);
        });
      }
      return next();
    } catch (error) {
      return wrapper.response(response, 400, error.message, null);
    }
  },
};

// const client = require("../config/redis");
// const wrapper = require("../utils/wrapper");

// module.exports = {
//   getProductById: async (request, response, next) => {
//     try {
//       const { id } = request.params;
//       let result = await client.get(`getProduct:${id}`);
//       if (result !== null) {
//         // console.log("DATA ADA DIDALAM REDIS");
//         result = JSON.parse(result);
//         return wrapper.response(
//           response,
//           200,
//           "Success Get Data By Id",
//           result
//         );
//       }
//       //   console.log("DATA TIDAK ADA DI DALAM REDIS");
//       return next();
//     } catch (error) {
//       return wrapper.response(response, 400, error.message, null);
//     }
//   },
//   getAllProduct: async (request, response, next) => {
//     try {
//       let result = await client.get(
//         `getProduct:${JSON.stringify(request.query)}`
//       );
//       if (result !== null) {
//         // console.log("DATA ADA DIDALAM REDIS");
//         result = JSON.parse(result);
//         return wrapper.response(
//           response,
//           200,
//           "Success Get Data !",
//           result.result,
//           result.pagination
//         );
//       }
//       //   console.log("DATA TIDAK ADA DIDALAM REDIS");
//       return next();
//     } catch (error) {
//       return wrapper.response(response, 400, error.message, null);
//     }
//   },
//   clearProduct: async (request, response, next) => {
//     try {
//       const keys = await client.keys("getProduct:*");
//       if (keys.length > 0) {
//         keys.forEach(async (element) => {
//           await client.del(element);
//         });
//       }
//       return next();
//     } catch (error) {
//       return wrapper.response(response, 400, error.message, null);
//     }
//   },
// };
