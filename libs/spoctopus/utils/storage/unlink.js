const path = require("path");

const { PATHS } = require("../../constants");
const { read } = require("../fs-json/read");
const { read: readState, linked, write: writeState } = require("./state");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

const unlink = (payload = {}) => {
  const packageDir = getPackageDir(payload.packageDir || process.cwd());
  const packageJsonFile = path.resolve(packageDir, PATHS.PACKAGE_JSON);
  const packageJson = read(packageJsonFile);

  readState();
  delete linked()[packageJson.name];
  writeState();
};

module.exports = { unlink };
