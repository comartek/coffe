const axios = require("axios").default;
const { setStatus } = require("./led-status");
const { writeErrorLog } = require("./utils");

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // log lỗi vào file theo định dạng
    setStatus('ERROR');
    writeErrorLog(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    writeErrorLog(error);
    if (error.code === 'EAI_AGAIN') {
      setStatus('NO_INTERNET')
    } else {
      setStatus('ERROR')
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
