module.exports = (
  value,
  middleware = async ({ value, context }) => value
) => async (callback = ({ value, context }) => value, context = {}) => {
  return await callback({
    value: await middleware({
      value,
      context: context instanceof Function ? await context() : context,
    }),
    context,
  });
};
