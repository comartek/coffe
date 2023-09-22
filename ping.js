const cron = require("node-cron");
const { ENDPOINT } = require("./env");
const { getToken } = require("./token");
const { writeSuccessLog } = require("./utils");
const { setStatus } = require("./led-status");
const { get } = require("./api");

let deviceStatus = "";
let vnPayStatus = "";

const pingStatus = async () => {
  const url = `${ENDPOINT}/device/ping`;
  const res = await get(url);
  if (res.data) {
    return {
      vnPayStatus: res.data.vnpayStatus,
      deviceStatus: res.data.status,
    };
  }
};

cron
  .schedule("*/5 * * * * *", async () => {
    try {
      console.log("start");
      const data = await pingStatus();
      deviceStatus = data.deviceStatus;
      vnPayStatus = data.vnPayStatus;

      if (data) {
        writeSuccessLog(`Status: ${deviceStatus} VnPayStatus: ${vnPayStatus} `);
      }

      if (vnPayStatus === "ERROR") {
        setStatus("ERROR");
      } else if (deviceStatus === "INACTIVE") {
        setStatus("INACTIVE");
      } else {
        setStatus("OK");
      }
    } catch (error) {
      console.log(error);
    }
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
