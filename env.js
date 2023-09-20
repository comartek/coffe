require("dotenv").config();
const {machineIdSync} = require('node-machine-id');
const crypto = require('crypto');

const machineId = machineIdSync();
const buffMachineId = Buffer.from(machineId, 'hex');
const CODE = buffMachineId.toString('base64url');

function generatePass(){
  const secret_key = '+HW5jB8"]!xD';
  const key = crypto
  .createHash('sha512')
  .update(secret_key)
  .digest('hex')
  .substring(0, 32)

  const secret_iv = 'okeh{Thf#Azl';
  const encryptionIV = crypto
  .createHash('sha512')
  .update(secret_iv)
  .digest('hex')
  .substring(0, 16)
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, encryptionIV)

  const pass = Buffer.from(
    cipher.update(CODE, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64') 

  return {
    pass,
    ver: '0.1'
  }
}

const SECRET = generatePass();

const ENDPOINT = process.env.ENDPOINT;
const SCRETKEY = process.env.SCRETKEY;
const REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT;
const TIMEOUT_TO_DELAY_WHEN_INACTIVE = +process.env.TIMEOUT_TO_DELAY_WHEN_INACTIVE;
const TIMEOUT_TO_DELAY_WHEN_ERROR = +process.env.TIMEOUT_TO_DELAY_WHEN_ERROR;

module.exports = {
  ENDPOINT,
  REQUEST_TIMEOUT,
  TIMEOUT_TO_DELAY_WHEN_INACTIVE,
  TIMEOUT_TO_DELAY_WHEN_ERROR,
  SCRETKEY,
  CODE
};
