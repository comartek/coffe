const delayMs = (ms = 1000) => {
  return new Promise((rs) => {
    setTimeout(() => {
      rs({});
    }, ms);
  });
};

module.exports = {
  delayMs,
};
