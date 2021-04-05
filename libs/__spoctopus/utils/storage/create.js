const fs = require("fs");
const bcrypt = require("bcrypt");

const { config, extConfig } = require("../action/config");
const write = require("../fs-json/write").write;
const { SALT } = require("../../constants");

const create = (password) => {
  const { storageDir } = config();
  const { stateFile } = extConfig();

  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
  if (!fs.existsSync(stateFile)) writeState(password);
};

const writeState = (password) => {
  const { stateFile } = extConfig();
  const hashPassword = bcrypt.hashSync(password, SALT);
  const state = { hashPassword };

  write(stateFile, state);
};

module.exports = { create };
