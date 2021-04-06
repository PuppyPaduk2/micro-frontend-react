const { getRef } = require("./ref");
const { PACKAGE } = require("../constants");

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
