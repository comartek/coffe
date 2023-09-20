const cron = require("node-cron");
const axios = require("axios").default;
const { ENDPOINT } = require("./env");
const { getToken } = require("./token");
const { writeErrorLog, writeSuccessLog } = require("./utils");
const { setStatus } = require('./led-status')

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

    const res = await axios.request(config);
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
      const data = await pingStatus();
      deviceStatus = data.deviceStatus;
      vnPayStatus = data.vnPayStatus;

      if (data) {
        writeSuccessLog(
          `Status: ${deviceStatus} VnPayStatus: ${vnPayStatus} `
          );
      }
      if (vnPayStatus === 'ERROR') {
        setStatus('ERROR')
      } else if (deviceStatus === 'INACTIVE') {
        setStatus('INACTIVE')
      }else  {
        setStatus('OK')
      }
    } catch (error) {
      if(error.code !== 'EAI_AGAIN'){
        setStatus('ERROR')
      }
      writeErrorLog(
        `Code: ${error?.response?.data?.statusCode} Message: ${error?.response?.data?.message}`
      );
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
