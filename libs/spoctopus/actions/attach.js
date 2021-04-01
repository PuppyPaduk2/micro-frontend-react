const attachLinks = require("../utils/links/attach").attach;
const autoAttachLinks = require("../utils/links/attach").autoAttach;
const getArgs = require("../utils/action/args").args;

const attach = () => {
  if (getArgs()[1].auto) autoAttachLinks();
  else attachLinks();
};

module.exports = { attach };
