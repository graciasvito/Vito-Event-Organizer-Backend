const { google } = require("googleapis");

const clientId =
  "222047437263-ctgri6imbrq5i1u45lv2250qg60985gd.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken =
  "1//04N1DWXsLAHetCgYIARAAGAQSNwF-L9IrH5NSM5Vb2C52Xhtg2-b1svQbqgv0vFWPB3N3BedS3ABEXPPx97IniPDVR-8Kopw6KtI";

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
