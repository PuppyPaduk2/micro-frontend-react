#!/usr/bin/env node
const { Command } = require("commander");

const { PACKAGE } = require("./config");
const { createConfigController } = require("./config-controllers");
const { createStateController } = require("./storage-controllers");
const { actionWrapperSync } = require("./action-wrapper");

const program = new Command();

program.version(PACKAGE.version);

// State
program.command("link [packageName]").action((packageName) => {
  actionWrapperSync({
    callback: () => {
      const stateController = createStateController().read();

      if (packageName) {
        const configController = createConfigController().read();
        configController.link({ packageName }).write();
        try {
          stateController.symlink({ packageName });
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
  actionWrapperSync({
    callback: () => {
      const stateController = createStateController().read();

      if (packageName) {
        const configController = createConfigController().read();
        configController.unlink({ packageName }).write();
        try {
          stateController.unsling({ packageName });
        } catch (error) {
          configController.link({ packageName }).write();
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
  actionWrapperSync({
    callback: () => {
      const configController = createConfigController({ path });
      configController.read().add({ packageName }).write();
    },
    messageDone: "Package added",
  });
});

program.parse(process.argv);
