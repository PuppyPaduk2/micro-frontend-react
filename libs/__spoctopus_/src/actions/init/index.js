const bcrypt = require("bcrypt");
const fs = require("fs");

const { getActionState } = require("../../action");
const { write } = require("../../utils/fs-json");
const { SALT } = require("../../constants");
const { warn } = require("../../utils/console");
const { password } = require("../../utils/prompts");

const answers = { password: null };

const init = () => {
  const { storageStateFile } = getActionState().extConfig;

  if (fs.existsSync(storageStateFile)) warn("Storage exist already");
  else createQuestions();
};

const createQuestions = async () => {
  answers.password = (await password()).password;
  createStorage();
};

const createStorage = () => {
  if (!answers.password) return;

  createStorageDir();
  createStorageStateFile();
};

const createStorageDir = () => {
  const { storageDir } = getActionState().config;

  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
  else warn("Storage directory exist already");
};

const createStorageStateFile = () => {
  const { storageStateFile } = getActionState().extConfig;

  if (!fs.existsSync(storageStateFile)) writeStoreState();
  else warn("Storage state file exist already");
};

const writeStoreState = () => {
  const { storageStateFile } = getActionState().extConfig;
  const hashPassword = bcrypt.hashSync(answers.password, SALT);

  write(storageStateFile, { hashPassword });
};

module.exports = { init };
