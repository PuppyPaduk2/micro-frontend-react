const path = require("path");

const { PATHS } = require("../../constants");
const { args: getArgs } = require("../action/args");
const { getFullName } = require("../package-name/full-name");
const { read } = require("./read");
const { read: readState, linked: getLinked } = require("../storage/state");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

// TODO only packageDir (replace payload)
const link = (payload = {}) => {
  const { packageDir } = payload;
  const packageName = getFullName(getArgs()[0]);

  readState();
  if (getLinked()[packageName]) addLink({ packageDir });
};

// TODO more cleaner
const addLink = (payload = {}) => {
  const packageDir = getPackageDir(payload.packageDir || process.cwd());
  const targetDir = getArgs()[1].targetDir || PATHS.NODE_MODULES;
  const { getLinks, write } = read({ packageDir });
  const packageName = getFullName(getArgs()[0]);

  getLinks()[packageName] = { targetDir };
  write();
};

module.exports = { link };
