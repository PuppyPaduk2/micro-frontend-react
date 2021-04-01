const prompts = require("prompts");

const createStorage = require("../utils/storage/create").create;

const init = () => {
  prompts({
    type: "password",
    name: "password",
    message: "Insert password",
  }).then(({ password }) => password && createStorage(password));
};

module.exports = { init };
