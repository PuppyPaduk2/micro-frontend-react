const { compareSync } = require("bcrypt");
const fs = require("fs");

const prompts = require("../../utils/prompts");
const { getRef } = require("../../action/wrapper");
const { warn, error } = require("../../utils/console");

const clean = () => {
  if (fs.existsSync(getRef().config.storageDir)) runQuestions();
  else warn("Storage directory doesn't exist");
};

const runQuestions = async () => {
  const { password } = await prompts.password();
  const { hashPassword } = getRef().storageState;

  if (compareSync(password, hashPassword)) cleanStorage();
  else error("Password is incorrect");
};

const cleanStorage = () => {
  fs.rmSync(getRef().config.storageDir, { recursive: true });
};

module.exports = { clean };
