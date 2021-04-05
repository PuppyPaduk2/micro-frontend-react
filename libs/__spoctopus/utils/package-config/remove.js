const remove = () => {
  const config = require("../package-config/read").read();
  delete config.getDependencies()[getPackageNameInfo().full];
  config.write();
};

const getPackageNameInfo = () => {
  const name = require("../action/args").args()[0];
  return require("../package-name/info").getInfo(name);
};

module.exports = { remove };
