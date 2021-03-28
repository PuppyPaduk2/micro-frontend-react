const $fs = require("./fs");
const $paths = require("./paths");
const { PACKAGE, PATHS } = require("./config");
const { parsePackageName } = require("./parse-package-name");

module.exports = {
  createStateController: (payload = {}) => {
    const dir = payload.dir;
    const pathStorageFolder = dir || PATHS.STORAGE_DIR;
    const pathStateFile = $paths.stateFile(pathStorageFolder);

    let state = {};
    let packages = {};
    let published = {};
    let linked = {};

    const controller = {
      state: () => {
        if (Object.keys(published).length) packages.published = published;
        if (Object.keys(linked).length) packages.linked = linked;
        if (Object.keys(packages).length) state.packages = packages;
        state.version = PACKAGE.version;
        return state;
      },
      read: () => {
        state = $fs.readJsonSync(pathStateFile);
        packages = state.packages || {};
        published = packages.published || {};
        linked = packages.linked || {};
        return controller;
      },
      write: () => {
        $fs.writeJsonSync(pathStateFile, controller.state());
        return controller;
      },
      link: () => {
        const pathRelative = $paths.relativeCwd({ from: pathStorageFolder });
        const pathPackage = $paths.resolve(pathStorageFolder, pathRelative);
        const pathPackageJson = $paths.packageJson(pathPackage);
        const packageJson = $fs.readJsonSync(pathPackageJson);
        linked[packageJson.name] = { pathRelative };
        return controller;
      },
      unlink: () => {
        const pathPackageJson = $paths.packageJsonCwd();
        const packageJson = $fs.readJsonSync(pathPackageJson);
        delete linked[packageJson.name];
        return controller;
      },
      symlink: (payload) => {
        const { scope, name, nameFull } = parsePackageName(payload.packageName);
        const link = linked[nameFull];

        if (!link) {
          throw new Error(`Package '${nameFull}' didn't link in storage`);
        }

        const tail = [scope, name].filter(Boolean);
        const pathNodeModulesPackage = $paths.nodeModulesCwd(...tail);
        const { pathRelative } = link;
        const pathPackage = $paths.resolve(pathStorageFolder, pathRelative);

        if ($fs.existsSync(pathNodeModulesPackage)) {
          $fs.rmSync(pathNodeModulesPackage);
        }

        $fs.mkdirRecSync($paths.parse(pathNodeModulesPackage).dir);
        $fs.symlinkSync(pathPackage, pathNodeModulesPackage);
        return controller;
      },
      unsling: (payload) => {
        const { scope, name } = parsePackageName(payload.packageName);
        const tail = [scope, name].filter(Boolean);
        const pathNodeModulesPackage = $paths.nodeModulesCwd(...tail);

        if ($fs.existsSync(pathNodeModulesPackage)) {
          $fs.rmSync(pathNodeModulesPackage);
        }

        return controller;
      },
      public: (payload) => {
        return controller;
      },
    };

    $fs.mkdirRecSync(pathStorageFolder);
    if (!$fs.existsSync(pathStateFile)) $fs.writeJsonSync(pathStateFile, {});

    return controller;
  },
};
