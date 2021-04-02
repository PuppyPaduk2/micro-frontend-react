const path = require("path");

const { logTable } = require("../utils/console-log/table");

const {
  read,
  published: getPublished,
  linked: getLinked,
} = require("../utils/storage/state");
const getConfig = require("../utils/action/config").config;

const list = () => {
  read();

  console.log("Published:");
  logTable(getTablePayload(Object.entries(getPublished())));

  console.log("\nLinked:");
  logTable(getTablePayload(Object.entries(getLinked())));
};

const getTablePayload = (collection) => ({
  collection,
  columns: [
    () => "-",
    ([packageName]) => packageName,
    () => ">",
    ([, { relativePath }]) => {
      return path.resolve(getConfig().storageDir, relativePath);
    },
  ],
  messageEmpty: "List is empty",
});

module.exports = { list };
