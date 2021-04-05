const path = require("path");

const { PATHS, PACKAGE } = require("../../constants");
const { read: readJson } = require("../fs-json/read");
const { write: writeJson } = require("../fs-json/write");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

const read = (payload = {}) => {
  const packageDir = getPackageDir(payload.packageDir || process.cwd());
  const packageJsonFile = path.resolve(packageDir, PATHS.PACKAGE_JSON);

  let pack = readJson(packageJsonFile);
  let config = pack[PACKAGE.name] || {};
  let packages = config.packages || {};
  let dependencies = packages.dependencies || {};
  let links = packages.links || {};

  const build = () => {
    if (Object.keys(links).length) packages.links = links;
    else delete packages.links;
    if (Object.keys(dependencies).length) packages.dependencies = dependencies;
    else delete packages.dependencies;
    if (Object.keys(packages).length) config.packages = packages;
    else delete config.packages;
    if (Object.keys(config).length) pack[PACKAGE.name] = config;
    else delete pack[PACKAGE.name];
  };

  const write = () => {
    build();
    writeJson(packageJsonFile, pack);
  };

  return {
    getPack: () => pack,
    getConfig: () => config,
    getPackages: () => packages,
    getDependencies: () => dependencies,
    getLinks: () => links,
    build,
    write,
  };
};

module.exports = { read };
