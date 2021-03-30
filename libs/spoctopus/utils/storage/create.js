const path = require("path");
const fs = require("fs");

const { PATHS, FULL_PATHS } = require("../../constants");

const create = (payload = {}) => {
  const defDir = payload.dir || FULL_PATHS.STORAGE_DIR;
  const dir = path.resolve(process.cwd(), defDir);
  const stateFile = path.resolve(dir, PATHS.STATE_FILE);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(stateFile)) fs.writeFileSync(stateFile, "{}");
};

module.exports = { create };
