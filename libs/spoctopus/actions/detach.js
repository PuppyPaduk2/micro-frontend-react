const detachLinks = require("../utils/links/detach").detach;
const autoDetachLinks = require("../utils/links/detach").autoDetach;
const getArgs = require("../utils/action/args").args;

const detach = () => {
  if (getArgs()[1].auto) autoDetachLinks();
  else detachLinks();
};

module.exports = { detach };
