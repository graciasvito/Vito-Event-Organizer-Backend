/* eslint-disable no-console */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const bodyParser = require("body-parser");

// const admin = require("firebase-admin");
const routerNavigation = require("./src/routes"); // ./routes/index.js

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get("/greetings", (request, response) => {
//   response.status(200).send("Hello World!");
// });

app.use("/api", routerNavigation);

app.use("/*", (req, res) => {
  res.status(404).send("Path Not Found !");
});

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});

// const serviceAccount = require("./vito-event-organizing-firebase-adminsdk-qww8v-03f787792a.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// app.post("/payment", (req, res) => {
//   const dataUser = {
//     userImage:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhlGt7wy7F7HXycASj8scmRMCoDaElnBa0RA&usqp=CAU",
//     fullName: "Arif Wibowo",
//   };
//   const dataTransaction = {
//     currentBalance: "Rp100.000",
//     amount: "Rp20.000",
//   };

//   const message = {
//     notification: {
//       title: `Payment Successfullt, kamu udah ngirim ke ${dataUser.fullName}`,
//       body: `Kamu ngirim sebesar ${dataTransaction.amount}`,
//     },
//   };

//   admin
//     .messaging()
//     .send(message)
//     .then((response) => {
//       console.log("Successfully sent message:", response);
//     })
//     .catch((error) => {
//       console.log("Error sending message:", error);
//     });
// });
