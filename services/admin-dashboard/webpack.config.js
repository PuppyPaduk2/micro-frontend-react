const { serviceWebpackConfig } = require("./l-libs/webpack-config");

module.exports = serviceWebpackConfig({
  serviceKey: () => "admin-dashboard",
  devServerProxy: () => [
    {
      context: ["/api"],
      changeOrigin: true,
      cookieDomainRewrite: "localhost",
      target: "http://localhost:2999",
      secure: false,
    },
    {
      context: ["/socket"],
      target: "ws://localhost:2999",
      ws: true,
      secure: false,
    },
  ],
});
