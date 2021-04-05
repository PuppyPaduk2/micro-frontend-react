const { extConfig } = require("../action/config");
const { read: readJson } = require("../fs-json/read");
const { write: writeJson } = require("../fs-json/write");
const { PACKAGE } = require("../../constants");

let state = {};
let packages = {};
let published = {};
let linked = {};

const read = () => {
  state = readJson(extConfig().stateFile);
  packages = state.packages || {};
  published = packages.published || {};
  linked = packages.linked || {};
};

const build = () => {
  if (Object.keys(published).length) packages.published = published;
  else delete packages.published;
  if (Object.keys(linked).length) packages.linked = linked;
  else delete packages.linked;
  if (Object.keys(packages).length) state.packages = packages;
  else delete state.packages;
  state.version = PACKAGE.version;
};

const write = () => {
  build();
  writeJson(extConfig().stateFile, state);
};

module.exports = {
  state: () => state,
  packages: () => packages,
  published: () => published,
  linked: () => linked,
  read,
  write,
};
