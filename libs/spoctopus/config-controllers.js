const $fs = require("./fs");
const $paths = require("./paths");
const { PACKAGE, PATHS } = require("./config");
const { parsePackageName } = require("./parse-package-name");

module.exports = {
  createConfigController: () => {
    let pack = {};
    let config = {};
    let packages = {};
    let depends = {};
    let links = {};

    const controller = {
      config: () => {
        if (Object.keys(links).length) packages.links = links;
        if (Object.keys(depends).length) packages.depends = depends;
        if (Object.keys(packages).length) config.packages = packages;
        return config;
      },
      read: () => {
        pack = $fs.readJsonSync($paths.packageJsonCwd());
        config = pack[PACKAGE.name] || {};
        packages = config.packages || {};
        depends = packages.depends || {};
        links = packages.links || {};
        return controller;
      },
      write: () => {
        pack[PACKAGE.name] = controller.config();
        $fs.writeJsonSync($paths.packageJsonCwd(), pack);
        return controller;
      },
      takeLink: (payload) => {
        const { nameFull } = parsePackageName(payload.packageName);
        return links[nameFull] || null;
      },
      link: (payload) => {
        const { nameFull } = parsePackageName(payload.packageName);
        const dir = payload.dir || PATHS.NODE_MODULES;

        if (pack.name === nameFull) {
          throw new Error("Package are linking self");
        }

        if (links[nameFull]) {
          throw new Error("Package linked already");
        }

        console.log(links, nameFull);

        if (!links[nameFull]) {
          links[nameFull] = { dir };
        }

        return controller;
      },
      unlink: (payload) => {
        const { nameFull } = parsePackageName(payload.packageName);
        delete links[nameFull];
        return controller;
      },
      add: () => {
        return controller;
      },
    };

    return controller;
  },
};
