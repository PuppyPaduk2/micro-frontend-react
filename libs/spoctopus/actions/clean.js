const removeStorage = require("../utils/storage/remove").remove;

const clean = () => {
  removeStorage();
};

module.exports = { clean };
