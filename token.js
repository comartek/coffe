const { ENDPOINT, CODE, FUNC_KEY, VERSION } = require("./env");
const axios = require("axios").default;

const getToken = async () => {
  const url = `${ENDPOINT}/device/v1/login`;
  const res = await axios.post(url, {
    code: CODE,
    key: FUNC_KEY(),
    version: VERSION,
  });

  return res.data.token;
};

module.exports = {
  getToken,
};
