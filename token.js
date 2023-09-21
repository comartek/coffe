const { ENDPOINT, CODE, FUNC_KEY, VERSION } = require("./env");
const { nowInSeconds } = require("./utils");
const axios = require("axios").default;

let token = "";
let expiresAt = 0;

const getToken = async () => {
  const now = nowInSeconds();
  if (now < expiresAt - 120) {
    return token;
  }

  const url = `${ENDPOINT}/device/v1/login`;
  const res = await axios.post(url, {
    code: CODE,
    key: FUNC_KEY(),
    version: VERSION,
  });

  token = res.data.token;
  expiresAt = now + 30 * 60;
  return token;
};

module.exports = {
  getToken,
};
