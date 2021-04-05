const path = require("path");
const fs = require("fs");
const extractZip = require("extract-zip");

const getActionConfig = require("../action/config").config;
const getActionArgs = require("../action/args").args;
const getPackageNameInfo = require("../package-name/info").getInfo;
const getPackageConfig = require("../package-config/read").read;

const getPackageName = () => getActionArgs()[0];
const getStorageDir = () => getActionConfig().storageDir;
const getOnlyDeps = () => getActionArgs()[1].deps;
const getOnlyLinks = () => getActionArgs()[1].links;

const attach = (packageDir = process.cwd()) => {
  packageDir = path.resolve(process.cwd(), packageDir);
  getFilteredDeps(packageDir).forEach(attachDep(packageDir));
};

const attachDep = (packageDir) => ([packageName, { version, targetDir }]) => {
  try {
    const source = getPackageArchiveFile(packageName, version);
    const dir = getTargetDir(packageDir, targetDir, packageName);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    extractZip(source, { dir });
  } catch (error) {
    // pass
  }
};

const getPackageArchiveFile = (packageName, version) => {
  const { scope, short } = getPackageNameInfo(packageName);
  const tail = [scope, short, `v${version}.zip`].filter(Boolean);
  return path.resolve(getStorageDir(), ...tail);
};

const getTargetDir = (packageDir, targetDir, packageName) => {
  const { scope, short } = getPackageNameInfo(packageName);
  const tail = [scope, short].filter(Boolean);
  return path.resolve(packageDir, targetDir, ...tail);
};

const getFilteredDeps = (packageDir) => {
  const deps = getDependencies(packageDir);
  const packName = getPackageName();

  if (getOnlyLinks()) return [];
  else if (packName && deps[packName]) return [[packName, deps[packName]]];
  else if (getOnlyDeps()) return Object.entries(deps);
  else return getFilteredDepsByLinks(packageDir);
};

const getFilteredDepsByLinks = (packageDir) => {
  const links = getPackageConfig({ packageDir }).getLinks();
  return Object.entries(getDependencies(packageDir)).filter(
    ([key]) => !links[key]
  );
};

const getDependencies = (packageDir) => {
  return getPackageConfig({ packageDir }).getDependencies();
};

module.exports = { attach };
