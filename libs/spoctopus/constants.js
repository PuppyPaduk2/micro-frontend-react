const path = require("path");

const PACKAGE = require("./package.json");

const PATHS = {
  STORAGE_DIR: "./storage",
  STATE_FILE: "./state.json",
  PACKAGE_JSON: "./package.json",
  NODE_MODULES: "./node_modules",
  OPTIONS_FILE: "./options.json",
};

const FULL_PATHS = {
  STORAGE_DIR: path.resolve(__dirname, PATHS.STORAGE_DIR),
  OPTIONS_FILE: path.resolve(__dirname, PATHS.OPTIONS_FILE),
};

const SEARCH = {
  PATTERN: "**/package.json",
  IGNORE: ["package.json", "**/node_modules/**"],
};

const SALT = 10;

module.exports = {
  PACKAGE,
  PATHS,
  FULL_PATHS,
  SEARCH,
  SALT,
};
