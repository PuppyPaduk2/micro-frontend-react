#!/usr/bin/env node
const Command = require("commander").Command;

const { PACKAGE } = require("./constants");
const updateConfig = require("./utils/config/current").updateWrapper;

const program = new Command();

program.version(PACKAGE.version);

program.option("-c, --config <path>", "Path to config");

program
  .command("link [packageName]")
  .option("-d, --dir <dir>", "Dir for symlink")
  .action(updateConfig(program, require("./actions/link").link));

program
  .command("unlink [packageName]")
  .action(updateConfig(program, require("./actions/unlink").unlink));

program
  .command("search")
  .action(updateConfig(program, require("./actions/search").search));

program
  .command("setup")
  .action(updateConfig(program, require("./actions/setup").setup));

program
  .command("clean")
  .action(updateConfig(program, require("./actions/clean").clean));

program.parse(process.argv);
