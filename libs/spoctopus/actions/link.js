const createStorage = require("../utils/storage/create").create;
const { args } = require("../utils/action/args");
const { link: linkToStorage, autoLink } = require("../utils/storage/link");
const { link: linkToConfig } = require("../utils/package-config/link");

const link = () => {
  createStorage();

  if (args()[1].auto) autoLink();
  if (args()[0]) linkToConfig();
  else linkToStorage();
};

module.exports = { link };
