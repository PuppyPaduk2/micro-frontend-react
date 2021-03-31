const fs = require("fs");

const { config } = require("../action/config");

const remove = () => {
  const { storageDir } = config();

  if (fs.existsSync(storageDir)) fs.rmSync(storageDir, { recursive: true });
};

module.exports = { remove };
