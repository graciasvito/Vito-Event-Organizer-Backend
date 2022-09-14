const express = require("express");

const Router = express.Router();

const productController = require("../controllers/product");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/uploadFile");
const redisMiddleware = require("../middleware/redis");

// Router.get("/greetings", async (request, response) => {
// try {
//     response.status(200).send("Hello World!");
// } catch (error) {
//     console.log(error)
// }
// });

Router.get("/greetings", productController.showGreetings);
// Path Create
// Path Read
// Path Update
// Path Delete
Router.get(
  "/",
  authMiddleware.authentication,
  authMiddleware.isAdmin,
  redisMiddleware.getAllProduct,
  productController.getAllProduct
);
Router.get(
  "/:id",
  redisMiddleware.getProductById,
  productController.getProductById
);
Router.post(
  "/create",
  uploadMiddleware.uploadProduct,
  redisMiddleware.clearProduct,
  productController.createProduct
);
Router.patch(
  "/:id",
  redisMiddleware.clearProduct,
  productController.updateProduct
);
Router.delete(
  "/:id",
  redisMiddleware.clearProduct,
  productController.deleteProduct
);

module.exports = Router;
