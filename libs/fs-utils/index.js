const fs = require("fs");

const getDirectories = (dir) => {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

module.exports = {
  getDirectories,
};
