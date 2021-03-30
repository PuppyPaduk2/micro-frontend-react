const removeStorage = require("../utils/storage/remove").remove;

const clean = () => {
  removeStorage({
    dir: "/Users/efedotov/homeprojects/micro-frontend-react/_STORAGE",
  });
};

module.exports = { clean };
