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
  const time = dayjs().format("DD-MM-YYYY HH:mm:ss");

  const pathToLogFile = join(
    process.cwd(),
    `logs/${dayjs().format("DDMMYYYY")}.error.log`
  );

  fs.appendFileSync(pathToLogFile, `${time} ${log}\r\n`);
};

const writeSuccessLog = (log) => {
  const time = dayjs().format("DD-MM-YYYY HH:mm:ss");

  const pathToLogFile = join(
    process.cwd(),
    `logs/${dayjs().format("DDMMYYYY")}.log`
  );

  fs.appendFileSync(pathToLogFile, `${time} ${log}\r\n`);
};

module.exports = {
  delayMs,
  nowInSeconds,
  floorAmountBy1K,
  writeErrorLog,
  writeSuccessLog,
};
