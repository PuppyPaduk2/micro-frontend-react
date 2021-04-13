module.exports = (configHooks = {}, context = {}) => async (
  configCallbacks = {},
  innerContext = {}
) => {
  const entries = Object.entries(configHooks);
  const result = {};
  const combinedContext = {
    ...(context instanceof Function
      ? await context(
          innerContext instanceof Function ? await innerContext() : innerContext
        )
      : context),
  };

  for (let index = 0; index < entries.length; index += 1) {
    const [key, configHook] = entries[index];

    result[key] = await configHook(configCallbacks[key], combinedContext);
  }

  return result;
};
