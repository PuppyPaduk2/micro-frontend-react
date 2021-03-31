const path = require("path");
const fs = require("fs");

const readConfig = require("../package-config/read").read;
const { getTargetDir } = require("./target-dir");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

const detach = (payload = {}) => {
  const packageDir = getPackageDir(payload.packageDir || process.cwd());
  const { getLinks } = readConfig({ packageDir });

  Object.entries(getLinks()).forEach(([packageName, packageParams]) => {
    detachPackage({ packageDir, packageName, packageParams });
  });
};

const detachPackage = (payload = {}) => {
  const targetDir = getTargetDir(payload);
  if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
};

module.exports = { detach };
