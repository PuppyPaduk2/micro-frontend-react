const $path = require("path");

const { PATHS } = require("./config");

module.exports = {
  resolve: (...paths) => $path.resolve(...paths),
  resolveCwd: (...paths) => $path.resolve(process.cwd(), ...paths),
  relative: (from, to) => $path.relative(from, to),
  relativeCwd: ({ from, to }) =>
    $path.relative(from || process.cwd(), to || process.cwd()),
  stateFile: (dir) => $path.resolve(dir, PATHS.STATE_FILE),
  packageJson: (dir) => $path.resolve(dir, PATHS.PACKAGE_JSON),
  packageJsonCwd: () => $path.resolve(process.cwd(), PATHS.PACKAGE_JSON),
  nodeModules: (dir, ...paths) =>
    $path.resolve(dir, PATHS.NODE_MODULES, ...paths),
  nodeModulesCwd: (...paths) =>
    $path.resolve(process.cwd(), PATHS.NODE_MODULES, ...paths),
  parse: (path) => $path.parse(path),
};
