const cron = require("node-cron");
const { default: axios } = require("axios");
const { writeErrorLog } = require("./utils");
const { getToken } = require("./token");
const Mutex = require("async-mutex").Mutex;

let _token = "";
const mutex = new Mutex();

const singleGetToken = async () => {
  await mutex.acquire();
  try {
    console.log("start get token");
    _token = await getToken();
  } catch (error) {
    writeErrorLog("refresh token error");
    writeErrorLog(error);
  } finally {
    mutex.release();
  }
};

// auto refresh token
cron
  .schedule("* */10 * * * *", async () => {
    try {
      await singleGetToken();
    } catch (error) {
      writeErrorLog(error)
    }
  })
  .start();

const get = async (url, requiredAuth = true) => {
  const request = async () => {
    const headers = {};
    if (requiredAuth) {
      if (_token === "") {
        await singleGetToken()
      }
      headers.Authorization = `Bearer ${_token}`;
    }
    return axios.get(url, {
      headers,
    });
  };

  try {
    await mutex.waitForUnlock();
    const data = await request();
    return data;
  } catch (error) {
    if ((error?.response?.status == 401)) {
      if (!mutex.isLocked()) {
        await singleGetToken();
      } else {
        await mutex.waitForUnlock();
      }

      return request();
    } else {
      throw error;
    }
  }
};

const post = async (url, data = {}, requiredAuth = true) => {
  const request = async () => {
    const headers = {};
    if (requiredAuth) {
      if (_token === "") {
        await singleGetToken()
      }
      headers.Authorization = `Bearer ${_token}`;
    }
    return axios.post(url, data, {
      headers,
    });
  };

  try {
    await mutex.waitForUnlock();
    return request();
  } catch (error) {
    if ((error?.response?.status == 401)) {
      await singleGetToken();
      return request();
    }
    throw error;
  }
};

module.exports = {
  get,
  post,
};
