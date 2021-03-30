const fs = require("fs");
const path = require("path");

const { FULL_PATHS } = require("../../constants");

const remove = (payload = {}) => {
  const defDir = payload.dir || FULL_PATHS.STORAGE_DIR;
  const dir = path.resolve(process.cwd(), defDir);

  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
};

module.exports = { remove };
