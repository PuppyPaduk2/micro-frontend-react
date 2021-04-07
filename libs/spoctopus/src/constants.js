const PACKAGE = require("../package.json");

module.exports = {
  PACKAGE,
  PACKAGE_NAME: PACKAGE.name,
  PACKAGE_VERSION: PACKAGE.version,
  PATH_STORAGE_DIR: `./.${PACKAGE.name}`,
  PATH_STATE_FILE: "./state.json",
  PATH_OPTIONS_FILE: "./options.json",
  PATH_PACKAGE_JSON: "./package.json",
  PATH_LINKS_FILE: "./links.json",
  SALT: 10,
};
