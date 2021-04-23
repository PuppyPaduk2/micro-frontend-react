const setProcessEnv = (key, value, important = false) => {
  if (important) {
    process.env[key] = value;
  } else {
    process.env[key] =
      process.env[key] === undefined ? value : process.env[key];
  }

  return process.env[key];
};

module.exports = { setProcessEnv };
