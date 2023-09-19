const { ENDPOINT } = require("./env");
const { nowInSeconds } = require("./utils");
const axios = require("axios").default;
const {  writeErrorLog } = require("./utils");

let token = '';
let expiresAt = 0;

const  getToken = async () => {
  const now = nowInSeconds();
  if (now < expiresAt- 120) {
    return token;
  }

  const url = `${ENDPOINT}/device/login`;
  try {
    const res = await axios.post(url, { code: "123", secretKey: "15qx8q6qfoj8" })
    token = res.data.token
    expiresAt = now + 30 * 60;
    return token;
  } catch (error) {
    writeErrorLog(error)
  }
}


module.exports = {
  getToken,
};
