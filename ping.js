const cron = require("node-cron");
const axios = require("axios").default;
const { ENDPOINT } = require("./env");
const { getToken } = require("./token");

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
  return {
    vnPayStatus: res.data.vnpayStatus,
    deviceStatus: res.data.status,
  };
};

cron
  .schedule("* * * * * *", async () => {
    console.log("start ping");
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
