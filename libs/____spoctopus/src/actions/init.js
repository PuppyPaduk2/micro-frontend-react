const { getRef } = require("../action/ref");

const init = () => {
  console.log(getRef());
};

module.exports = { init };
