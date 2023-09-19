const fs = require("fs");
const { join } = require("path");
const dayjs = require("dayjs");

const delayMs = (ms = 1000) => {
  return new Promise((rs) => {
    setTimeout(() => {
      rs({});
    }, ms);
  });
};

const nowInSeconds = () => {
  return Math.round(Date.now() / 1_000);
};

const floorAmountBy1K = (amount) => {
  return Math.floor(amount / 1000);
};

const writeErrorLog = (log) => {
  const now = Date.now();
  if (log.code === "ENOTFOUND") {
    fs.appendFileSync(
      join(process.cwd(), `logs/${dayjs(now).format("DDMMYYYY")}.error.log`),
      `Time: ${dayjs(now).format("DD-MM-YYYY HH:mm:ss")} CODE: ${
        log.code
      } Message: No internet\r\n`
    );
  }

  if (log.response) {
    fs.appendFileSync(
      join(process.cwd(), `logs/${dayjs(now).format("DDMMYYYY")}.error.log`),
      `Time: ${dayjs(now).format("DD-MM-YYYY HH:mm:ss")} STATUS: ${
        log.response.status
      } STATUS TEXT: ${log.response.statusText} Message: ${
        log.response.data.message
      }\r\n`
    );
  }
};

const writeSuccessLog = (log) => {
  const time = dayjs().format(
    "DD-MM-YYYY HH:mm:ss"
  );

  const pathToLogFile = join(process.cwd(), `logs/${dayjs(now).format("DDMMYYYY")}.log`);
  if (id) {
    fs.appendFileSync(
      pathToLogFile, `${time} ${log}\r\n`
    );
  }
};

module.exports = {
  delayMs,
  nowInSeconds,
  floorAmountBy1K,
  writeErrorLog,
  writeSuccessLog,
};
