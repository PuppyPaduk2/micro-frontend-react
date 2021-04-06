const path = require("path");

const {
  getRef,
  searchPackages,
  writeStorageState,
  readPackageJson,
  readPackageConfig,
  writePackageConfig,
} = require("../../action");
const prompts = require("../../utils/prompts");
const { PATHS } = require("../../constants");
const { parsePackageName } = require("../../utils/parse-package-name");
const { warn } = require("../../utils/console");

const link = () => {
  const { search } = getRef().actionOptions;

  if (search) linkBySearch();
  else linkByDir();
};

const linkBySearch = async () => {
  const packageJsonFiles = await searchPackages();

  for (let index = 0; index < packageJsonFiles.length; index += 1) {
    const packageJsonFile = packageJsonFiles[index];
    const packageJsonDir = path.parse(packageJsonFile).dir;

    await linkByDir(packageJsonDir);
  }
};

const linkByDir = async (dir = process.cwd()) => {
  const { packageName } = await getPackageName();

  if (packageName) linkToPackage(packageName);
  else linkToStorage(dir);
};

const getPackageName = () => {
  const { packageName, interactive, search } = getRef().actionOptions;

  if (search) return { packageName: null };
  else if (interactive)
    return prompts.packageName(
      Object.keys(getRef().storageState.packages).map((title) => ({ title }))
    );
  else return { packageName };
};

const linkToPackage = (packageName) => {
  packageName = parsePackageName(packageName).full;

  if (isPackageLinked(packageName)) changePackageConfig(packageName);
  else return warn("Selected package didn't link");
};

const changePackageConfig = (packageName) => {
  createPackageInPackageConfig(packageName);
  setTargetDir(packageName);
  writePackageConfig();
};

const isPackageLinked = (packageName) => {
  return Boolean(getRef().storageState.packages[packageName]);
};

const createPackageInPackageConfig = (packageName) => {
  const { packages } = readPackageConfig();

  if (!packages[packageName])
    packages[packageName] = {
      targetDir: "",
      version: "",
    };
};

const setTargetDir = (packageName) => {
  const { packages } = readPackageConfig();

  packages[packageName] = getRef().actionOptions.targetDir;
};

const linkToStorage = (dir) => {
  createPackageInStorageState(dir);
  writeStorageState();
};

const createPackageInStorageState = (dir) => {
  const packageJson = readPackageJson(path.resolve(dir, PATHS.PACKAGE_JSON));
  const packageName = packageJson.name;
  const { packages } = getRef().storageState;
  const packageState = packages[packageName];

  if (!packageState)
    packages[packageName] = {
      created: new Date().getTime(),
      packageRelativePath: path.relative(getRef().config.storageDir, dir),
      storageRelativePath: getStorageRelativePath(packageName),
      lastVersion: "",
      versions: {},
    };
};

const getStorageRelativePath = (packageName) => {
  const { storageDir } = getRef().config;
  const packageStorageDir = path.resolve(storageDir, packageName);

  return path.relative(storageDir, packageStorageDir);
};

module.exports = { link };
