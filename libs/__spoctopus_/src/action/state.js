const { getConfig, getExtConfig } = require("./config");
const { getStorageState } = require("./storage-state");

const actionState = {
  programOptions: {},
  args: [],
  actionOptions: {},
  config: getConfig(),
  extConfig: getExtConfig(),
  storageState: getStorageState(),
};

module.exports = { getActionState: () => actionState };
