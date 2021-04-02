const path = require("path");
const fs = require("fs");

// TODO Change on default export
const readJson = require("../fs-json/read").read;
const { PATHS, ARCHIVE } = require("../../constants");
const readState = require("./state").read;
const getPublished = require("./state").published;
const writeState = require("./state").write;
const getConfig = require("../action/config").config;
const getPackageScopeName = require("../package-name/scope").getScope;
const getPackageShortName = require("../package-name/scope").getName;
const zipArchive = require("../zip/archive").archive;

const public = () => {
  readState();

  const published = getPublished();
  const name = getPackageName();
  const version = getPackageVersion();

  if (!published[name]) addPackage();
  else if (!published[name].versions[version]) addPackageVersion();

  writeState();
};

const addPackage = () => {
  getPublished()[getPackageName()] = {
    created: new Date().getTime(),
    storageRelativePath: path.relative(getStorageDir(), getPackageStorageDir()),
    versions: {},
  };
  addPackageVersion();
};

const addPackageVersion = () => {
  const name = getPackageName();
  const version = getPackageVersion();

  getPublished()[name].versions[version] = {
    created: new Date().getTime(),
  };
  archivePackage();
};

const getPackageStorageDir = () => {
  const packageName = getPackageName();
  const scope = getPackageScopeName(packageName);
  const name = getPackageShortName(packageName);
  return path.resolve(getStorageDir(), scope, name);
};

const getStorageDir = () => {
  return getConfig().storageDir;
};

const archivePackage = () => {
  createPackageDir();
  zipArchive(ARCHIVE.PATTERN, getArchiveFile(), {
    cwd: process.cwd(),
    ignore: ARCHIVE.IGNORE,
    dot: true,
  }).then(() => console.log("done"));
};

const getArchiveFile = () => {
  return path.resolve(getPackageStorageDir(), `v${getPackageVersion()}.zip`);
};

const createPackageDir = () => {
  const packageStoreDir = getPackageStorageDir();
  const options = { recursive: true };

  if (!fs.existsSync(packageStoreDir)) fs.mkdirSync(packageStoreDir, options);
};

const getPackageName = () => {
  return getPackageJson().name;
};

const getPackageVersion = () => {
  return getPackageJson().version;
};

const getPackageJson = () => {
  return readJson(getPackageJsonFile());
};

const getPackageJsonFile = () => {
  return path.resolve(process.cwd(), PATHS.PACKAGE_JSON);
};

module.exports = { public };
