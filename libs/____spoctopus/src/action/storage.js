const fs = require("fs");

const { getRef } = require("./ref");
const { PACKAGE } = require("../constants");
const { read, write } = require("../utils/fs-json");

const readStorageState = () => {
  const { storageStateFile } = getRef().extConfig;

  if (fs.existsSync(storageStateFile)) return read(storageStateFile);
  return { hashPassword: null, packages: {}, version: PACKAGE.version };
};

const writeStorageState = () => {
  write(getRef().extConfig.storageStateFile, ref.storageState);
};

module.exports = {
  readStorageState,
  writeStorageState,
};
