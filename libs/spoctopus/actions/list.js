const path = require("path");

const {
  read,
  published: getPublished,
  linked: getLinked,
} = require("../utils/storage/state");
const getConfig = require("../utils/action/config").config;

const list = () => {
  read();

  console.log("Published:");
  const published = Object.entries(getPublished());
  if (!published.length) console.log("List is empty");
  published.forEach(([packageName]) => console.log("-", packageName));

  console.log("\nLinked:");
  const linked = Object.entries(getLinked());
  if (!linked.length) console.log("List is empty");
  let ref = { maxLength: 0 };
  getMaxLength(linked, ref).forEach(([packageName, { relativePath }]) => {
    const packageDir = path.resolve(getConfig().storageDir, relativePath);
    console.log("-", packageName.padEnd(ref.maxLength), ">", packageDir);
  });
};

const getMaxLength = (linked, ref) => {
  return linked.map((link) => {
    if (ref.maxLength < link[0].length) ref.maxLength = link[0].length;
    return link;
  });
};

module.exports = { list };
