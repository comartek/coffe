const { ENDPOINT, REQUEST_TIMEOUT } = require("./env");
const { HttpStatusCode } = require("axios");
const { sendMoneySignal, sendStatusSignal } = require("./device");
const {
  delayMs,
  floorAmountBy1K,
  writeErrorLog,
  writeSuccessLog,
} = require("./utils");
const { DEVICE_STATUS } = require("./constants");
const { getToken } = require("./token");
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
  const token = await getToken();
  const url = `${ENDPOINT}/device/waiting-trans`;

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('PAYMENT', res.data);
    const val = floorAmountBy1K(res?.data?.amount);
    if (val > 0) {
      sendMoneySignal(val);
      return res.data;
    }
    writeSuccessLog(`Id: ${res.data.id} Amount: ${res.data.amount}`);
  } catch (error) {
    writeErrorLog(
      `Code: ${error.response.data.statusCode} Message: ${error.response.data.message}`
    );
  }

  return 0;
};

const claimTransaction = async (data) => {
  const token = await getToken();
  const url = `${ENDPOINT}/device/transaction/claim`;

  try {
    const res = await axios.post(
      url,
      { id: data.id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    writeSuccessLog(`Id: ${data.id} Amount: ${data.amount}`);
    return true;
  } catch (error) {
    writeErrorLog(
      `Code: ${error.response.data.statusCode} Message: ${error.response.data.message}`
    );
    return false;
  }
};

const handlePayment = async () => {
  const data = await waitForPayment();
  if (data.id) {
    await claimTransaction(data);
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
