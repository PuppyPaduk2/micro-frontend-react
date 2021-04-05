const removeDepend = require("../utils/package-config/remove").remove;

const remove = () => {
  removeDepend();
};

module.exports = { remove };
