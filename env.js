require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require('fs')
const { getDeviceCode } = require("./make-device-code");

const pjson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

const VERSION = pjson.version;
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

const ENDPOINT = "https://api-cafe-dev.viziple.com";
// const ENDPOINT = "http://localhost:3456";
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
