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

const get = async (url, requiredAuth = true) => {
  const request = async () => {
    const headers = {};
    if (requiredAuth) {
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
    if ((error.response.status = 401)) {
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
      headers = {
        Authorization: `Bearer ${_token}`,
      };
    }
    return axios.post(url, data, {
      headers,
    });
  };

  try {
    await mutex.waitForUnlock();
    return request();
  } catch (error) {
    if ((error.response.statusCode = 401)) {
      await singleGetToken();
      return request();
    }
  }
};

module.exports = {
  get,
  post,
};
