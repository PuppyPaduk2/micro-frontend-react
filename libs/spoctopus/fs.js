const fs = require("fs");

module.exports = {
  readJsonSync: (path) => JSON.parse(fs.readFileSync(path).toString()),
  writeJsonSync: (path, data) =>
    fs.writeFileSync(path, JSON.stringify(data, null, 2)),
  mkdirRecSync: (path) => fs.mkdirSync(path, { recursive: true }),
  existsSync: (path) => fs.existsSync(path),
  symlinkSync: (target, path) => fs.symlinkSync(target, path, "dir"),
  rmSync: (path) => fs.rmSync(path, { recursive: true }),
};
