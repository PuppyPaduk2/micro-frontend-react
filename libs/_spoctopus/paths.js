const $path = require("path");

const { PATHS } = require("./config");

module.exports = {
  resolveCwd: (...paths) => $path.resolve(process.cwd(), ...paths),
  stateFile: (dir) => $path.resolve(dir, PATHS.STATE_FILE),
  packageJson: (dir) => $path.resolve(dir, PATHS.PACKAGE_JSON),
  packageJsonCwd: () => $path.resolve(process.cwd(), PATHS.PACKAGE_JSON),
  nodeModulesCwd: (...paths) =>
    $path.resolve(process.cwd(), PATHS.NODE_MODULES, ...paths),
};
