const createStorage = require("../utils/storage/create").create;

const link = (packageName, options) => {
  createStorage({
    dir: "/Users/efedotov/homeprojects/micro-frontend-react/_STORAGE",
  });
};

module.exports = { link };
