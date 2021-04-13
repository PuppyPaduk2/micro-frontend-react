const axios = require("axios");

const { controller } = require("./services-config.json");

const getServicesConfig = async () => {
  try {
    const url = `${controller.publicPath}/api/services/config`;
    return (await axios.get(url)).data;
  } catch (error) {
    return {};
  }
};

const runService = ({ serviceKey }) => {
  return axios
    .post(`${controller.publicPath}/api/services/run`, { serviceKey })
    .catch(() => {});
};

const stopService = ({ serviceKey }) => {
  let request = null;

  return () => {
    if (!request) {
      request = axios
        .post(`${controller.publicPath}/api/services/stopped`, {
          serviceKey,
        })
        .finally(() => process.exit(0));
    }

    return request;
  };
};

module.exports = {
  getServicesConfig,
  runService,
  stopService,
};
