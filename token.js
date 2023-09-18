const { ENDPOINT } = require("./env");
const axios = require("axios").default;


const  getToken = async () => {
  const url = `${ENDPOINT}/device/login`;
  return await axios.post(url, { code: "123", secretKey: "15qx8q6qfoj8" })
}


module.exports = {
  getToken,
};
