const path = require("path");

const { getScope, getName } = require("../package-name/scope");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

const getTargetDir = (payload = {}) => {
  const scope = getScope(payload.packageName);
  const name = getName(payload.packageName);
  const targetTail = [scope, name].filter(Boolean);
  const { targetDir } = payload.packageParams;
  const packageDir = getPackageDir(payload.packageDir || process.cwd());
  return path.resolve(packageDir, targetDir, ...targetTail);
};

module.exports = { getTargetDir };
