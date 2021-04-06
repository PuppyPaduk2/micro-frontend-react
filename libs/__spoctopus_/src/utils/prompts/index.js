const prompts = require("prompts");

const password = () => {
  return prompts({
    type: "password",
    name: "password",
    message: "Insert password",
  });
};

module.exports = { password };
