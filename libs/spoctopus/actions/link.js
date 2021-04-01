const { args } = require("../utils/action/args");
const { link: linkToStorage, autoLink } = require("../utils/storage/link");
const { link: linkToConfig } = require("../utils/package-config/link");

const link = () => {
  if (args()[1].auto) autoLink();
  if (args()[0]) linkToConfig();
  else linkToStorage();
};

module.exports = { link };
