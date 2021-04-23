const { getServiceSettings } = require("./service-settings");
const { getServiceSettingsBackend } = require("./service-settings-backend");
const { getServiceSettingsFrontend } = require("./service-settings-frontend");
const serviceUtils = require("./service-utils");

module.exports = {
  getServiceSettings,
  getServiceSettingsBackend,
  getServiceSettingsFrontend,
  serviceUtils,
};
