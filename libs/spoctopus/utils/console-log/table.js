const logTable = (payload = {}) => {
  const { collection, columns, messageEmpty } = payload;
  if (collection.length) logCollection(collection, columns);
  else console.log(messageEmpty || "Is empty");
};

const logCollection = (collection, columns) => {
  const maxLengths = columns.map(() => 0);
  collection
    .map(getMaxLengths(columns, maxLengths))
    .forEach(logLine(maxLengths));
};

const logLine = (maxLengths) => (line) => {
  const lineStr = line.map((column, index) => column.padEnd(maxLengths[index]));
  console.log(...lineStr);
};

const getMaxLengths = (columns, maxLengths) => (item) =>
  columns.map((callback, index) => {
    const value = callback(item);
    const length = value.length;

    if (maxLengths[index] < length) maxLengths[index] = length;

    return value;
  });

module.exports = { logTable };
