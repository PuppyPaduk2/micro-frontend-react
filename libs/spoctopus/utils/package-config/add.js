const add = () => {
  const config = require("../package-config/read").read();
  config.getDependencies()[getPackageNameInfo().full] = {
    version: getVersion(),
    targetDir: getTargetDir(),
  };
  config.write();
};

const getVersion = () => {
  const { versions, lastVersion } = getPackageState();
  const { version } = getPackageNameInfo();
  return versions[version] ? version : lastVersion;
};

const getTargetDir = () => {
  const { linkTargetDir } = require("../action/options").getOptions();
  const { targetDir } = require("../action/args").args()[1];
  const nodeModulesDir = require("../../constants").PATHS.NODE_MODULES;
  return targetDir || linkTargetDir || nodeModulesDir;
};

const getPackageState = () => {
  return getPublished()[getPackageNameInfo().full];
};

const getPublished = () => {
  require("../storage/state").read();
  return require("../storage/state").published();
};

const getPackageNameInfo = () => {
  const name = require("../action/args").args()[0];
  return require("../package-name/info").getInfo(name);
};

module.exports = { add };
