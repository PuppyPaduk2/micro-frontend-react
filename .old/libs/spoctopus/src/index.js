#!/usr/bin/env node
const { Command } = require("commander");

const { PACKAGE_VERSION } = require("./constants");

const program = new Command();

program.version(PACKAGE_VERSION);

program.command("init").action(require("./actions/init"));

program.command("search").action(require("./actions/search"));

program.command("link <name> <targetDir>").action(require("./actions/link"));

program.command("attach").action(require("./actions/attach"));

program.parse(process.argv);
