const axios = require("axios").default;
const { setStatus } = require("./led-status");

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // log lỗi vào file theo định dạng

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
    if (error.code === 'EAI_AGAIN') {
      setStatus('NO_INTERNET')
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
