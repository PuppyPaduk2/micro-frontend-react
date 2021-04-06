const fs = require("fs");
const path = require("path");

const { PATHS, PACKAGE } = require("../constants");
const { read, write } = require("../utils/fs-json");

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

  ref.config = {
    ...config,
    storageDir: path.resolve(process.cwd(), config.storageDir),
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

module.exports = {
  getRef,
  actionWrapper,
  writeGlobalOptions,
  writeStorageState,
};
