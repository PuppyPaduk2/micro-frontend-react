const path = require("path");
const fs = require("fs");

const readConfig = require("../package-config/read").read;
const readState = require("../storage/state").read;
const getStateLinked = require("../storage/state").linked;
const getConfig = require("../action/config").config;
const getArgs = require("../action/args").args;
const { getFullName } = require("../package-name/full-name");
const { getTargetDir } = require("./target-dir");
const { glob } = require("../glob-promise");
const { SEARCH } = require("../../constants");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

const attach = (packageDir) => {
  const targetPackageName = getArgs()[0];

  if (targetPackageName) attachTargetPackage(packageDir);
  else attachAllPackages(packageDir);
};

const attachTargetPackage = (packageDir) => {
  packageDir = getPackageDir(packageDir || process.cwd());
  const targetPackageName = getFullName(getArgs()[0]);
  const links = Object.entries(readConfig({ packageDir }).getLinks());
  const filter = ([packageName]) => packageName === targetPackageName;
  const link = links.filter(filter)[0];

  if (link) attachEachPackage(packageDir)(link);
};

const attachAllPackages = (packageDir) => {
  packageDir = getPackageDir(packageDir || process.cwd());
  const links = Object.entries(readConfig({ packageDir }).getLinks());

  links.forEach(attachEachPackage(packageDir));
};

const attachEachPackage = (packageDir) => ([packageName, { targetDir }]) => {
  readState();

  packageDir = getPackageDir(packageDir || process.cwd());
  const linkedPackage = getStateLinked()[packageName];
  const options = { packageDir, packageName, targetDir, linkedPackage };

  if (linkedPackage) attachPackage(options);
};

const attachPackage = (payload) => {
  const { packageDir, packageName, linkedPackage } = payload;
  let { targetDir } = payload;
  const linkedPackageDir = getLinkedPackageDir(linkedPackage.relativePath);
  targetDir = getTargetDir({ packageName, packageDir, targetDir });

  if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });

  fs.mkdirSync(path.parse(targetDir).dir, { recursive: true });
  fs.symlinkSync(linkedPackageDir, targetDir);
};

const getLinkedPackageDir = (relativePath) => {
  const { storageDir } = getConfig();
  return path.resolve(storageDir, relativePath);
};

const autoAttach = () => {
  const eachPath = (value) => attach(path.parse(value).dir);

  glob(SEARCH.PATTERN, {
    cwd: process.cwd(),
    ignore: SEARCH.IGNORE,
  }).then((paths) => onlyArray(paths).forEach(eachPath));
};

const onlyArray = (value) => {
  if (value instanceof Array) return value;
  else [];
};

module.exports = { attach, autoAttach };
