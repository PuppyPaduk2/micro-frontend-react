const { args } = require("../utils/action/args");
const { link: linkToStorage, autoLink } = require("../utils/storage/link");
const { link: linkToConfig } = require("../utils/package-config/link");

const link = () => {
  const [packageName, options] = args();

  if (options.auto) autoLink();
  else if (packageName || options.interactive) linkToConfig();
  else linkToStorage();
};

module.exports = { link };
