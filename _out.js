var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// utils.js
var require_utils = __commonJS({
  "utils.js"(exports, module2) {
    var fs = require("fs");
    var { join } = require("path");
    var dayjs = require("dayjs");
    var delayMs = (ms = 1e3) => {
      return new Promise((rs) => {
        setTimeout(() => {
          rs({});
        }, ms);
      });
    };
    var nowInSeconds = () => {
      return Math.round(Date.now() / 1e3);
    };
    var floorAmountBy1K = (amount) => {
      return Math.floor(amount / 1e3);
    };
    var writeErrorLog = (log) => {
      const time = dayjs().format("DD-MM-YYYY HH:mm:ss");
      const pathToLogFile = join(
        process.cwd(),
        `logs/${dayjs().format("DDMMYYYY")}.error.log`
      );
      fs.appendFileSync(pathToLogFile, `${time} ${log}\r
`);
    };
    var writeSuccessLog = (log) => {
      const time = dayjs().format("DD-MM-YYYY HH:mm:ss");
      const pathToLogFile = join(
        process.cwd(),
        `logs/${dayjs().format("DDMMYYYY")}.log`
      );
      fs.appendFileSync(pathToLogFile, `${time} ${log}\r
`);
    };
    module2.exports = {
      delayMs,
      nowInSeconds,
      floorAmountBy1K,
      writeErrorLog,
      writeSuccessLog
    };
  }
});

// env.js
var require_env = __commonJS({
  "env.js"(exports, module2) {
    require("dotenv").config();
    var ENDPOINT = process.env.ENDPOINT;
    var CODE = process.env.CODE;
    var SCRETKEY = process.env.SCRETKEY;
    var REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT;
    var TIMEOUT_TO_DELAY_WHEN_INACTIVE = +process.env.TIMEOUT_TO_DELAY_WHEN_INACTIVE;
    var TIMEOUT_TO_DELAY_WHEN_ERROR = +process.env.TIMEOUT_TO_DELAY_WHEN_ERROR;
    module2.exports = {
      ENDPOINT,
      REQUEST_TIMEOUT,
      TIMEOUT_TO_DELAY_WHEN_INACTIVE,
      TIMEOUT_TO_DELAY_WHEN_ERROR,
      SCRETKEY,
      CODE
    };
  }
});

// led-status.js
var require_led_status = __commonJS({
  "led-status.js"(exports, module2) {
    var rpio = require("rpio");
    var { delayMs } = require_utils();
    var { TIMEOUT_TO_DELAY_WHEN_ERROR, TIMEOUT_TO_DELAY_WHEN_INACTIVE } = require_env();
    var _status = "NO_INTERNET";
    var PIN_RED = 16;
    var PIN_GREEN = 18;
    rpio.open(PIN_RED, rpio.OUTPUT, rpio.HIGH);
    rpio.open(PIN_GREEN, rpio.OUTPUT, rpio.HIGH);
    var run = async () => {
      while (1) {
        console.log("while status", _status);
        switch (_status) {
          case "NO_INTERNET":
            rpio.open(PIN_GREEN, rpio.OUTPUT, rpio.HIGH);
            rpio.open(PIN_RED, rpio.OUTPUT, rpio.HIGH);
            await delayMs(TIMEOUT_TO_DELAY_WHEN_ERROR);
            rpio.open(PIN_GREEN, rpio.OUTPUT, rpio.LOW);
            rpio.open(PIN_RED, rpio.OUTPUT, rpio.LOW);
            await delayMs(TIMEOUT_TO_DELAY_WHEN_ERROR);
            break;
          case "OK":
            rpio.open(PIN_GREEN, rpio.OUTPUT, rpio.HIGH);
            rpio.mode(PIN_RED, rpio.OUTPUT, rpio.LOW);
            await delayMs(TIMEOUT_TO_DELAY_WHEN_ERROR);
            break;
          case "ERROR":
            rpio.open(PIN_RED, rpio.OUTPUT, rpio.HIGH);
            rpio.mode(PIN_GREEN, rpio.OUTPUT, rpio.LOW);
            await delayMs(TIMEOUT_TO_DELAY_WHEN_ERROR);
            rpio.open(PIN_RED, rpio.OUTPUT, rpio.LOW);
            await delayMs(TIMEOUT_TO_DELAY_WHEN_ERROR);
            break;
          case "INACTIVE":
            rpio.open(PIN_RED, rpio.OUTPUT, rpio.HIGH);
            rpio.mode(PIN_GREEN, rpio.OUTPUT, rpio.LOW);
            await delayMs(TIMEOUT_TO_DELAY_WHEN_INACTIVE);
            rpio.open(PIN_RED, rpio.OUTPUT, rpio.LOW);
            await delayMs(TIMEOUT_TO_DELAY_WHEN_INACTIVE);
            break;
        }
      }
    };
    run();
    var setStatus = (status) => {
      console.log("status", status);
      _status = status;
    };
    module2.exports = {
      setStatus
    };
  }
});

// request-logger.js
var require_request_logger = __commonJS({
  "request-logger.js"() {
    var axios = require("axios").default;
    var { setStatus } = require_led_status();
    axios.interceptors.request.use(
      function(config) {
        return config;
      },
      function(error) {
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        if (error.code === "EAI_AGAIN") {
          setStatus("NO_INTERNET");
        }
        return Promise.reject(error);
      }
    );
  }
});

// token.js
var require_token = __commonJS({
  "token.js"(exports, module2) {
    var { ENDPOINT, CODE, SCRETKEY } = require_env();
    var { nowInSeconds } = require_utils();
    var axios = require("axios").default;
    var token = "";
    var expiresAt = 0;
    var getToken = async () => {
      const now = nowInSeconds();
      if (now < expiresAt - 120) {
        return token;
      }
      const url = `${ENDPOINT}/device/login`;
      const res = await axios.post(url, {
        code: CODE,
        secretKey: SCRETKEY
      });
      token = res.data.token;
      expiresAt = now + 30 * 60;
      return token;
    };
    module2.exports = {
      getToken
    };
  }
});

// ping.js
var require_ping = __commonJS({
  "ping.js"(exports, module2) {
    var cron = require("node-cron");
    var axios = require("axios").default;
    var { ENDPOINT } = require_env();
    var { getToken } = require_token();
    var { writeErrorLog, writeSuccessLog } = require_utils();
    var { setStatus } = require_led_status();
    var deviceStatus = "";
    var vnPayStatus = "";
    var pingStatus = async () => {
      const token = await getToken();
      if (!token)
        return;
      const url = `${ENDPOINT}/device/ping`;
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const res = await axios.request(config);
      if (res.data) {
        return {
          vnPayStatus: res.data.vnpayStatus,
          deviceStatus: res.data.status
        };
      }
    };
    cron.schedule("*/5 * * * * *", async () => {
      try {
        const data = await pingStatus();
        deviceStatus = data.deviceStatus;
        vnPayStatus = data.vnPayStatus;
        if (data) {
          writeSuccessLog(
            `Status: ${deviceStatus} VnPayStatus: ${vnPayStatus} `
          );
        }
        if (vnPayStatus === "ERROR") {
          setStatus("ERROR");
        } else if (deviceStatus === "INACTIVE") {
          setStatus("INACTIVE");
        } else {
          setStatus("OK");
        }
      } catch (error) {
        if (error.code !== "EAI_AGAIN") {
          setStatus("ERROR");
        }
        writeErrorLog(
          `Code: ${error?.response?.data?.statusCode} Message: ${error?.response?.data?.message}`
        );
      }
    }).start();
    var getPingStatus = () => {
      return {
        deviceStatus,
        vnPayStatus
      };
    };
    module2.exports = {
      getPingStatus
    };
  }
});

// device.js
var require_device = __commonJS({
  "device.js"(exports, module2) {
    var rpio = require("rpio");
    var PIN = 12;
    var PULSE_WIDTH = 25;
    var TIMEOUT_TO_END_COMMAND = PULSE_WIDTH * 10;
    rpio.open(PIN, rpio.OUTPUT, rpio.LOW);
    var sendStatusSignal = (status) => {
      console.log("Device status", status);
    };
    var sendMoneySignal = async (val) => {
      console.log("val=>>>>>>>>>>>>>>>>>>>", val);
      rpio.mode(PIN, rpio.OUTPUT);
      rpio.msleep(TIMEOUT_TO_END_COMMAND);
      for (let i = 0; i < val; i++) {
        rpio.open(PIN, rpio.OUTPUT, rpio.LOW);
        rpio.msleep(PULSE_WIDTH * 4);
        rpio.open(PIN, rpio.OUTPUT, rpio.HIGH);
        rpio.msleep(PULSE_WIDTH);
      }
      rpio.open(PIN, rpio.OUTPUT, rpio.LOW);
      rpio.msleep(TIMEOUT_TO_END_COMMAND);
      rpio.mode(PIN, rpio.INPUT, rpio.PULL_OFF);
    };
    sendMoneySignal(20);
    module2.exports = {
      sendMoneySignal,
      sendStatusSignal
    };
  }
});

// constants.js
var require_constants = __commonJS({
  "constants.js"(exports, module2) {
    var DEVICE_STATUS = {
      OK: "OK",
      NO_INTERNET: "NO_INTERNET",
      ERROR: "ERROR"
    };
    module2.exports = {
      DEVICE_STATUS
    };
  }
});

// handle-payment.js
var require_handle_payment = __commonJS({
  "handle-payment.js"() {
    var { ENDPOINT, REQUEST_TIMEOUT } = require_env();
    var { HttpStatusCode } = require("axios");
    var { sendMoneySignal, sendStatusSignal } = require_device();
    var {
      delayMs,
      floorAmountBy1K,
      writeErrorLog,
      writeSuccessLog
    } = require_utils();
    var { DEVICE_STATUS } = require_constants();
    var { getToken } = require_token();
    var axios = require("axios").default;
    var { setStatus } = require_led_status();
    async function main() {
      while (1) {
        try {
          const isSuccess = await handlePayment();
          if (!isSuccess)
            await delayMs(REQUEST_TIMEOUT);
        } catch (error) {
        }
      }
    }
    var waitForPayment = async () => {
      const token = await getToken();
      const url = `${ENDPOINT}/device/waiting-trans`;
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const val = floorAmountBy1K(res?.data?.amount);
        if (val > 0) {
          sendMoneySignal(val);
          return res.data;
        }
        writeSuccessLog(`Id: ${res.data.id} Amount: ${res.data.amount}`);
      } catch (error) {
        setStatus("ERROR");
        writeErrorLog(
          `Code: ${error?.response?.data?.statusCode} Message: ${error?.response?.data?.message}`
        );
      }
      return 0;
    };
    var claimTransaction = async (data) => {
      const token = await getToken();
      const url = `${ENDPOINT}/device/transaction/claim`;
      try {
        const res = await axios.post(
          url,
          { id: data.id },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        writeSuccessLog(`Id: ${data.id} Amount: ${data.amount}`);
        return true;
      } catch (error) {
        setStatus("ERROR");
        writeErrorLog(
          `Code: ${error?.response?.data?.statusCode} Message: ${error?.response?.data?.message}`
        );
        return false;
      }
    };
    var handlePayment = async () => {
      try {
        const data = await waitForPayment();
        if (data.id) {
          await claimTransaction(data);
          return true;
        }
      } catch (error) {
        return false;
      }
    };
    main();
  }
});

// index.js
require_request_logger();
require_ping();
require_handle_payment();
