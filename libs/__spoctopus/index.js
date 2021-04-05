#!/usr/bin/env node
const Command = require("commander").Command;

const { PACKAGE } = require("./constants");
const actionWrapper = require("./utils/action/wrapper").wrapper;

const program = new Command();

program.version(PACKAGE.version);

program.option("-c, --config <path>", "Path to config");

program
  .command("init")
  .action(actionWrapper(program, require("./actions/init").init));

const options = program.command("options");

options
  .command("set <name> <value>")
  .action(actionWrapper(program, require("./actions/options/set").set));

options
  .command("unset <name>")
  .action(actionWrapper(program, require("./actions/options/unset").unset));

options
  .command("list")
  .action(actionWrapper(program, require("./actions/options/list").list));

options
  .command("clean")
  .action(actionWrapper(program, require("./actions/options/clean").clean));

program
  .command("link [packageName]")
  .option("-t, --target-dir <dir>", "Target directory for attach")
  .option("-i, --interactive", "Interactive mode for pick package")
  .option("--auto", "Auto link packages")
  .action(actionWrapper(program, require("./actions/link").link));

program
  .command("unlink [packageName]")
  .action(actionWrapper(program, require("./actions/unlink").unlink));

program
  .command("attach [packageName]")
  .option("--auto", "Auto attach packages")
  .option("-l, --links", "Only links")
  .option("-d, --deps", "Only dependencies")
  .action(actionWrapper(program, require("./actions/attach").attach));

program
  .command("detach [packageName]")
  .option("--auto", "Auto detach packages")
  .action(actionWrapper(program, require("./actions/detach").detach));

program
  .command("public")
  .action(actionWrapper(program, require("./actions/public").public));

program
  .command("add <packageName>")
  .option("-t, --target-dir <dir>", "Target directory for attach")
  .action(actionWrapper(program, require("./actions/add").add));

program
  .command("remove <packageName>")
  .action(actionWrapper(program, require("./actions/remove").remove));

program
  .command("clean")
  .action(actionWrapper(program, require("./actions/clean").clean));

program
  .command("list")
  .action(actionWrapper(program, require("./actions/list").list));

program.parse(process.argv);

// TODO save for install
// console.log(module.paths[module.paths.length - 3]);
