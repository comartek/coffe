const { ENDPOINT, REQUEST_TIMEOUT } = require("./env");
const { HttpStatusCode } = require("axios");
const { sendMoneySignal, sendStatusSignal } = require("./device");
const { delayMs, floorAmountBy1K } = require("./utils");
const { DEVICE_STATUS } = require("./constants");
const { getToken } = require("./token");
const axios = require("axios").default;

let STATUS = "OK";

async function main() {
  while (1) {
    try {
      const isSuccess = await handlePayment();
      if (!isSuccess) await delayMs(REQUEST_TIMEOUT);
    } catch (error) {
      console.log("GLOBAL ERROR", error);
    }
  }
}

/**
 *
 * @returns id of the transaction
 */
const waitForPayment = async () => {
  const token = await getToken();
  const url = `${ENDPOINT}/device/waiting-trans`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('PAYMENT', res.data);
  const val = floorAmountBy1K(res?.data?.amount);
  if (val > 0) {
    sendMoneySignal(val);
    return res.data.id;
  }

  return 0;
};

const claimTransaction = async (transId) => {
  const token = await getToken();
  const url = `${ENDPOINT}/device/transaction/claim`;

  try {
    const res = await axios.post(
      url,
      { id: transId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.error('Claim Error', error);
    return false;
  }
};

const handlePayment = async () => {
  const transId = await waitForPayment();
  if (transId) {
    await claimTransaction(transId);
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
