const path = require("path");

const { PATHS, SEARCH_PACKAGES } = require("../constants");
const { write, read } = require("../utils/fs-json");
const { glob } = require("../utils/glob-promise");

const packageConfigs = {};

const readPackageConfig = (file = PATHS.PACKAGE_JSON) => {
  const packageJsonFile = path.resolve(process.cwd(), file);
  const packageJson = readPackageJson(packageJsonFile);
  const config = packageJson[PACKAGE.name] || { packages: {} };

  packageJson[PACKAGE.name] = config;
  packageConfigs[packageJsonFile] = packageJson;

  return config;
};

const readPackageJson = (file = PATHS.PACKAGE_JSON) => {
  const packageJsonFile = path.resolve(process.cwd(), file);

  return read(packageJsonFile);
};

const writePackageConfig = (file = PATHS.PACKAGE_JSON) => {
  const packageJsonFile = path.resolve(process.cwd(), file);
  const packageJson = packageConfigs[packageJsonFile];

  if (packageJson) write(packageJsonFile, packageJson);
};

const searchPackages = () => {
  return glob(SEARCH_PACKAGES.PATTERN, {
    cwd: process.cwd(),
    ignore: [...SEARCH_PACKAGES.IGNORE, ...getSearchPackagesIgnore()],
  });
};

const getSearchPackagesIgnore = () => {
  const { searchPackages } = ref.config;

  if (searchPackages && searchPackages.ignore) return searchPackages.ignore;
  else [];
};

module.exports = {
  readPackageConfig,
  readPackageJson,
  writePackageConfig,
  searchPackages,
};
