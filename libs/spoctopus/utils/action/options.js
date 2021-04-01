let options = {};

const update = (program) => {
  options = program.opts() || {};
};

module.exports = { getOptions: () => options, update };
