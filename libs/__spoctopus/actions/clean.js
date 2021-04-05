const prompts = require("prompts");

const cleanStorage = require("../utils/storage/clean").clean;

const clean = () => {
  prompts({
    type: "password",
    name: "password",
    message: "Insert password",
  }).then(({ password }) => password && cleanStorage(password));
};

module.exports = { clean };
