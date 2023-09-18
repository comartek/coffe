const cron = require("node-cron");
const axios = require("axios").default;
const { ENDPOINT } = require("./env");

let deviceStatus = "";
let vnPayStatus = "";

const getStatus = (accessToken) => {
  cron.schedule("*/1 * * * * *", () => {
    const url = `${ENDPOINT}/device/ping`;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    };

    axios
      .request(config)
      .then((res) => {
        console.log('ressssssssssss', res)
        vnPayStatus = res.data.vnpayStatus;
        deviceStatus = res.data.status;
      })
      .catch((ers) => {
        console.log("GLOBAL ERROR", ers);
      });
  });
};

module.exports = {
  getStatus,
};
