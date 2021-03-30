const $path = require("path");

const $fs = require("./fs");
const $paths = require("./paths");
const { PACKAGE, PATHS, SEARCH } = require("./config");
const { parsePackageName } = require("./parse-package-name");
const { search } = require("./search");

module.exports = {
  createStateController: (payload = {}) => {
    const pathDefaultStorageDir = $path.resolve(__dirname, PATHS.STORAGE_DIR);
    const pathStorageDir = payload.storageDir || pathDefaultStorageDir;
    const pathStateFile = $paths.stateFile(pathStorageDir);

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
      link: (payload = {}) => {
        const dir = payload.dir || process.cwd();
        const pathRelative = $path.relative(pathStorageDir, dir);
        const pathPackage = $path.resolve(pathStorageDir, pathRelative);
        const pathPackageJson = $path.resolve(pathPackage, PATHS.PACKAGE_JSON);
        const packageJson = $fs.readJsonSync(pathPackageJson);
        if (linked[packageJson.name]) throw new Error("Package linked already");
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
        const dir = payload.dir;
        const link = linked[nameFull];

        if (!link) {
          throw new Error(`Package '${nameFull}' didn't link in storage`);
        }

        const tail = [scope, name].filter(Boolean);
        const pathNodeModulesPackage = $path.resolve(dir, ...tail);
        const { pathRelative } = link;
        const pathPackage = $path.resolve(pathStorageDir, pathRelative);

        if ($fs.existsSync(pathNodeModulesPackage)) {
          $fs.rmRecursiveSync(pathNodeModulesPackage);
        }

        $fs.mkdirRecursiveSync($path.parse(pathNodeModulesPackage).dir);
        $fs.symlinkSync(pathPackage, pathNodeModulesPackage);
        return controller;
      },
      unsling: (payload) => {
        const { scope, name } = parsePackageName(payload.packageName);
        const dir = payload.dir || PATHS.NODE_MODULES;
        const tail = [scope, name].filter(Boolean);
        const pathNodeModulesPackage = $paths.resolveCwd(dir, ...tail);

        if ($fs.existsSync(pathNodeModulesPackage)) {
          $fs.rmRecursiveSync(pathNodeModulesPackage);
        }

        return controller;
      },
      linkSearch: async () => {
        const paths = await search(SEARCH.PATTERN, {
          cwd: process.cwd(),
          ignore: SEARCH.IGNORE,
        });

        if (paths instanceof Array) {
          paths.forEach((path) => {
            controller.link({ dir: $path.parse(path).dir });
          });
        }

        return controller;
      },
      public: (payload) => {
        return controller;
      },
    };

    $fs.mkdirRecursiveSync(pathStorageDir);
    if (!$fs.existsSync(pathStateFile)) $fs.writeJsonSync(pathStateFile, {});

    return controller;
  },
};
