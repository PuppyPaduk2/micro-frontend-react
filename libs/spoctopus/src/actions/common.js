const path = require("path");
const fs = require("fs");

const {
  PATH_STORAGE_DIR,
  PATH_STATE_FILE,
  PATH_OPTIONS_FILE,
  PATH_LINKS_FILE,
} = require("../constants");
const { glob } = require("../utils/glob-promise");
const { read } = require("../utils/fs-json");
const { parsePackageName } = require("../utils/parse-package-name");

const getStorageDir = (base = process.cwd()) => {
  return path.resolve(base, PATH_STORAGE_DIR);
};

const getStateFile = (base = getStorageDir()) => {
  return path.resolve(base, PATH_STATE_FILE);
};

const getStorageOptions = (base = getStorageDir()) => {
  return path.resolve(base, PATH_OPTIONS_FILE);
};

const getLinksFile = (base = process.cwd()) => {
  return path.resolve(base, PATH_STORAGE_DIR, PATH_LINKS_FILE);
};

const searchStorageDir = (base = process.cwd()) => {
  let parsed = path.parse(base);

  while (parsed.dir !== "/") {
    const storageDir = getStorageDir(parsed.dir);

    if (fs.existsSync(storageDir)) return storageDir;

    parsed = path.parse(parsed.dir);
  }

  return null;
};

const searchPackages = () => {
  const { search } = read(getStorageOptions());
  const ignore = search ? search.ignore || [] : [];

  return glob("**/package.json", {
    cwd: process.cwd(),
    ignore: ["**/node_modules/**", ...ignore],
  });
};

const attachPackageToTargetDir = (name, targetDir, base = process.cwd()) => {
  const storageDir = searchStorageDir(base);
  const stateFile = getStateFile(storageDir);
  const pack = read(stateFile).packages[name];
  const payload = { name, targetDir, storageDir, pack };

  if (pack) createSymlinkOnPackageFromStorage(payload);
};

const createSymlinkOnPackageFromStorage = (payload = {}) => {
  const { name, targetDir, storageDir, pack } = payload;
  const packDir = path.resolve(storageDir, path.parse(pack.relativePath).dir);
  const parsedName = parsePackageName(name);
  const packTargetDir = path.resolve(process.cwd(), targetDir, parsedName.full);
  const fullTargetDir = path.parse(packTargetDir).dir;

  if (!fs.existsSync(fullTargetDir))
    fs.mkdirSync(fullTargetDir, { recursive: true });
  if (!fs.existsSync(packTargetDir)) fs.symlinkSync(packDir, packTargetDir);
};

module.exports = {
  getStorageDir,
  getStateFile,
  getStorageOptions,
  getLinksFile,
  searchStorageDir,
  searchPackages,
  attachPackageToTargetDir,
};
