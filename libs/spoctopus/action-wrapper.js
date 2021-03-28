const log = require("./log");

module.exports = {
  actionWrapper: async (payload) => {
    try {
      const result = await payload.callback();
      if (payload.messageDone) log.done(payload.messageDone);
      return result;
    } catch (error) {
      log.fail(error.message);
    }
  },
  actionWrapperSync: (payload) => {
    try {
      const result = payload.callback();
      if (payload.messageDone) log.done(payload.messageDone);
      return result;
    } catch (error) {
      log.fail(error.message);
    }
  },
};
