const path = require("path");

const readState = require("./state").read;
const getPublished = require("./state").published;
const getArgs = require("../action/args").args;
const getConfig = require("../action/config").config;
const readConfig = require("../package-config/read").read;

const add = () => {
  readState();

  // console.log(getPublishedPackage());
  // console.log(getPackageNameInfo());
  // console.log(getPackageName());
  // console.log(getVersion());
  // console.log(getPackageStoreFile());
};

const getPackageStoreFile = () => {
  const storageDir = getConfig().storageDir;
  const { scope, short, version } = getPackageNameInfo();
  const tail = [scope, short, `v${version}.zip`].filter(Boolean);
  return path.resolve(storageDir, ...tail);
};

const getVersion = () => {
  const pack = getPublishedPackage();
  const packVersion = getPackageNameInfo().version;
  return pack.versions[packVersion] ? packVersion : pack.lastVersion;
};

const getPublishedPackage = () => {
  return getPublished()[getPackageNameInfo().full];
};

const getPackageNameInfo = () => {
  return require("../package-name/info").getInfo(getPackageName());
};

const getPackageName = () => {
  return getArgs()[0];
};

module.exports = { add };
