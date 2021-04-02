const publicPackage = require("../utils/storage/public").public;

const public = () => {
  publicPackage();
};

module.exports = { public };
