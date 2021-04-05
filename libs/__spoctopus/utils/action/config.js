const path = require("path");
const fs = require("fs");

const { FULL_PATHS, PATHS } = require("../../constants");
const { read } = require("../fs-json/read");
const { getOptions } = require("./options");

let config = {};
let extConfig = {};

const update = () => {
  const data = readConfig();
  const storageDir = data.storageDir || FULL_PATHS.STORAGE_DIR;

  config = {
    storageDir: path.resolve(getConfigDir(), storageDir),
  };
  extConfig = {
    stateFile: path.resolve(config.storageDir, PATHS.STATE_FILE),
  };
};

const getConfigDir = () => {
  const configFile = getOptions().config;
  return configFile ? path.parse(configFile).dir : process.cwd();
};

const readConfig = () => {
  const configFile = getOptions().config;
  return configFile ? getData(configFile) : {};
};

const getData = (configFile) => {
  configFile = path.resolve(process.cwd(), configFile);
  const { ext } = path.parse(configFile);
  const isExist = fs.existsSync(configFile);

  if (isExist && ext === ".json") return read(configFile);
  else if (isExist && ext === ".js") return require(configFile);
  else return {};
};

module.exports = { config: () => config, extConfig: () => extConfig, update };
