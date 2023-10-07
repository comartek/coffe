const { ENDPOINT, REQUEST_TIMEOUT } = require("./env");
const { HttpStatusCode } = require("axios");
const { sendMoneySignal, sendStatusSignal } = require("./device");
const { delayMs, floorAmountBy1K, writeSuccessLog } = require("./utils");
const { DEVICE_STATUS } = require("./constants");
const { getToken } = require("./token");
const { get, post } = require("./api");
const axios = require("axios").default;

let STATUS = "OK";

async function main() {
  while (1) {
    try {
      const isSuccess = await handlePayment();
      if (!isSuccess) await delayMs(REQUEST_TIMEOUT);
    } catch (error) {}
  }
}

/**
 *
 * @returns id of the transaction
 */
const waitForPayment = async () => {
  const url = `${ENDPOINT}/device/waiting-trans`;
  const res = await get(url);

  const val = floorAmountBy1K(res?.data?.amount);
  if (val > 0) {
    sendMoneySignal(val);
    return res.data;
  } else {
    // send to close pin
    sendMoneySignal(0);
  }

  writeSuccessLog(`Id: ${res.data.id} Amount: ${res.data.amount}`);

  return 0;
};

const claimTransaction = async (data) => {
  const url = `${ENDPOINT}/device/transaction/claim`;

  try {
    await post(url, { id: data.id });
    writeSuccessLog(`Id: ${data.id} Amount: ${data.amount}`);
    return true;
  } catch (error) {
    return false;
  }
};

const handlePayment = async () => {
  try {
    const data = await waitForPayment();
    if (data.id) {
      await claimTransaction(data);
      return true;
    }
  } catch (error) {
    return false;
  }
};

const handleRequestStatus = (status) => {
  switch (status) {
    case HttpStatusCode.Ok: {
      STATUS = DEVICE_STATUS.OK;
      break;
    }
    case "EAI_AGAIN":
      STATUS = DEVICE_STATUS.NO_INTERNET;
      break;
    default:
      STATUS = DEVICE_STATUS.ERROR;
  }

  sendStatusSignal(STATUS);
};

main();
