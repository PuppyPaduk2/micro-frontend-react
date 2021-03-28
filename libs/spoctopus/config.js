const $path = require("path");

module.exports = {
  PACKAGE: require("./package.json"),
  PATHS: {
    STORAGE_DIR: $path.resolve(__dirname, "./storage"),
    STATE_FILE: "./state.json",
    PACKAGE_JSON: "./package.json",
    NODE_MODULES: "./node_modules",
  },
};
