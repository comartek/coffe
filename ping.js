const cron = require("node-cron");
const axios = require("axios").default;
const { ENDPOINT } = require("./env");
const { getToken } = require("./token");
const { writeErrorLog, writeSuccessLog } = require("./utils");

let deviceStatus = "";
let vnPayStatus = "";

const pingStatus = async () => {
  const token = await getToken();
  if (!token) return;

  const url = `${ENDPOINT}/device/ping`;
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await axios.request(config);
    if (res.data) {
      writeSuccessLog(
        `Status: ${res.data.status} VnPayStatus: ${res.data.vnpayStatus} `
      );
      return {
        vnPayStatus: res.data.vnpayStatus,
        deviceStatus: res.data.status,
      };
    }
  } catch (error) {
    writeErrorLog(
      `Code: ${error.response.data.statusCode} Message: ${error.response.data.message}`
    );
  }
};

cron
  .schedule("*/5 * * * * *", async () => {
    console.log("start ping x");
    const data = await pingStatus();
    deviceStatus = data.deviceStatus;
    vnPayStatus = data.vnPayStatus;
    console.log("PING:", deviceStatus, vnPayStatus);
  })
  .start();

const getPingStatus = () => {
  return {
    deviceStatus,
    vnPayStatus,
  };
};

module.exports = {
  getPingStatus,
};
