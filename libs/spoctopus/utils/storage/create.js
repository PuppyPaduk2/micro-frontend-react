const fs = require("fs");

const { config, extConfig } = require("../action/config");

const create = () => {
  const { storageDir } = config();
  const { stateFile } = extConfig();

  if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir, { recursive: true });
  if (!fs.existsSync(stateFile)) fs.writeFileSync(stateFile, "{}");
};

module.exports = { create };
