const path = require("path");

const {
  searchPackages,
  getLinksFile,
  attachPackageToTargetDir,
} = require("./common");
const { read } = require("../utils/fs-json");

const attachLinks = (packageJsonFile) => {
  const fullPackageJsonFile = path.resolve(process.cwd(), packageJsonFile);
  const packageDir = path.parse(fullPackageJsonFile).dir;
  const linksFile = getLinksFile(packageDir);
  const links = Object.entries(read(linksFile));

  links.forEach(attachLink(packageDir));
};

const attachLink = (packageDir) => ([name, targetDir]) => {
  const fullTargetDir = path.resolve(packageDir, targetDir);

  attachPackageToTargetDir(name, fullTargetDir, packageDir);
};

module.exports = () => {
  searchPackages().then((paths = []) => paths.forEach(attachLinks));
};
