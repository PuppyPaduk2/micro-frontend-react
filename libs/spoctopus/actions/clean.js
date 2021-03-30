const removeStorage = require("../utils/storage/remove").remove;
const config = require("../utils/config/current").config;

const clean = () => {
  removeStorage({ dir: config().storage });
};

module.exports = { clean };
