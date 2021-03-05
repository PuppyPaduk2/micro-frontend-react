const nameRemoteScript = "remote.js";

const configs = {
  composite: {
    scope: "composite",
    port: 5000,
    exposes: {},
  },
  signIn: {
    scope: "signIn",
    port: 5001,
    exposes: {
      SignInApp: {
        key: "./SignInApp",
        path: "./exposes/app.ts",
      },
    },
  },
  dashboard: {
    scope: "dashboard",
    port: 5002,
    exposes: {
      DashboardApp: {
        key: "./DashboardApp",
        path: "./exposes/app.ts",
      },
    },
  },
};

const convertExposes = (exposes) => {
  const keys = Object.keys(exposes);
  const result = {};

  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];

    result[exposes[key].key] = exposes[key].path;
  }

  return result;
};

module.exports = { configs, nameRemoteScript, convertExposes };
