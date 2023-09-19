const fs = require('fs');
const {join} = require('path');

const delayMs = (ms = 1000) => {
  return new Promise((rs) => {
    setTimeout(() => {
      rs({});
    }, ms);
  });
};

const nowInSeconds = () => {
  return Math.round(Date.now() / 1_000);
}

const floorAmountBy1K = (amount) => {
  return Math.floor(amount / 1000);
};

const writeErrorLog = (log) => {
  fs.appendFileSync(join(process.cwd(),'logs/20230919.error.log'), `${log}\r\n`);
}

writeErrorLog('xxxx');

module.exports = {
  delayMs,
  nowInSeconds,
  floorAmountBy1K,
  writeErrorLog,
};
