const { google } = require("googleapis");

const clientId =
  "222047437263-ctgri6imbrq5i1u45lv2250qg60985gd.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken =
  "1//04tvslTZilQ3HCgYIARAAGAQSNwF-L9IrC1_043pQe5U9bQ3oVFoqljsFsq7tOTotOhnYzoCa3oqWh5fhzCJd7P-ZUd96MytaSfw";

const { OAuth2 } = google.auth;
const OAuth2Client = new OAuth2(clientId, clientSecret);
OAuth2Client.setCredentials({
  refresh_token: refreshToken,
});

const accessToken = OAuth2Client.getAccessToken;

module.exports = {
  clientId,
  clientSecret,
  accessToken,
  refreshToken,
};

// const { google } = require("googleapis");

// const clientId = process.env.GOOGLE_CLIENT_ID;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
// const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

// const { OAuth2 } = google.auth;
// const OAuth2Client = new OAuth2(clientId, clientSecret);
// OAuth2Client.setCredentials({ refresh_token: refreshToken });

// const accessToken = OAuth2Client.getAccessToken;

// module.exports = accessToken;
