const concatObjectResults = (...callbacks) => {
  return async (...args) => {
    let result = {};

    for (let index = 0; index < callbacks.length; index += 1) {
      result = { ...result, ...(await callbacks[index](...args)) };
    }

    return result;
  };
};

const concatArrayResults = (...callbacks) => {
  return async (...args) => {
    let result = [];

    for (let index = 0; index < callbacks.length; index += 1) {
      result = [...result, ...(await callbacks[index](...args))];
    }

    return result;
  };
};

module.exports = {
  concatObjectResults,
  concatArrayResults,
};
