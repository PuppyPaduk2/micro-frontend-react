const { args } = require("../utils/action/args");
const { unlink: unlinkFromStorage } = require("../utils/storage/unlink");
const { unlink: unlinkFromConfig } = require("../utils/package-config/unlink");

const unlink = () => {
  if (args()[0]) unlinkFromConfig();
  else unlinkFromStorage();
};

module.exports = { unlink };
