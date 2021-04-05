const getScope = require("./scope").getScope;
const getShort = require("./short-name").getShortName;
const getVersion = require("./version").getVersion;
const getFull = require("./full-name").getFullName;

const getInfo = (value) => ({
  scope: getScope(value),
  short: getShort(value),
  full: getFull(value),
  version: getVersion(value),
});

module.exports = { getInfo };
