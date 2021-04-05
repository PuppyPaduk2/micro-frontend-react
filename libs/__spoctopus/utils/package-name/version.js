const { getName: getScopeName } = require("./scope");

const getVerArr = (value) => value.split("@");

const getVersion = (value) => {
  return getVerArr(getScopeName(value))[1] || "";
};

const getName = (value) => {
  return getVerArr(getScopeName(value))[0] || "";
};

module.exports = { getVersion, getName };
