/* eslint-disable no-undef */

// eslint-disable-next-line @typescript-eslint/no-var-requires

const rpio = require("rpio");

let _status = 'No_internet'; // 2 đèn đều nháy

 // OK // đèn xanh sáng, đỏ tắt

 // ERROR // đèn đỏ nháy 1000ms đèn xanh tắt; 
 // INACTIVE // đèn đỏ nháy 500ms đèn xanh tắt; 


const PIN_RED = 16;
const PIN_BLUE = 18;

const TIMEOUT_TO_END_COMMAND = 500;

rpio.open(PIN_RED, rpio.OUTPUT, rpio.LOW);
rpio.open(PIN_BLUE, rpio.OUTPUT, rpio.HIGH);

while (1) {
    rpio.open(PIN_RED, rpio.OUTPUT, rpio.HIGH);
    rpio.msleep(TIMEOUT_TO_END_COMMAND);
    rpio.open(PIN_RED, rpio.OUTPUT, rpio.LOW);
    rpio.msleep(TIMEOUT_TO_END_COMMAND);
}

const setStatus = (status) => {
  _status = status;
}

module.exports = {
  setStatus
}