const path = require("path");
const fs = require("fs");

const readConfig = require("../package-config/read").read;
const { getTargetDir } = require("./target-dir");
const getArgs = require("../action/args").args;
const { glob } = require("../glob-promise");
const { SEARCH } = require("../../constants");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

const detach = (packageDir) => {
  const targetPackageName = getArgs()[0];

  if (targetPackageName) detachTargetPackage(packageDir);
  else detachAllPackages(packageDir);
};

const detachTargetPackage = (packageDir) => {
  packageDir = getPackageDir(packageDir || process.cwd());
  const targetPackageName = getArgs()[0];
  const links = Object.entries(readConfig({ packageDir }).getLinks());
  const filter = ([packageName]) => packageName === targetPackageName;
  const link = links.filter(filter)[0];

  if (link) detachEachPackage(packageDir)(link);
};

const detachAllPackages = (packageDir) => {
  packageDir = getPackageDir(packageDir || process.cwd());
  const links = Object.entries(readConfig({ packageDir }).getLinks());

  links.forEach(detachEachPackage(packageDir));
};

const detachEachPackage = (packageDir) => ([packageName, { targetDir }]) => {
  targetDir = getTargetDir({ packageDir, packageName, targetDir });
  if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
};

const autoDetach = () => {
  const eachPath = (value) => detach(path.parse(value).dir);

  glob(SEARCH.PATTERN, {
    cwd: process.cwd(),
    ignore: SEARCH.IGNORE,
  }).then((paths) => onlyArray(paths).forEach(eachPath));
};

const onlyArray = (value) => {
  if (value instanceof Array) return value;
  else [];
};

module.exports = { detach, autoDetach };
