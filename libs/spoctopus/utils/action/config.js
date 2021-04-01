const path = require("path");

const { FULL_PATHS, PATHS } = require("../../constants");
const { read } = require("../fs-json/read");
const { getOptions } = require("./options");

let config = {};
let extConfig = {};

const getData = (configFile) => {
  configFile = path.resolve(process.cwd(), configFile);
  const { ext } = path.parse(configFile);
  if (ext === ".json") return read(configFile);
  else if (ext === ".js") return require(configFile);
  else return {};
};

const update = () => {
  const configFile = getOptions().config;
  const configDir = configFile ? path.parse(configFile).dir : process.cwd();
  const data = configFile ? getData(configFile) : {};
  const storageDir = data.storageDir || FULL_PATHS.STORAGE_DIR;

  config = {
    storageDir: path.resolve(configDir, storageDir),
  };
  extConfig = {
    stateFile: path.resolve(config.storageDir, PATHS.STATE_FILE),
  };
};

module.exports = { config: () => config, extConfig: () => extConfig, update };
