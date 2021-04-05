const path = require("path");
const fs = require("fs");

const { PATHS } = require("../constants");
const { read } = require("../utils/fs-json");

const getStorageState = ({ storageDir } = { storageDir: "" }) => {
  storageDir = path.resolve(process.cwd(), storageDir);

  const stateFile = path.resolve(storageDir, PATHS.STATE_FILE);

  if (fs.existsSync(stateFile)) return read(stateFile);
  else return {};
};

module.exports = { getStorageState };
