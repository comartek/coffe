/* eslint-disable no-undef */

// eslint-disable-next-line @typescript-eslint/no-var-requires

const debounce = require("lodash.debounce");
const rpio = require("rpio");

const PIN = 12;
const COUNTER_PIN = 22;

const PULSE_WIDTH = 25; // ms
const TIMEOUT_TO_END_COMMAND = PULSE_WIDTH * 10;

rpio.close(PIN);

/**
 *
 * @param {*} status
 */
const sendStatusSignal = (status) => {
  console.log("Device status", status);
  // todo:
};

const msleep = (ms) => {
  return new Promise((rs) => {
    setTimeout(rs, ms);
  });
};

const sendMoneySignal = async (val) => {
  console.log("val=>>>>>>>>>>>>>>>>>>>", val);
  if (val == 0) {
    rpio.close(PIN);
    return;
  }

  rpio.open(PIN, rpio.OUTPUT, rpio.LOW);
  await msleep(TIMEOUT_TO_END_COMMAND);

  for (let i = 0; i < val; i++) {
    rpio.open(PIN, rpio.OUTPUT, rpio.LOW);
    await msleep(PULSE_WIDTH * 4);

    rpio.open(PIN, rpio.OUTPUT, rpio.HIGH);
    await msleep(PULSE_WIDTH);
  }
  rpio.open(PIN, rpio.OUTPUT, rpio.LOW);
  await msleep(TIMEOUT_TO_END_COMMAND);
  rpio.close(PIN);
};

let callbackOnPay = (value) => {
  console.log("report value", value);
};
let counterPollLow = 0;

const setCallbackOnPay = (callback) => {
  callbackOnPay = callback;
};

const debounceReceiptPayment = debounce(() => {
  const total = counterPollLow;
  counterPollLow = 0;
  if (callbackOnPay && total > 0) {
    callbackOnPay(total);
  }
}, 1000);

const onReceiptPaymentSignal = (pin) => {
  counterPollLow++;
  debounceReceiptPayment();
};

rpio.open(COUNTER_PIN, rpio.INPUT);
rpio.poll(COUNTER_PIN, onReceiptPaymentSignal, rpio.POLL_LOW);

module.exports = {
  sendMoneySignal,
  sendStatusSignal,
  setCallbackOnPay,
};
