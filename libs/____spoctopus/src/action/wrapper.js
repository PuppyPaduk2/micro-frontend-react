const { readGlobalOptions } = require("./global-options");
const { getRef } = require("./ref");
const { getConfig, getExtConfig } = require("./config");
const { readStorageState } = require("./storage");

const actionWrapper = (program) => (callback, getActionOptions) => {
  return (...args) => {
    updateGlobalOptions();
    updateProgramOptions(program);
    updateArgs(args);
    updateActionsOptions(args, getActionOptions);
    updateConfig();
    updateExtConfig();
    updateStorageState();
    return callback();
  };
};

const updateGlobalOptions = () => {
  getRef().globalOptions = readGlobalOptions();
};

const updateProgramOptions = (program) => {
  getRef().programOptions = program.opts();
};

const updateArgs = (args) => {
  getRef().args = args;
};

const updateActionsOptions = (args = [], getOptions = () => ({})) => {
  getRef().actionOptions = getOptions(args);
};

const updateConfig = () => {
  getRef().config = getConfig();
};

const updateExtConfig = () => {
  getRef().extConfig = getExtConfig();
};

const updateStorageState = () => {
  getRef().storageState = readStorageState();
};

module.exports = {
  actionWrapper,
};
