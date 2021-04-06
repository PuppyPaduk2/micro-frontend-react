const path = require("path");
const fs = require("fs");

const { PATHS } = require("../constants");
const { getRef } = require("./ref");

const getConfig = () => {
  const config = readConfig();
  const configDir = path.parse(getConfigFile()).dir;

  return {
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
  const programConfigFile = getRef().programOptions.configFile;
  const globalConfigFile = getRef().globalOptions.configFile;
  const tail = programConfigFile || globalConfigFile || "";

  return path.resolve(process.cwd(), tail);
};

const getExtConfig = () => {
  const { storageDir = "" } = getRef().config;

  return {
    storageStateFile: path.resolve(process.cwd(), storageDir, PATHS.STATE_FILE),
  };
};

module.exports = { getConfig, getExtConfig };
