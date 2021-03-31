const path = require("path");

const { PATHS } = require("../../constants");
const { args } = require("../action/args");
const { getFullName } = require("../package-name/full-name");
const { read } = require("./read");
const { read: readState, linked: getLinked } = require("../storage/state");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

const link = (payload = {}) => {
  const { packageDir, targetDir } = payload;
  const packageName = getFullName(args()[0]);

  readState();
  if (getLinked()[packageName]) addLink({ packageDir, targetDir });
};

const addLink = (payload = {}) => {
  const packageDir = getPackageDir(payload.packageDir || process.cwd());
  const targetDir = payload.targetDir || PATHS.NODE_MODULES;
  const { getLinks, write } = read({ packageDir });
  const packageName = getFullName(args()[0]);

  getLinks()[packageName] = { targetDir };
  write();
};

module.exports = { link };
