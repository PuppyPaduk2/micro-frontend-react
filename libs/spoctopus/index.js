#!/usr/bin/env node
const { Command } = require("commander");

const { PACKAGE } = require("./config");
const { createConfigController } = require("./config-controllers");
const { createStateController } = require("./storage-controllers");
const { actionSync, action } = require("./action-wrapper");

const program = new Command();

program.version(PACKAGE.version);

// State
program
  .command("link [packageName]")
  .option("-d, --dir <dir>", "Dir for symlink")
  .action((packageName, options) => {
    actionSync({
      callback: () => {
        const { dir } = options;
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
  })
  .command("search")
  .action(() => {
    action({
      callback: async () => {
        const stateController = createStateController().read();
        await stateController.linkSearch();
        stateController.write();
      },
      messageDone: "Packages searched",
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
