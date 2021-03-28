const $fs = require("./fs");
const $paths = require("./paths");
const { PACKAGE } = require("./config");
const { parsePackageName } = require("./parse-package-name");

module.exports = {
  createConfigController: () => {
    let pack = {};
    let config = {};
    let packages = {};
    let depends = {};
    let links = [];

    const controller = {
      config: () => {
        if (links.length) packages.links = links;
        if (Object.keys(depends).length) packages.depends = depends;
        if (Object.keys(packages).length) config.packages = packages;
        return config;
      },
      read: () => {
        pack = $fs.readJsonSync($paths.packageJsonCwd());
        config = pack[PACKAGE.name] || {};
        packages = config.packages || {};
        depends = packages.depends || {};
        links = packages.links || [];
        return controller;
      },
      write: () => {
        pack[PACKAGE.name] = controller.config();
        $fs.writeJsonSync($paths.packageJsonCwd(), pack);
        return controller;
      },
      link: (payload) => {
        const { nameFull } = parsePackageName(payload.packageName);

        if (pack.name === nameFull) {
          throw new Error("Package are linking self");
        }

        if (!links.includes(nameFull)) {
          links.push(nameFull);
        }

        return controller;
      },
      unlink: (payload) => {
        const { nameFull } = parsePackageName(payload.packageName);
        const index = links.indexOf(nameFull);
        if (index === -1) throw new Error("Package didn't link");
        links.splice(index, 1);
        return controller;
      },
      add: () => {
        return controller;
      },
    };

    return controller;
  },
};
