module.exports = {
  PACKAGE: require("./package.json"),
  PATHS: {
    STORAGE_DIR: "./storage",
    STATE_FILE: "./state.json",
    PACKAGE_JSON: "./package.json",
    NODE_MODULES: "./node_modules",
  },
  SEARCH: {
    PATTERN: "**/package.json",
    IGNORE: ["package.json", "**/node_modules/**"],
  },
};
