const path = require("path");

const PACKAGE = require("./package.json");

const PATHS = {
  STORAGE_DIR: "./storage",
  STATE_FILE: "./state.json",
  PACKAGE_JSON: "./package.json",
  NODE_MODULES: "./node_modules",
  CONFIG: "./config.json",
};

const FULL_PATHS = {
  STORAGE_DIR: path.resolve(__dirname, PATHS.STORAGE_DIR),
  CONFIG: path.resolve(__dirname, PATHS.CONFIG),
};

const SEARCH = {
  PATTERN: "**/package.json",
  IGNORE: ["package.json", "**/node_modules/**"],
};

module.exports = {
  PACKAGE,
  PATHS,
  FULL_PATHS,
  SEARCH,
};
