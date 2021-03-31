const {
  read,
  published: getPublished,
  linked: getLinked,
} = require("../utils/storage/state");

const list = () => {
  read();

  console.log("Published:");
  const published = Object.entries(getPublished());
  if (!published.length) console.log("List is empty");
  published.forEach(([packageName]) => console.log("-", packageName));

  console.log("");

  console.log("Linked:");
  const linked = Object.entries(getLinked());
  if (!linked.length) console.log("List is empty");
  linked.forEach(([packageName]) => console.log("-", packageName));
};

module.exports = { list };
