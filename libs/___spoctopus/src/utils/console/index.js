const info = (...args) => {
  console.log(...args);
};

const warn = (...args) => {
  console.log(...args);
};

const error = (...args) => {
  console.log(...args);
};

module.exports = {
  info,
  warn,
  error,
  table: require("./table").table,
};
