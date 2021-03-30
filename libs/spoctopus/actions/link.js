const createStorage = require("../utils/storage/create").create;
const config = require("../utils/config/current").config;

const link = (packageName, options) => {
  createStorage({ dir: config().storage });
};

module.exports = { link };
