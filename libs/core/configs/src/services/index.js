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

const convertExposes = (exposes) =>
  Object.entries(exposes).reduce(
    (res, [, { key, path }]) => ({ ...res, [key]: path }),
    {}
  );

module.exports = { configs, nameRemoteScript, convertExposes };
