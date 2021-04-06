const fs = require("fs");

const read = (path) => {
  return JSON.parse(fs.readFileSync(path).toString());
};

const write = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

module.exports = { read, write };
