const path = require("path");

const { read, write } = require("../utils/fs-json");
const { getStorageDir, getStateFile, searchPackages } = require("./common");

const stateFile = getStateFile();

const addPackage = (packageJsonFile) => {
  const state = read(stateFile);
  const { name } = read(packageJsonFile);

  state.packages[name] = {
    relativePath: path.relative(getStorageDir(), packageJsonFile),
  };
  write(stateFile, state);
};

module.exports = () => {
  const state = read(stateFile, null);

  if (state) searchPackages().then((paths = []) => paths.forEach(addPackage));
  else console.log("State doesn't exist");
};
