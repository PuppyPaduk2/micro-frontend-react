const { getScope } = require("./scope");
const { getName } = require("./version");

const getFullName = (value) => {
  const scope = getScope(value);
  const separator = scope ? "/" : "";
  const name = getName(value);
  return `${scope}${separator}${name}`;
};

module.exports = { getFullName };
