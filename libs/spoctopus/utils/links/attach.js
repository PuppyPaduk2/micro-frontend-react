const path = require("path");
const fs = require("fs");

const { read: readConfig } = require("../package-config/read");
const readState = require("../storage/state").read;
const getLinked = require("../storage/state").linked;
const { config: getConfig } = require("../action/config");
const { getTargetDir } = require("./target-dir");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

const attach = (payload = {}) => {
  const packageDir = getPackageDir(payload.packageDir || process.cwd());
  const { getLinks } = readConfig({ packageDir });

  readState();

  Object.entries(getLinks()).forEach(([packageName, packageParams]) => {
    const linkedPackage = getLinked()[packageName];
    const params = { packageDir, packageName, linkedPackage, packageParams };

    if (linkedPackage) attachPackage(params);
  });
};

const attachPackage = (payload = {}) => {
  const linkedPackageDir = getLinkedPackageDir(payload);
  const targetDir = getTargetDir(payload);

  if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });

  fs.mkdirSync(path.parse(targetDir).dir, { recursive: true });
  fs.symlinkSync(linkedPackageDir, targetDir);
};

const getLinkedPackageDir = (payload = {}) => {
  const { storageDir } = getConfig();
  const linkedPackage = payload.linkedPackage;
  return path.resolve(storageDir, linkedPackage.relativePath);
};

module.exports = { attach };
