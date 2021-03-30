const fs = require("fs");

const read = (path) => {
  return JSON.parse(fs.readFileSync(path).toString());
};

module.exports = { read };
