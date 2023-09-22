const { join } = require("path");
const mkdirp = require("mkdirp");

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

// make logs directory
const pathToLogDirectory = join(process.cwd(), "logs");
mkdirp.mkdirpSync(pathToLogDirectory);

const writeErrorLog = (error) => {
  console.error(log);
};

const writeSuccessLog = (log) => {
  console.info(log);
};

const parseJwt = (token) => {
  var base64Payload = token.split(".")[1];
  var payload = Buffer.from(base64Payload, "base64");
  return JSON.parse(payload.toString());
};

module.exports = {
  delayMs,
  nowInSeconds,
  floorAmountBy1K,
  writeErrorLog,
  writeSuccessLog,
  parseJwt,
};
