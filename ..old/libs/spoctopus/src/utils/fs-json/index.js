const fs = require("fs");
const { parse } = require("path");

const read = (path, def = {}) => {
  if (fs.existsSync(path)) return JSON.parse(fs.readFileSync(path).toString());
  else return def;
};

const write = (path, data) => {
  const { dir } = parse(path);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

module.exports = { read, write };
