#!/usr/bin/env node
const { Command } = require("commander");

const { PACKAGE } = require("./constants");
const { actionWrapper } = require("./action");
const actions = require("./actions");

const program = new Command();
const wrapper = actionWrapper(program);

program.version(PACKAGE.version);

program.option("-c, --config-file <path>", "Path to config");

program.command("init").action(wrapper(actions.init));

program.command("clean").action(wrapper(actions.clean));

program.parse(process.argv);
