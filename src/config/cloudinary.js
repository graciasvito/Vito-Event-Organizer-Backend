const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "du0sbrocy",
  api_key: "542989884156812",
  api_secret: "7HkvjR3ax4ddAtUBghx6-Ox5Dms",
  secure: true,
});

module.exports = cloudinary;
