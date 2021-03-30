const log = require("./log");

const actionWrapper = (payload) => {
  return async (...args) => {
    try {
      const result = await payload.callback(...args);
      if (payload.messageDone) log.done(payload.messageDone);
      return result;
    } catch (error) {
      log.fail(error.message);
    }
  };
};

const action = (payload) => {
  return actionWrapper(payload)();
};

const actionWrapperSync = (payload) => {
  return (...args) => {
    try {
      const result = payload.callback(...args);
      if (payload.messageDone) log.done(payload.messageDone);
      return result;
    } catch (error) {
      log.fail(error.message);
    }
  };
};

const actionSync = (payload) => {
  return actionWrapperSync(payload)();
};

module.exports = {
  actionWrapper,
  action,
  actionWrapperSync,
  actionSync,
};
