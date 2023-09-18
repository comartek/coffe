const cron = require("node-cron");
const axios = require("axios").default;
const { ENDPOINT } = require("./env");
const {getToken} = require("./token")

let deviceStatus = "";
let vnPayStatus = "";

const pingStatus = async () => {
  const tokenData = await getToken();
    const url = `${ENDPOINT}/device/ping`;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Authorization': `Bearer ${tokenData.data.token}`,
      },
    };

    return axios
      .request(config)
      .then((res) => {
        return {
          vnPayStatus: res.data.vnpayStatus,
          deviceStatus: res.data.status
        }
      })
      .catch((ers) => {
        console.log("GLOBAL ERROR", ers);
        return null
      });
  // });
}

module.exports = {
  pingStatus
}

