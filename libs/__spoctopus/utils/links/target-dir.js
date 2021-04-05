const path = require("path");

const { getScope, getName } = require("../package-name/scope");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

// TODO more cleaner
const getTargetDir = ({ packageName, packageDir, targetDir }) => {
  const scope = getScope(packageName);
  const name = getName(packageName);
  const tail = [scope, name].filter(Boolean);
  packageDir = getPackageDir(packageDir || process.cwd());
  return path.resolve(packageDir, targetDir, ...tail);
};

module.exports = { getTargetDir };
