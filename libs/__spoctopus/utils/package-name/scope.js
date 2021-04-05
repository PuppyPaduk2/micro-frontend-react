const isScope = (value) => value[0] === "@";

const getScopeArr = (value) => value.split("/");

const getScope = (value) => {
  if (isScope(value)) return getScopeArr(value)[0];
  else return "";
};

const getName = (value) => {
  if (isScope(value)) return getScopeArr(value)[1];
  else return value;
};

module.exports = { getScope, getName };
