#!/usr/bin/env node
const { Command } = require("commander");

const { PACKAGE, PATHS } = require("./constants");
const { actionWrapper } = require("./action");
const actions = require("./actions");

const program = new Command();
const wrapper = actionWrapper(program);

program.version(PACKAGE.version);

program.option("-c, --config-file <path>", "Path to config");

program.command("init").action(wrapper(actions.init));

const options = program.command("options");

options
  .command("set <name> <value>")
  .action(wrapper(actions.options.set, ([name, value]) => ({ name, value })));
options
  .command("unset <name>")
  .action(wrapper(actions.options.unset, ([name]) => ({ name })));
options.command("list").action(wrapper(actions.options.list));
options.command("clean").action(wrapper(actions.options.clean));

program.command("clean").action(wrapper(actions.clean));

program
  .command("link [packageName]")
  .option("-t, --target-dir <dir>", "Target directory for attach")
  .option("-i, --interactive", "Interactive mode for pick package")
  .option("-s, --search", "Auto link packages by searching")
  .action(
    wrapper(actions.link, ([packageName, options], globalOptions) => ({
      packageName: packageName || null,
      targetDir:
        options.targetDir ||
        globalOptions["actions.link.targetDir"] ||
        PATHS.NODE_MODULES,
      interactive: Boolean(options.interactive),
      search: Boolean(options.search),
    }))
  );

program.parse(process.argv);
