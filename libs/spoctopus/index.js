#!/usr/bin/env node
const Command = require("commander").Command;

const { PACKAGE } = require("./constants");
const actionWrapper = require("./utils/action/wrapper").wrapper;

const program = new Command();

program.version(PACKAGE.version);

program.option("-c, --config <path>", "Path to config");

program
  .command("link [packageName]")
  .option("-d, --dir <dir>", "Dir for symlink")
  .option("--auto", "Auto link packages")
  .action(actionWrapper(program, require("./actions/link").link));

program
  .command("unlink [packageName]")
  .action(actionWrapper(program, require("./actions/unlink").unlink));

program
  .command("attach")
  .action(actionWrapper(program, require("./actions/attach").attach));

program
  .command("detach")
  .action(actionWrapper(program, require("./actions/detach").detach));

program
  .command("setup")
  .action(actionWrapper(program, require("./actions/setup").setup));

program
  .command("clean")
  .action(actionWrapper(program, require("./actions/clean").clean));

program
  .command("list")
  .action(actionWrapper(program, require("./actions/list").list));

program.parse(process.argv);
