const { compareSync } = require("bcrypt");
const fs = require("fs");

const { password } = require("../../utils/prompts");
const { getActionState } = require("../../action");
const { warn, error } = require("../../utils/console");

const answers = { password: null };

const clean = () => {
  const { storageDir } = getActionState().config;

  if (fs.existsSync(storageDir)) createQuestions();
  else warn("Storage directory doesn't exist");
};

const createQuestions = async () => {
  answers.password = (await password()).password;
  cleanStorage();
};

const cleanStorage = () => {
  const { storageDir } = getActionState().config;
  const { password } = answers;
  const { hashPassword } = getActionState().storageState;

  if (compareSync(password, hashPassword))
    fs.rmSync(storageDir, { recursive: true });
  else error("Password is incorrect");
};

module.exports = { clean };
