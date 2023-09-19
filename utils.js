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

module.exports = {
  delayMs,
  nowInSeconds,
  floorAmountBy1K,
};
