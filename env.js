require("dotenv").config();

const POINT_OF_SALE = process.env.POINT_OF_SALE;
const ENDPOINT = process.env.ENDPOINT;
const REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT;

module.exports = {
  POINT_OF_SALE,
  ENDPOINT,
  REQUEST_TIMEOUT,
};
