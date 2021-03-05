const { configs, nameRemoteScript } = require("../services");

const paths = {
  signIn: () => `/signin`,
  signInAuth: () => `/signin/auth`,
  siginInChangePass: () => `/signing/changepass`,
  dashboard: () => `/dashboard`,
  dashboardAccounts: () => `/dashboard/accounts`,
  dashboardSettings: () => `/dashboard/settings`,
};

const menu = [
  {
    path: paths.signIn(),
    title: "Sign in",
  },
  {
    path: paths.dashboard(),
    title: "Dashboard",
  },
];

const getContentPath = (port) => `http://localhost:${port}/${nameRemoteScript}`;

const getContenItem = ({ key, modulePath }) => ({
  path: paths[key](),
  url: getContentPath(configs[key].port),
  scope: configs[key].scope,
  modulePath,
});

const content = [
  getContenItem({
    key: "signIn",
    modulePath: configs.signIn.exposes.SignInApp.key,
  }),
  getContenItem({
    key: "dashboard",
    modulePath: configs.dashboard.exposes.DashboardApp.key,
  }),
];

module.exports = { paths, menu, content };
