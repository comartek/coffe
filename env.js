require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getDeviceCode } = require("./make-device-code");

const VERSION = "0.1";
const SECRET = "omupfsvmek";

const CODE = getDeviceCode();

const FUNC_KEY = () => jwt.sign(
  {
    code: CODE,
  },
  SECRET,
  {
    expiresIn: 50,
  }
);

const ENDPOINT = "https://api-cafe.viziple.com";
const REQUEST_TIMEOUT = 3000;
const TIMEOUT_TO_DELAY_WHEN_ERROR = 500;
const TIMEOUT_TO_DELAY_WHEN_INACTIVE = 250;

module.exports = {
  VERSION,
  ENDPOINT,
  REQUEST_TIMEOUT,
  TIMEOUT_TO_DELAY_WHEN_INACTIVE,
  TIMEOUT_TO_DELAY_WHEN_ERROR,
  FUNC_KEY,
  CODE,
};
