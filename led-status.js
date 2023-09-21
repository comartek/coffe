/* eslint-disable no-undef */

// eslint-disable-next-line @typescript-eslint/no-var-requires

const rpio = require("rpio");
const { delayMs } = require("./utils");
const { TIMEOUT_TO_DELAY_WHEN_ERROR, TIMEOUT_TO_DELAY_WHEN_INACTIVE } = require("./env");

let _status = 'NO_INTERNET';

const PIN_RED = 16;
const PIN_GREEN = 18;

rpio.open(PIN_RED, rpio.OUTPUT, rpio.HIGH);
rpio.open(PIN_GREEN, rpio.OUTPUT, rpio.HIGH);

const run = async () => {
  while (1) {
    switch (_status) {
      case 'NO_INTERNET':
        //Hai đèn đều nháy
        rpio.open(PIN_GREEN, rpio.OUTPUT, rpio.HIGH);
        rpio.open(PIN_RED, rpio.OUTPUT, rpio.HIGH);
        await delayMs(TIMEOUT_TO_DELAY_WHEN_ERROR);
        rpio.open(PIN_GREEN, rpio.OUTPUT, rpio.LOW);
        rpio.open(PIN_RED, rpio.OUTPUT, rpio.LOW);
        await delayMs(TIMEOUT_TO_DELAY_WHEN_ERROR);
        break;
      case 'OK':
        //Đèn xanh sáng, đỏ tắt
        rpio.open(PIN_GREEN, rpio.OUTPUT, rpio.HIGH);
        rpio.mode(PIN_RED, rpio.OUTPUT, rpio.LOW);
        await delayMs(TIMEOUT_TO_DELAY_WHEN_ERROR);
        break;
      case 'ERROR':
        //Đèn đỏ nháy đèn xanh tắt
        rpio.open(PIN_RED, rpio.OUTPUT, rpio.HIGH);
        rpio.mode(PIN_GREEN, rpio.OUTPUT, rpio.LOW);
        await delayMs(TIMEOUT_TO_DELAY_WHEN_ERROR);
        rpio.open(PIN_RED, rpio.OUTPUT, rpio.LOW);
        await delayMs(TIMEOUT_TO_DELAY_WHEN_ERROR);
        break;
      case 'INACTIVE':
        //Đèn đỏ nháy đèn xanh tắt
        rpio.open(PIN_RED, rpio.OUTPUT, rpio.HIGH);
        rpio.mode(PIN_GREEN, rpio.OUTPUT, rpio.LOW);
        await delayMs(TIMEOUT_TO_DELAY_WHEN_INACTIVE);
        rpio.open(PIN_RED, rpio.OUTPUT, rpio.LOW);
        await delayMs(TIMEOUT_TO_DELAY_WHEN_INACTIVE);
        break;
      
    }
}
}

run();

const setStatus = (status) => {
  console.log('CHANGE STATUS:', status)
  _status = status;
}


module.exports = {
  setStatus
}