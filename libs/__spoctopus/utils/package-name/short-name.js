const getShortName = (value) => {
  return require("./version").getName(value);
};

module.exports = { getShortName };
