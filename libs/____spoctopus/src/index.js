#!/usr/bin/env node
const { Command } = require("commander");

const { PACKAGE } = require("./constants");
const { actionWrapper } = require("./action/wrapper");
const { init } = require("./actions/init");

const program = new Command();
const wrapper = actionWrapper(program);

program.version(PACKAGE.version);

program.option("-c, --config-file <path>", "Path to config");

program.command("init").action(wrapper(init));

const options = program.command("options");

options.command("set <name> <value>");

options.command("unset <name>");

options.command("list");

options.command("clean");

program.command("clean");

program.parse(process.argv);
