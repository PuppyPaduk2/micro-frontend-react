const fs = require("fs");
const path = require("path");

const { PATHS, PACKAGE, SEARCH_PACKAGES } = require("../constants");
const { read, write } = require("../utils/fs-json");
const { glob } = require("../utils/glob-promise");

const ref = {
  globalOptions: {},
  programOptions: {},
  args: [],
  actionOptions: {},
  config: {},
  extConfig: {},
  storageState: {},
};

const getRef = () => ref;

const actionWrapper = (program) => (callback, getActionOptions) => {
  return (...args) => {
    updateGlobalOptions();
    updateProgramOptions(program);
    updateArgs(args);
    updateActionsOptions(args, getActionOptions);
    updateConfig();
    updateExtConfig();
    updateStorageState();
    return callback();
  };
};

const updateGlobalOptions = () => {
  ref.globalOptions = readGlobalOptions();
};

const readGlobalOptions = () => {
  const optionsFile = getOptionsFile();

  if (fs.existsSync(optionsFile)) return read(optionsFile);
  else return {};
};

const writeGlobalOptions = () => {
  const optionsFile = getOptionsFile();

  write(optionsFile, ref.globalOptions);
};

const getOptionsFile = () => {
  return path.resolve(__dirname, PATHS.OPTIONS_FILE);
};

const updateProgramOptions = (program) => {
  ref.programOptions = program.opts();
};

const updateArgs = (args) => {
  ref.args = args;
};

const updateActionsOptions = (args = [], getOptions = () => ({})) => {
  ref.actionOptions = getOptions(args, ref.globalOptions);
};

const updateConfig = () => {
  const config = readConfig();
  const configDir = path.parse(getConfigFile()).dir;

  ref.config = {
    ...config,
    storageDir: path.resolve(configDir, config.storageDir),
  };
};

const readConfig = () => {
  const configFile = getConfigFile();
  const { ext } = path.parse(configFile);
  const isExist = fs.existsSync(configFile);

  if (isExist && ext === ".json") return read(configFile);
  else if (isExist && ext === ".js") return require(configFile);
  else return getDefaultConfig();
};

const getDefaultConfig = () => ({
  storageDir: path.resolve(__dirname, PATHS.STORAGE_DIR),
});

const getConfigFile = () => {
  const programConfigFile = ref.programOptions.configFile;
  const globalConfigFile = ref.globalOptions.configFile;
  const tail = programConfigFile || globalConfigFile || "";

  return path.resolve(process.cwd(), tail);
};

const updateExtConfig = () => {
  const { storageDir = "" } = ref.config;

  ref.extConfig = {
    storageStateFile: path.resolve(process.cwd(), storageDir, PATHS.STATE_FILE),
  };
};

const updateStorageState = () => {
  ref.storageState = readStorageState();
};

const readStorageState = () => {
  const { storageStateFile } = ref.extConfig;

  if (fs.existsSync(storageStateFile)) return read(storageStateFile);
  return { hashPassword: null, packages: {}, version: PACKAGE.version };
};

const writeStorageState = () => {
  write(ref.extConfig.storageStateFile, ref.storageState);
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

const packageConfigs = {};

const readPackageJson = (file = PATHS.PACKAGE_JSON) => {
  const packageJsonFile = path.resolve(process.cwd(), file);

  return read(packageJsonFile);
};

const readPackageConfig = (file = PATHS.PACKAGE_JSON) => {
  const packageJsonFile = path.resolve(process.cwd(), file);
  const packageJson = readPackageJson(packageJsonFile);
  const config = packageJson[PACKAGE.name] || { packages: {} };

  packageJson[PACKAGE.name] = config;
  packageConfigs[packageJsonFile] = packageJson;

  return config;
};

const writePackageConfig = (file = PATHS.PACKAGE_JSON) => {
  const packageJsonFile = path.resolve(process.cwd(), file);
  const packageJson = packageConfigs[packageJsonFile];

  console.log(packageJson);

  if (packageJson) write(packageJsonFile, packageJson);
};

module.exports = {
  getRef,
  actionWrapper,
  writeGlobalOptions,
  writeStorageState,
  searchPackages,
  readPackageJson,
  readPackageConfig,
  writePackageConfig,
};
