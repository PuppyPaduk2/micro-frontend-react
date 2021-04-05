const { getActionState } = require("./state");
const { readOptions } = require("./options");
const { getConfig, getExtConfig } = require("./config");
const { getStorageState } = require("./storage-state");

const actionWrapper = (program) => (callback, getOptions = () => ({})) => {
  return (...args) => {
    const state = getActionState();
    state.programOptions = {
      ...readOptions(),
      ...program.opts(),
    };
    state.args = args;
    state.actionOptions = {
      ...state.options,
      ...getOptions(...args),
    };
    state.config = {
      ...state.config,
      ...getConfig(state.programOptions.configFile),
    };
    state.extConfig = {
      ...state.extConfig,
      ...getExtConfig(state.config),
    };
    state.storageState = {
      ...state.storageState,
      ...getStorageState(state.config),
    };
    return callback(...args);
  };
};

module.exports = { actionWrapper };
