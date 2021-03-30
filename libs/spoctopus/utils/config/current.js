const path = require("path");

const { FULL_PATHS } = require("../../constants");
const read = require("../../utils/fs-json/read").read;

let config = {
  storage: FULL_PATHS.STORAGE_DIR,
};

const update = (pathConfig = FULL_PATHS.CONFIG) => {
  config = { ...config, ...read(path.resolve(process.cwd(), pathConfig)) };
};

const updateWrapper = (program, callback) => {
  return (...args) => {
    update(program.opts().config);
    console.log("Config:", config);
    return callback(...args);
  };
};

module.exports = { config: () => config, update, updateWrapper };
