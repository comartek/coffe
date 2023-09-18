/* eslint-disable no-undef */

// eslint-disable-next-line @typescript-eslint/no-var-requires

// const rpio = require("rpio");

const PIN = 12;
const PULSE_WIDTH = 25; // ms
const TIMEOUT_TO_END_COMMAND = PULSE_WIDTH * 10;

/**
 *
 * @param {*} status
 */
const sendStatusSignal = (status) => {
  console.log("Device status", status);
  // todo:
};

const sendMoneySignal = async (val) => {
  console.log("val=>>>>>>>>>>>>>>>>>>>", val);
  // console.log("Send money signal", val);
  // for (let i = 0; i < val; i++) {
  //   rpio.open(PIN, rpio.OUTPUT, rpio.LOW);

  //   rpio.msleep(PULSE_WIDTH * 4);

  //   rpio.open(PIN, rpio.OUTPUT, rpio.HIGH);

  //   rpio.msleep(PULSE_WIDTH);
  // }

  // rpio.msleep(TIMEOUT_TO_END_COMMAND);

  // rpio.open(PIN, rpio.OUTPUT, rpio.LOW);
};

module.exports = {
  sendMoneySignal,
  sendStatusSignal,
};
