const { google } = require("googleapis");

const clientId =
  "222047437263-ctgri6imbrq5i1u45lv2250qg60985gd.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken =
  "1//045jwhnROll1iCgYIARAAGAQSNwF-L9Ir5kIHby1Qrp_ZxbxIIAMT-Z5j_kPWDCSP4OY8Flpd6AcJrsomT8wBuda3Oaz9f5iArSs";

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(clientId, clientSecret);
OAuth2Client.setCredentials({ refresh_token: refreshToken });

const accessToken = OAuth2Client.getAccessToken;

module.exports = {
  clientId,
  clientSecret,
  accessToken,
  refreshToken,
};
