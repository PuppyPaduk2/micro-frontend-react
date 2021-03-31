const path = require("path");

const { FULL_PATHS, PATHS } = require("../../constants");
const { read } = require("../fs-json/read");

let config = {};
let extConfig = {};

const update = (pathConfig = FULL_PATHS.CONFIG) => {
  const data = read(path.resolve(process.cwd(), pathConfig));
  const storageDir = data.storageDir || FULL_PATHS.STORAGE_DIR;

  config = {
    storageDir: path.resolve(process.cwd(), storageDir),
  };
  extConfig = {
    stateFile: path.resolve(config.storageDir, PATHS.STATE_FILE),
  };
};

module.exports = { config: () => config, extConfig: () => extConfig, update };
