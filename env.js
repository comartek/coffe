require("dotenv").config();

const ENDPOINT = process.env.ENDPOINT;
const REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT;

module.exports = {
  ENDPOINT,
  REQUEST_TIMEOUT,
};
