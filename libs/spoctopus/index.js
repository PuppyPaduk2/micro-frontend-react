#!/usr/bin/env node
const Command = require("commander").Command;

const { PACKAGE } = require("./constants");

const program = new Command();

program.version(PACKAGE.version);

program.option("-c, --config <path>", "Path to config");

program
  .command("link [packageName]")
  .option("-d, --dir <dir>", "Dir for symlink")
  .action(require("./actions/link").link);

program
  .command("unlink [packageName]")
  .action(require("./actions/unlink").unlink);

program.command("search").action(require("./actions/search").search);

program.command("setup").action(require("./actions/setup").setup);

program.command("clean").action(require("./actions/clean").clean);

program.parse(process.argv);
