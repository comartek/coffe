const { POINT_OF_SALE, ENDPOINT, REQUEST_TIMEOUT } = require("./env");
const { pingStatus } = require("./ping");
const { HttpStatusCode } = require("axios");
const { sendMoneySignal, sendStatusSignal } = require("./device");
const { delayMs } = require("./utils");
const { DEVICE_STATUS } = require("./constants");
const { getToken  } = require("./token")
const axios = require("axios").default;
const cron = require("node-cron");

// console.log(POINT_OF_SALE, ENDPOINT, REQUEST_TIMEOUT);
// const POINT_OF_SALE = process.env.POINT_OF_SALE;
// const ENDPOINT = process.env.ENDPOINT;
// const REQUEST_TIMEOUT = +process.env.REQUEST_TIMEOUT;

let STATUS = "OK";

let accessToken = ''

async function main() {
  await getToken().then((res) => {
    accessToken = res.data.token
  })

  const isSuccess = await handlePayment();
  console.log("isSuccess", isSuccess);
  // while (1) {
  //   try {
  //     const isSuccess = await handlePayment();
  //     if (!isSuccess) await delayMs(REQUEST_TIMEOUT);
  //   } catch (error) {
  //     console.log("GLOBAL ERROR", error);
  //   }
  // }

  cron.schedule("* * * * * *", async () => { 
    const data = await pingStatus()
      console.log('aaaaaaaaaaaaaaass', data)
  })
}





const handlePayment = async () => {
  try {
    const url = `${ENDPOINT}/device/waiting-trans`;
    const urlClaimTrans = `${ENDPOINT}/device/transaction/claim`;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      timeout: REQUEST_TIMEOUT,
      url: url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .request(config)
      .then((res) => {
        handleRequestStatus(res.status);
        if (res.data) {
          console.log(res.data);
          const val = floorAmountBy1K(res?.data?.amount);
          if (val > 0) {
            sendMoneySignal(val);
            // call claim transaction
            axios
              .post(
                urlClaimTrans,
                { id: `${res?.data?.id}` },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              )
              .then((res) => {
                if (res) {
                  console.log("res claim", res);
                  return true;
                }
              })
              .catch((ers) => {
                console.log("GLOBAL ERROR", ers);
                return false;
              });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return true;
  } catch (error) {
    // Chủ động timeout và tiếp tục request
    // return true để hiểu rằng đây là trạng thái bình thường
    // if (error?.code == "ECONNABORTED") {
    //   handleRequestStatus(HttpStatusCode.Ok);
    //   return true;
    // }
    // handleRequestStatus(error?.code);
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

const floorAmountBy1K = (amount) => {
  return Math.floor(amount / 1000);
};

main();
