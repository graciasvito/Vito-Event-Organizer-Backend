require("dotenv").config();
const redis = require("redis");

const redisPassword = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

const client = redis.createClient({
  url: `redis://:${redisPassword}@${redisHost}:${redisPort}`,
});

(async () => {
  client.connect();
  client.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("You're connected db redis ...");
  });
})();

module.exports = client;

// const client = redis.createClient({
//   socket: {
//     host: redisHost,
//     port: redisPort,
//   },
//   password: redisPassword,
// });

// (async () => {
//   client.connect();
//   client.on("connect", () => {
//     // eslint-disable-next-line no-console
//     console.log("You're connected db redis ...");
//   });
// })();

// module.exports = client;
// rdcli -h <host> -a <password> -p <port>
// rdcli -h redis-19513.c16.us-east-1-2.ec2.cloud.redislabs.com -a yd8rIOnYFwVW3TXLCQAvQcjVDCWmsZRc -p 19513
