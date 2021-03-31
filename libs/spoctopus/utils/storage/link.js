const path = require("path");

const { PATHS, SEARCH } = require("../../constants");
const { config } = require("../action/config");
const { read } = require("../fs-json/read");
const { getFullName } = require("../package-name/full-name");
const { read: readState, linked, write: writeState } = require("./state");
const { glob } = require("../glob-promise");

const getPackageDir = (dir) => path.resolve(process.cwd(), dir);

const link = (payload = {}) => {
  const { storageDir } = config();
  const packageDir = getPackageDir(payload.packageDir || process.cwd());
  const packageJsonFile = path.resolve(packageDir, PATHS.PACKAGE_JSON);
  const packageJson = read(packageJsonFile);
  const packageName = getFullName(packageJson.name);

  readState();
  linked()[packageName] = {
    relativePath: path.relative(storageDir, packageDir),
  };
  writeState();
};

const autoLink = () => {
  glob(SEARCH.PATTERN, {
    cwd: process.cwd(),
    ignore: SEARCH.IGNORE,
  }).then((paths) => {
    if (paths instanceof Array) {
      const getDir = (value) => path.parse(value).dir;
      paths.forEach((value) => link({ packageDir: getDir(value) }));
    }
  });
};

module.exports = { link, autoLink };
