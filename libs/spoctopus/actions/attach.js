const path = require("path");

const getActionArgs = require("../utils/action/args").args;
// const attachLinks = require("../utils/links/attach").attach;
const attachDependencies = require("../utils/dependencies/attach").attach;
const glob = require("../utils/glob-promise").glob;
const SEARCH = require("../constants").SEARCH;

const getAuto = () => getActionArgs()[1].auto;

// Dependencies, Links
const attach = () => {
  if (getAuto) attachAuto();
  else attachCurrent();

  // attachDependencies();
  // if (getArgs()[1].auto) autoAttachLinks();
  // else attachLinks();
};

const attachAuto = () => {
  getSubDirs().then((dirs) => {
    dirs.forEach((dir) => {
      console.log(dir);
      attachDependencies(dir);
      // attachLinks();
    });
  });
};

const attachCurrent = () => {
  attachDependencies();
  // attachLinks();
};

const getSubDirs = () => {
  return glob(SEARCH.PATTERN, {
    cwd: process.cwd(),
    ignore: SEARCH.IGNORE,
  }).then((paths) => paths.map((value) => path.parse(value).dir));
};

module.exports = { attach };
