const {
  getServiceSettingsFrontend,
  serviceUtils,
} = require("../common/webpack-config");

const { createModuleFederation, setupShaderByDirs } = serviceUtils;

module.exports = async (env = {}) => {
  const settings = await getServiceSettingsFrontend(env);
  const shared = setupShaderByDirs();

  return {
    ...settings,
    plugins: [
      ...settings.plugins,
      await createModuleFederation(
        {},
        {
          name: "core",
          shared: Object.entries(shared).reduce((memo, [key, config]) => {
            const next = { ...config, eager: true };
            if (key === "react") next.requiredVersion = "^17.0.1";
            memo[key] = next;
            return memo;
          }, {}),
        }
      ),
    ],
  };
};
