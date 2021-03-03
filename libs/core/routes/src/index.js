const routes = {
  composite: { port: 5000, publicPath: "/" },
  signIn: { port: 5001, publicPath: "/sign-in" },
  dashboard: { port: 5002, publicPath: "/dashboard" },
};

const appMenu = [
  { path: routes.dashboard.publicPath, title: "Dashboard" },
  { path: routes.signIn.publicPath, title: "Sign in" },
];

module.exports = { routes, appMenu };
