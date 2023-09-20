const { ENDPOINT, CODE, SCRETKEY } = require("./env");
const { nowInSeconds } = require("./utils");
const axios = require("axios").default;

let token = "";
let expiresAt = 0;

const getToken = async () => {
  const now = nowInSeconds();
  if (now < expiresAt - 120) {
    return token;
  }

  const url = `${ENDPOINT}/device/login`;

    const res = await axios.post(url, {
      code: CODE,
      secretKey: SCRETKEY,
    });
    token = res.data.token;
    expiresAt = now + 30 * 60;
    return token;
};

module.exports = {
  getToken,
};
