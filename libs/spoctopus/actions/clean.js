const prompts = require("prompts");

const removeStorage = require("../utils/storage/remove").remove;

const clean = () => {
  prompts({
    type: "password",
    name: "password",
    message: "Insert password",
  }).then(({ password }) => password && removeStorage(password));
};

module.exports = { clean };
