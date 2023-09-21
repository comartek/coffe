require("dotenv").config();
const { machineIdSync } = require("node-machine-id");
const jwt = require("jsonwebtoken");

const machineId = machineIdSync();
const buffMachineId = Buffer.from(machineId, "hex");

const VERSION = "0.1";
const SECRET = "omupfsvmek";

const CODE = buffMachineId.toString("base64url");
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
