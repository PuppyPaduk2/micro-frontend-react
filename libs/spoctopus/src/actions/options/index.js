const path = require("path");

const { getRef, writeGlobalOptions } = require("../../action");
const { table } = require("../../utils/console");

const set = () => {
  const ref = getRef();

  ref.globalOptions = {
    ...ref.globalOptions,
    [ref.actionOptions.name]: getValueForSet(),
  };
  writeGlobalOptions();
};

const getValueForSet = () => {
  const { actionOptions } = getRef();
  const { name, value } = actionOptions;

  if (name === "configFile") return path.resolve(process.cwd(), value);
  else return value;
};

const unset = () => {
  const ref = getRef();

  delete ref.globalOptions[ref.actionOptions.name];
  writeGlobalOptions();
};

const list = () => {
  table({
    collection: Object.entries(getRef().globalOptions),
    columns: [() => "-", ([key]) => key, () => ">", ([, value]) => value],
  });
};

const clean = () => {
  getRef().globalOptions = {};
  writeGlobalOptions();
};

module.exports = { set, unset, list, clean };
