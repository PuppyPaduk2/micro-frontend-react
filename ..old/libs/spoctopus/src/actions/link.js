const { read, write } = require("../utils/fs-json");
const { attachPackageToTargetDir, getLinksFile } = require("./common");
const { parsePackageName } = require("../utils/parse-package-name");

const setLinkToLinksFile = (name, targetDir) => {
  const parsedName = parsePackageName(name);
  const links = read(getLinksFile());

  write(getLinksFile(), { ...links, [parsedName.full]: targetDir });
};

module.exports = (name, targetDir) => {
  attachPackageToTargetDir(name, targetDir);
  setLinkToLinksFile(name, targetDir);
};
