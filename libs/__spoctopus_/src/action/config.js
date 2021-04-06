const path = require("path");
const fs = require("fs");

const { read } = require("../utils/fs-json");
const { FULL_PATHS, PATHS } = require("../constants");

const getConfig = (configFile = "") => {
  configFile = path.resolve(process.cwd(), configFile);

  const { ext } = path.parse(configFile);
  const isExist = fs.existsSync(configFile);

  if (isExist && ext === ".json") return read(configFile);
  else if (isExist && ext === ".js") return require(configFile);
  else return getDefConfig();
};

const getDefConfig = () => ({
  storageDir: FULL_PATHS.STORAGE_DIR,
});

const getExtConfig = ({ storageDir } = { storageDir: "" }) => ({
  storageStateFile: path.resolve(storageDir, PATHS.STATE_FILE),
});

module.exports = { getConfig, getExtConfig };
