const fs = require("fs");
const { hashSync } = require("bcrypt");

const { getRef, writeStorageState } = require("../../action/wrapper");
const prompts = require("../../utils/prompts");
const { warn } = require("../../utils/console");
const { SALT } = require("../../constants");

const init = () => {
  const { storageStateFile } = getRef().extConfig;

  if (fs.existsSync(storageStateFile)) warn("Storage exist already");
  else runQuestions();
};

const runQuestions = async () => {
  const { password } = await prompts.password();

  if (password) createStorage(password);
  else return;
};

const createStorage = (password) => {
  getRef().storageState.hashPassword = hashSync(password, SALT);
  createStorageDir();
  createStorageStateFile();
};

const createStorageDir = () => {
  const { storageDir } = getRef().config;

  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
  else warn("Storage directory exist already");
};

const createStorageStateFile = () => {
  const { storageStateFile } = getRef().extConfig;

  if (!fs.existsSync(storageStateFile)) writeStorageState();
  else warn("Storage state file exist already");
};

module.exports = { init };
