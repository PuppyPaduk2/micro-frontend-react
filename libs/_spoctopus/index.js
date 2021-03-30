#!/usr/bin/env node
const { Command: $Command } = require("commander");
const $path = require("path");

const { PACKAGE, SEARCH } = require("./config");
const { createConfigController } = require("./config-controllers");
const { createStateController } = require("./storage-controllers");
const { actionSync, action } = require("./action-wrapper");
const { search } = require("./search");

const program = new $Command();

program.version(PACKAGE.version);

// State
program
  .command("link [packageName]")
  .option("-d, --dir <dir>", "Dir for symlink")
  .action((packageName, options) => {
    actionSync({
      callback: () => {
        const defaultDir = $path.resolve(process.cwd(), PATHS.NODE_MODULES);
        const dir = options.dir || defaultDir;
        const stateController = createStateController().read();

        if (packageName) {
          const configController = createConfigController().read();
          configController.link({ packageName, dir }).write();
          try {
            stateController.symlink({ packageName, dir });
          } catch (error) {
            configController.unlink({ packageName }).write();
            throw error;
          }
        } else {
          stateController.link().write();
        }
      },
      messageDone: "Package linked",
    });
  });

program.command("unlink [packageName]").action((packageName) => {
  actionSync({
    callback: () => {
      const stateController = createStateController().read();

      if (packageName) {
        const configController = createConfigController().read();
        const { dir } = configController.takeLink({ packageName });
        configController.unlink({ packageName }).write();
        try {
          stateController.unsling({ packageName, dir });
        } catch (error) {
          configController.link({ packageName, dir }).write();
          throw error;
        }
      } else {
        stateController.unlink().write();
      }
    },
    messageDone: "Package unlinked",
  });
});

program.command("search").action(() => {
  action({
    callback: async () => {
      const stateController = createStateController().read();
      await stateController.linkSearch();
      stateController.write();
    },
    messageDone: "Packages searched",
  });
});

program.command("setup").action(() => {
  action({
    callback: async () => {
      const stateController = createStateController().read();
      const paths = await search(SEARCH.PATTERN, {
        cwd: process.cwd(),
        ignore: SEARCH.IGNORE,
      });

      if (paths instanceof Array) {
        paths.forEach((path) => {
          const packageDir = $path.resolve(
            process.cwd(),
            $path.parse(path).dir
          );
          const config = createConfigController({ packageDir }).read().config();

          if (config.packages && config.packages.links) {
            Object.entries(config.packages.links).forEach(
              ([packageName, params]) => {
                try {
                  console.log(packageDir);
                  console.log($path.resolve(packageDir, params.dir));
                  stateController.symlink({ packageName, dir: params.dir });
                } catch (error) {
                  // pass
                }
              }
            );
          }
        });
      }
    },
    messageDone: "Packages ready",
  });
});

// Config
program.command("add <packageName>").action((packageName) => {
  actionSync({
    callback: () => {
      const configController = createConfigController({ path });
      configController.read().add({ packageName }).write();
    },
    messageDone: "Package added",
  });
});

program.parse(process.argv);
