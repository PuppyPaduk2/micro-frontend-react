const path = require("path");

const { args } = require("../action/args");
const { getFullName } = require("../package-name/full-name");
const { read } = require("./read");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

const unlink = (payload = {}) => {
  const packageDir = getPackageDir(payload.packageDir || process.cwd());
  const { getLinks, write } = read({ packageDir });
  const packageName = getFullName(args()[0]);

  delete getLinks()[packageName];
  write();
};

module.exports = { unlink };
