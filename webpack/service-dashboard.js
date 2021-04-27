const {
  getServiceSettingsFrontend,
  serviceUtils,
} = require("../common/webpack-config");

const { createModuleFederation, setupShaderByDirs } = serviceUtils;

module.exports = async (env = {}) => {
  const settings = await getServiceSettingsFrontend(env);

  return {
    ...settings,
    plugins: [
      ...settings.plugins,
      await createModuleFederation(
        {},
        { name: "dashboard", exposes: { "./App": "./exposes/app.ts" } }
      ),
    ],
  };
};
