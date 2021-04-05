const { getOptions } = require("../../utils/action/options");
const { logTable } = require("../../utils/console-log/table");

const list = () => {
  console.log("Options:");
  logTable({
    collection: Object.entries(getOptions()),
    columns: [() => "-", ([key]) => key, () => ">", ([, value]) => value],
  });
};

module.exports = { list };
