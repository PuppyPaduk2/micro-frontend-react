const fs = require("fs");
const bcrypt = require("bcrypt");

const { config } = require("../action/config");
const readState = require("../storage/state").read;
const getState = require("../storage/state").state;

const remove = (password) => {
  readState();

  if (bcrypt.compareSync(password, getState().hashPassword)) removeStorageDir();
};

const removeStorageDir = () => {
  const { storageDir } = config();

  if (fs.existsSync(storageDir)) fs.rmSync(storageDir, { recursive: true });
};

module.exports = { remove };
