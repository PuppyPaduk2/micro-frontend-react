const path = require("path");
const prompts = require("prompts");

const { PATHS } = require("../../constants");
const { args: getArgs } = require("../action/args");
const { getOptions } = require("../action/options");
const { getFullName } = require("../package-name/full-name");
const { read } = require("./read");
const { read: readState, linked: getLinked } = require("../storage/state");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

// TODO only packageDir (replace payload)
// TODO readState in one place
const link = async (payload = {}) => {
  readState();

  const { packageDir } = payload;
  const packageName = getFullName(await getPackageName());

  if (getLinked()[packageName]) addLink(packageDir, packageName);
};

const getPackageName = () => {
  let [packageName] = getArgs();

  if (packageName) return Promise.resolve(packageName);
  else return getInteractivePackageName();
};

const getInteractivePackageName = () => {
  return prompts({
    type: "autocomplete",
    name: "name",
    message: "Pick a package",
    choices: Object.keys(getLinked()).map((title) => ({ title })),
  }).then(({ name }) => name);
};

// TODO more cleaner
const addLink = (packageDir, packageName) => {
  packageDir = getPackageDir(packageDir || process.cwd());
  const targetDir = getTargetDir();
  const { getLinks, write } = read({ packageDir });

  getLinks()[packageName] = { targetDir };
  write();
};

const getTargetDir = () => {
  const { linkTargetDir } = getOptions();
  const argsTargetDir = getArgs()[1].targetDir;
  return argsTargetDir || linkTargetDir || PATHS.NODE_MODULES;
};

module.exports = { link };
