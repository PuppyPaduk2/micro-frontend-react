const fs = require("fs");

const { FULL_PATHS } = require("../../constants");
const { read } = require("../fs-json/read");
const { write } = require("../fs-json/write");

const { OPTIONS_FILE } = FULL_PATHS;

let options = {};

const update = (program) => {
  options = { ...readOptions(), ...program.opts() };
};

const readOptions = () => {
  if (fs.existsSync(OPTIONS_FILE)) return read(OPTIONS_FILE);
  else return {};
};

const writeOptions = () => {
  write(OPTIONS_FILE, options);
};

const cleanOptions = () => {
  options = {};
};

module.exports = {
  getOptions: () => options,
  update,
  writeOptions,
  cleanOptions,
};
